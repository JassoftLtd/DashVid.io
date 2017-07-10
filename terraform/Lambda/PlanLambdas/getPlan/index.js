console.log('Loading plan for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    getUserPlan(email, function (err, plan, status, pendingPlan) {
        if (err) {
            context.fail(err);
        }

        var responseBody = {
            plan: plan,
            status: status,
            pendingPlan: pendingPlan
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
    });
};


function getUserPlan(email, fn) {
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
            fn('User not found', null);
        }
        else {
            if(data.Count > 1) {
                console.error("User had multiple active Subscriptions: " + JSON.stringify(data));
                fn('User had multiple active Subscriptions', null); // User not found
            }

            var activePlan = data.Items[0].filter(activePlan)[0];
            var pendingPlans = data.Items[0].filter(pendingPlan);

            var plan = activePlan.Plan;
            var status = activePlan.PlanStatus;
            var pendingPlan;

            if(pendingPlans.length > 0) {
                pendingPlan = {
                    plan: pendingPlans[0].Plan,
                    status: pendingPlans[0].PlanStatus
                };
	    }

            console.log("User plan is " + plan);
            fn(null, plan, status, pendingPlan);
        }
    });
}

function activePlan(plan) {
    return plan.PlanStatus == "Active";
}

function pendingPlan(plan) {
    return plan.PlanStatus == "Pending";
}
