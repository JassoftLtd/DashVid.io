console.log('add card to User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var stripe = require("stripe")(
    process.env.stripe_api_key
);

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event));
    console.log("identity: " + JSON.stringify(event.requestContext.identity.cognitoIdentityId));

    var payload = JSON.parse(event.body);

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    dynamodb.get({
        TableName: process.env.auth_db_table,
        Key:{
            "email": email
        },
        AttributesToGet: [
            'stripeCustomer',
            'email',
        ]
    }, function(err, data) {

        if (err) {
            console.error(err);
            context.fail();
        }
        else {
            if ('Item' in data) {
                var stripeCustomer = data.Item.stripeCustomer;
                if(stripeCustomer) {
                    console.log('Stripe Customer exists for user ' + data.Item.email + ' Updating record');

                    stripe.customers.update(data.Item.stripeCustomer, {
                        source: payload.token, // obtained with Stripe.js
                    }, function(err, customer) {
                        if (err) {
                            console.error(err);
                            context.fail();
                        }

                        var response = {
                            statusCode: responseCode,
                            headers: {
                                'Access-Control-Allow-Origin': '*'
                            },
                            body: JSON.stringify({
                                added: true
                            })
                        };
                        console.log("response: " + JSON.stringify(response));
                        context.succeed(response);
                    });

                }
                else {
                    console.log('Stripe Customer does not exist for user ' + data.Item.email + ' Creating record');

                    stripe.customers.create({
                        description: 'Customer for ' + data.Item.email,
                        email: data.Item.email,
                        source: payload.token // obtained with Stripe.js
                    }, function(err, customer) {
                        if (err) {
                            console.error(err);
                            context.fail();
                        }

                        console.log(JSON.stringify(customer));

                        dynamodb.update({
                            TableName: process.env.auth_db_table,
                            Key: {
                                "email": email
                            },
                            UpdateExpression: "set stripeCustomer = :customer",
                            ExpressionAttributeValues:{
                                ":customer":customer.id
                            },
                            ReturnValues:"UPDATED_NEW"
                        }, function(err, data) {
                            if (err) {
                                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                                context.fail();
                            } else {
                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

                                console.log('I guess we now need to subscribe the user to their chosen plan');
                                getUserPendingPlan(email, function (err, plan) {
                                    if (err) {
                                        console.error("Unable to get users pending plan. Error JSON:", JSON.stringify(err, null, 2));
                                        context.fail();
                                    }
                                    stripe.subscriptions.create({
                                            customer: customer.id,
                                            plan: plan
                                        }, function(err, subscription) {
                                            if (err) {
                                                console.error("Unable to create subscription. Error JSON:", JSON.stringify(err, null, 2));
                                                context.fail();
                                            }

                                            var response = {
                                                statusCode: responseCode,
                                                headers: {
                                                    'Access-Control-Allow-Origin': '*'
                                                },
                                                body: JSON.stringify({
                                                    added: true
                                                })
                                            };
                                            console.log("response: " + JSON.stringify(response));
                                            context.succeed(response);

                                        }
                                    );
                                });
                            }
                        });

                    });
                }
            } else {
                console.error('User [' + email + '] not found');
                context.fail();
            }
        }
    });

};

function getUserPendingPlan(email, fn) {
    console.log('Getting plan for user: ' + email);

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        FilterExpression: '#planStatus = :statusPending',
        ExpressionAttributeNames: {
            "#user":"User",
            "#planStatus":"PlanStatus",
        },
        ExpressionAttributeValues: {
            ":user":email,
            ":statusPending":"Pending"
        },
        ScanIndexForward: false,
        TableName: "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User not found: " + JSON.stringify(err));
            fn('User not found', null);
        }
        else {
            if(data.Count > 1) {
                console.error("User hads multiple pending Subscriptions: " + JSON.stringify(data));
                fn('User has multiple pending Subscriptions', null);
            }

            var plan = data.Items[0].Plan;
            console.log("User plan is " + plan);
            fn(null, plan);
        }
    });
}