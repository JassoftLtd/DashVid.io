console.log('Stripe Webhook');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var stripe = require("stripe")(
    process.env.stripe_api_key
);

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);

    console.log("body: " + payload);

    var type = payload.type;

    console.log("type: " + type);

    switch(type) {
        case "customer.subscription.created":
            console.log("some logic for handing this type of event", type);
            break

        default:
            console.log("Unhandled event type: " + type);
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
