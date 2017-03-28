'use strict';
console.log('Loading plan for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();


    getUserPlan(email, function (err, plan, status) {
        if (err) {
            context.fail(err)
        }

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
        console.log("response: " + JSON.stringify(response))
        context.succeed(response);
    })
};


function getUserPlan(email, fn) {
    console.log('Getting plan for user: ' + email)

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
            console.error("User not found: " + JSON.stringify(err))
            fn('User not found', null)
        }
        else {
            if(data.Count > 1) {
                console.error("User had multiple active Subscriptions: " + JSON.stringify(data))
                fn('User had multiple active Subscriptions', null); // User not found
            }

            var plan = data.Items[0].Plan;
            var status = data.Items[0].PlanStatus;
            console.log("User plan is " + plan)
            fn(null, plan, status);
        }
    });
}