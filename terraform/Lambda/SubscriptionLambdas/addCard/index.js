'use strict';
console.log('add card to User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var stripe = require("stripe")(
    process.env.stripe_api_key
);

exports.handler = function(event, context) {
	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))
    console.log("identity: " + JSON.stringify(event.requestContext.identity.cognitoIdentityId))

    var payload = JSON.parse(event.body);

	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];
    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    dynamodb.get({
        TableName: event.stageVariables.auth_db_table,
        Key:{
            "email": email
        }
    }, function(err, data) {

        if (err) {
            console.error(err)
            context.fail()
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
                            console.error(err)
                            context.fail()
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
                        console.log("response: " + JSON.stringify(response))
                        context.succeed(response);
                    });

                }
                else {
                    console.log('Stripe Customer does not exist for user ' + data.Item.email + ' Creating record');

                    stripe.customers.create({
                        description: 'Customer for ' + data.Item.email,
                        source: payload.token, // obtained with Stripe.js
                        metadata: {
                            email: data.Item.email
                        }
                    }, function(err, customer) {
                        if (err) {
                            console.error(err)
                            context.fail()
                        }

                        console.log(JSON.stringify(customer))

                        dynamodb.update({
                            TableName: event.stageVariables.auth_db_table,
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
                                context.fail()
                            } else {
                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));

                                // TODO I guess we now need to subscribe the user to their chosen plan
                                console.log('I guess we now need to subscribe the user to their chosen plan')

                                var response = {
                                    statusCode: responseCode,
                                    headers: {
                                        'Access-Control-Allow-Origin': '*'
                                    },
                                    body: JSON.stringify({
                                        added: true
                                    })
                                };
                                console.log("response: " + JSON.stringify(response))
                                context.succeed(response);
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
