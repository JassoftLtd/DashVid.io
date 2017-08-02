console.log('switching plan for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	console.log("request: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);

    var switchToPlan = payload.plan;

    console.log('User wants to switch to plan:', switchToPlan);

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

    // if switching to current active plan, then cancel any pending
    getUserPlan(context, email, 'Active', function (activePlan, activeStatus) { // Active Plan Found
        console.log('Current Plan:', activePlan);
        console.log('Current Plan Status:', activeStatus);

        if(activePlan === switchToPlan) {
            console.log("Cancel any pending plan");
            getUserPlan(context, email, 'Pending', function (pendingPlan, pendingStatus) {
                console.log("Has a pending plan that needs canceling:", pendingPlan, pendingStatus);
                getUserPlan(context, email, 'Pending', function (pendingPlan, pendingStatus) { // Pending Plan Found
                    setNewPlan(context, email, switchToPlan);
                }, function () { // Pending Plan Not Found
                    console.log("No Pending Plan to override", email);
                });

                successfulResponse(context, activePlan, activeStatus);
            });
        }

       setNewPlan(context, email, switchToPlan);

    }, function () { // Active Plan Not Found
        getUserPlan(context, email, 'Pending', function (pendingPlan, pendingStatus) { // Pending Plan Found

            console.log("Pending plan found for user");

            if(pendingPlan === switchToPlan) {
                console.log("User is already pending switch to this plan");
                successfulResponse(context, pendingPlan, pendingStatus);
            }

            console.log("Need to override pending plan");
            setNewPlan(context, email, switchToPlan);

        }, function () { // Pending Plan Not Found
            console.log("No Active or Pending plan found for User", email);
            setNewPlan(context, email, switchToPlan);
        });
    });

};

function getUserPlan(context, email, status, found, notFound) {
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
        ScanIndexForward: false,
        TableName: process.env.subscriptions_db_table,
    }, function(err, data) {
        if (err) {
            console.error("User Plan not found: " + JSON.stringify(err));
            context.fail('User Plan not found');
        }
        else {
            if(data.Count === 0) {
                notFound();
                return;
            }

            console.log("Items", JSON.stringify(data.Items));

            var plan = data.Items[0].Plan;
            var status = data.Items[0].PlanStatus;
            found(plan, status);
        }
    });
}

function updateUserPlan(context, email, plan, status) {
    console.log("Setting user plan", email, plan, status);

    dynamodb.put({
        TableName: process.env.subscriptions_db_table,
        Item: {
            User: email,
            Plan: plan,
            PlanStatus: status,
            SubscriptionTime: new Date().getTime()
        }
    }, function(err, data) {
        if (err) {
            responseError.body = new Error('Error storing plan: ' + err);
            context.fail(responseError);
        }

        successfulResponse(context, plan, status);
    });
}

function hasUserGotActiveCard(context, email, yes, no) {
    dynamodb.get({
        TableName: process.env.auth_db_table,
        Key:{
            "email": email
        },
        AttributesToGet: [
            'stripeCustomer',
            'email',
        ]
    }, function(err, data) {

            if (err) {
                console.error(err);
                context.fail();
                return;
            }

            var stripeCustomer = data.Item.stripeCustomer;
            if (stripeCustomer) {
                console.log('Stripe Customer exists for user', +data.Item.email);
                yes();
                return;
            }
            no();
        });
}

function setNewPlan(context, email, switchToPlan) {
    // if card attached or switching to free plan make new plan active immediately
    if(switchToPlan === 'free') {
        updateUserPlan(context, email, switchToPlan, 'Active');
        return;
    }

    // if plan switching to is not free check if user has card attached, if not make new plan pending
    hasUserGotActiveCard(context, email, function () { // yes
        console.log("User has active card");
        updateUserPlan(context, email, switchToPlan, 'Active');

    }, function () { // no
        console.log("User doesnt have active card");
        updateUserPlan(context, email, switchToPlan, 'Pending');

    });
}

function successfulResponse(context, plan, status) {
    var responseCode = 200;

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