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

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);

    var type = payload.type;

    console.log("Event Type: " + type);

    switch(type) {
        case "invoice.payment_succeeded":

            let plan = payload.data.object.lines.data[0].plan.id;
            let customer = payload.data.object.customer;

            console.log("Plan", plan);
            console.log("Customer", customer);

            getUserByStripeCustomerId(context, customer, function (user) {
                dynamodb.update({
                    TableName: "Subscriptions",
                    Key: {
                        "User": user
                    },
                    FilterExpression: '#planStatus = :statusPending and #plan = :plan',
                    ExpressionAttributeNames: {
                        "#planStatus": "PlanStatus",
                        "#plan": "Plan"
                    },
                    UpdateExpression: "set #planStatus = :statusActive",
                    ExpressionAttributeValues: {
                        ":statusPending": "Pending",
                        ":statusActive": "Active",
                        ":plan": plan
                    },
                    ReturnValues: "UPDATED_NEW"
                }, function (err, data) {
                    if (err) {
                        console.error("Unable to update subscription. Error JSON:", JSON.stringify(err, null, 2));
                        context.fail();
                    } else {

                        console.log("Updated plan to Active");

                        var response = {
                            statusCode: responseCode,
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
            });
            break;
        default:
            console.log("Unhandled event type: " + type);
            console.log(JSON.stringify(payload));
            break;
    }

    var response = {
        statusCode: responseCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    console.log("response: " + JSON.stringify(response));
    context.succeed(response);

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
        "TableName": "Users"
    }, function (err, data) {
        if (err) {
            console.error("User not found for Stripe Customer", cameraKey, err);
            context.fail();
        }
        else {
            console.log('DB Data: ', JSON.stringify(data.Items));

            let email = data.Items[0].User;
            console.log("User is " + email);
            fn(email);
        }
    });
}