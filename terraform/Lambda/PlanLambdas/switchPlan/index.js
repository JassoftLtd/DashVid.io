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
    getUserPlan(context, email, 'Active', function (plan, status) {
        console.log('Current Plan:', plan);
        console.log('Current Plan Status:', status);

        if(plan === switchToPlan) {
            console.log("Cancel any pending plan");
            getUserPlan(context, email, 'Pending', function (plan, status) {
                console.log("Has a pending plan that needs canceling:", plan, status);

                successfulResponse(context, plan, status);
            });
        }

        successfulResponse(context, plan, status);

    });

    // if plan switching to is not free check if user has card attached, if not make new plan pending

    // if card attached or switching to free plan make new plan active immediately

};

function getUserPlan(context, email, status, fn) {
    console.log('Getting plan for user:', email, status);

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        FilterExpression: '#planStatus = :status',
        ExpressionAttributeNames: {
            "#user":"User",
            "#planStatus":"PlanStatus",
        },
        ExpressionAttributeValues: {
            ":user":email,
            ":status":status
        },
        "TableName": "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User Plan not found: " + JSON.stringify(err));
            context.fail('User Plan not found');
        }
        else {
            if(data.Count > 1) {
                console.error("User has multiple active Subscriptions: " + JSON.stringify(data));
                context.fail('User has multiple active Subscriptions');
            }

            console.log("Items", JSON.stringify(data.Items));

            var plan = data.Items[0].Plan;
            var status = data.Items[0].PlanStatus;
            fn(plan, status);
        }
    });
}

function successfulResponse(context, plan, status) {
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
}