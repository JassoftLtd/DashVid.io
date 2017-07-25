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

function activePlanFilter(plan) {
    return plan.PlanStatus == "Active";
}

function pendingPlanFilter(plan) {
    return plan.PlanStatus == "Pending";
}

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
        ScanIndexForward: false,
        TableName: "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User not found: " + JSON.stringify(err));
            fn('User not found', null);
        }
        else {

            console.log("Plans", data.Items);

            var activePlan = data.Items.filter(activePlanFilter)[0];
            var pendingPlans = data.Items.filter(pendingPlanFilter);

            console.log("activePlan", activePlan);
            console.log("pendingPlans", pendingPlans);

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
