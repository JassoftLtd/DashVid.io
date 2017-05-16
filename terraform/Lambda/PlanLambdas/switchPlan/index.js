console.log('switching plan for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);

    var switchToPlan = payload.plan;

    console.log('User wants to switch to plan:', switchToPlan);

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    // if switching to current active plan, then cancel any pending
    getUserPlan(function (plan, status) {

    });

    // if plan switching to is not free check if user has card attached, if not make new plan pending

    // if card attached or switching to free plan make new plan active immediately

    var responseBody = {
        plan: plan,
        status: status
    };
    var response = {
        statusCode: responseCode,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response));
    context.succeed(response);

};

function getUserPlan(context, email, fn) {
    console.log('Getting plan for user: ' + email);

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        FilterExpression: '#planStatus in (:statusActive, :statusPending)',
        ExpressionAttributeNames: {
            "#user":"User",
            "#planStatus":"PlanStatus",
        },
        ExpressionAttributeValues: {
            ":user":email,
            ":statusActive":"Active",
            ":statusPending":"Pending"
        },
        "TableName": "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User not found: " + JSON.stringify(err));
            context.fail('User not found');
        }
        else {
            if(data.Count > 1) {
                console.error("User had multiple active Subscriptions: " + JSON.stringify(data));
                context.fail('User had multiple active Subscriptions'); // User not found
            }

            var plan = data.Items[0].Plan;
            var status = data.Items[0].PlanStatus;
            console.log("User plan is " + plan);
            fn(plan, status);
        }
    });
}