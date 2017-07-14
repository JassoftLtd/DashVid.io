console.log('Stripe Webhook');

var AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
const dynamodb = new AWS.DynamoDB.DocumentClient();

const stripe = require("stripe")(
    process.env.stripe_api_key
);

exports.handler = function(event, context) {
    "use strict";

    console.log("event: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);

    var type = payload.type;

    console.log("Event Type: " + type);

    switch(type) {
        case "invoice.payment_succeeded":
            handleInvoicePaymentSucceeded(context, payload);
            break;
        case "customer.subscription.deleted":
            handleCustomerSubscriptionDeleted(context, payload);
            break;
        default:
            console.log("Unhandled event type: " + type);
            console.log(JSON.stringify(payload));

            var response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            };
            console.log("response: " + JSON.stringify(response));
            context.succeed(response);

            break;
    }

};

function getUserByStripeCustomerId(context, stripeCustomer, fn) {
    console.log('Getting User for StripeCustomerId', stripeCustomer);

    dynamodb.query({
        IndexName: "StripeCustomer",
        KeyConditionExpression: '#stripeCustomer = :stripeCustomer',
        ExpressionAttributeNames: {
            "#stripeCustomer": "stripeCustomer",
        },
        ExpressionAttributeValues: {
            ":stripeCustomer": stripeCustomer
        },
        TableName: "Users"
    }, function (err, data) {
        if (err) {
            console.error("User not found for Stripe Customer", stripeCustomer, err);
            context.fail();
            return;
        }

        if(data.Items.length === 0) {
            console.error("User not found for Stripe Customer", stripeCustomer);
            var response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            };
            console.log("response: " + JSON.stringify(response));
            context.succeed(response);
            return;
        }

        console.log('DB Data: ', JSON.stringify(data.Items));

        let email = data.Items[0].email;
        console.log("User is " + email);
        fn(email);
    });
}

function handleInvoicePaymentSucceeded(context, payload) {
    let plan = payload.data.object.lines.data[0].plan.id;
    let customer = payload.data.object.customer;

    console.log("Plan", plan);
    console.log("Customer", customer);

    getUserByStripeCustomerId(context, customer, function (user) {

        //Get Pending
        dynamodb.query({
            KeyConditionExpression:"#user = :user",
            FilterExpression: '#planStatus = :statusPending',
            ExpressionAttributeNames: {
                "#user":"User",
                "#planStatus":"PlanStatus",
            },
            ExpressionAttributeValues: {
                ":user":user,
                ":statusPending":"Pending"
            },
            ScanIndexForward: false,
            TableName: "Subscriptions"
        }, function(err, data) {
            if (err) {
                console.error("Error finding Pending plan: " + JSON.stringify(err));
                context.fail("Error finding Pending plan");
            }
            else {
                if (data.Items.length > 0) {
                    let pendingSubscription = data.Items[0];

                    //Delete Pending
                    dynamodb.delete({
                        TableName : 'Subscriptions',
                        Key: {
                            "User": pendingSubscription.User,
                            "SubscriptionTime": pendingSubscription.SubscriptionTime,
                        }
                    }, function (err, data) {
                        if (err) {
                            console.error("Error deleting Pending plan: " + JSON.stringify(err));
                            context.fail("Error deleting Pending plan");
                        }
                        else {
                            //Put Active

                            dynamodb.put({
                                TableName: "Subscriptions",
                                Item: {
                                    User: user,
                                    Plan: plan,
                                    PlanStatus: "Active",
                                    SubscriptionTime: new Date().getTime()
                                }
                            }, function(err, data) {
                                if (err) {
                                    responseError.body = new Error('Error storing Active plan: ' + err);
                                    context.fail("Error storing Active plan");
                                }
                                else {
                                    console.log("Updated plan to Active", plan);

                                    var response = {
                                        statusCode: 200,
                                        headers: {
                                            'Access-Control-Allow-Origin': '*'
                                        },
                                        body: JSON.stringify({
                                            message: "Updated plan to Active"
                                        })
                                    };
                                    console.log("response: " + JSON.stringify(response));
                                    context.succeed(response);
                                }
                            });

                        }

                    });
                }
            }
        });

    });
}

function handleCustomerSubscriptionDeleted(context, payload) {

    let customer = payload.data.object.customer;

    console.log("Customer", customer);

    getUserByStripeCustomerId(context, customer, function (user) {

        let plan = "free";
        let status = "Active";

        console.log("Setting user plan", user, plan, status);

        dynamodb.put({
            TableName: "Subscriptions",
            Item: {
                User: user,
                Plan: plan,
                PlanStatus: status,
                SubscriptionTime: new Date().getTime()
            },
            ConditionExpression: 'attribute_not_exists (email)'
        }, function (err, data) {
            if (err) {
                console.error("Error storing plan. Error JSON:", JSON.stringify(err, null, 2));
                context.fail();
                return;
            }

            var response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: "Downgraded Plan to Free"
                })
            };
            console.log("response: " + JSON.stringify(response));
            context.succeed(response);
        });
    });
}