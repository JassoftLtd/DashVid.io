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
    console.log("body: " + JSON.stringify(event.body));

    var response = {
        statusCode: responseCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    console.log("response: " + JSON.stringify(response));
    context.succeed(response);

};
