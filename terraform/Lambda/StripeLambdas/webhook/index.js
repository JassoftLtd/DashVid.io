console.log('Stripe Webhook');

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
        // case "customer.subscription.created":
        //     console.log("some logic for handing this type of event", type);
        //     break;
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
