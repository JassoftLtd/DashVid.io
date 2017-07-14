// dependencies
var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var responseSuccess = {
	statusCode: 200,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};

var responseError = {
	statusCode: 500,
	headers: {
		'Access-Control-Allow-Origin': '*'
	}
};

function getUser(event, email, fn) {
	dynamodb.get({
		TableName: process.env.auth_db_table,
		Key: {
			email: email
		},
        AttributesToGet: [
            'verified',
            'verifyToken',
        ]
	}, function(err, data) {
		if (err) return fn(err);
		else {
			if ('Item' in data) {
				var verified = data.Item.verified.BOOL;
				var verifyToken = null;
				if (!verified) {
					verifyToken = data.Item.verifyToken;
				}
				fn(null, verified, verifyToken);
			} else {
				fn(null, null); // User not found
			}
		}
	});
}

function updateUser(event, email, fn) {
	dynamodb.update({
			TableName: process.env.auth_db_table,
			Key: {
				email: email
			},
            UpdateExpression: "set verified = :verified, verifyToken = :verifyToken",
            ExpressionAttributeValues:{
                ":verified":true,
                ":verifyToken":null
            },
            ReturnValues:"UPDATED_NEW"
		},
		fn);
}

function activePlanFilter(plan) {
    return plan.PlanStatus == "Active";
}

function pendingPlanFilter(plan) {
    return plan.PlanStatus == "Pending";
}

function getUserPlanAndStatus(email, fn) {
    console.log('Getting plan for user: ' + email);

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        ExpressionAttributeNames: {
            "#user":"User",
        },
        ExpressionAttributeValues: {
            ":user":email,
        },
        ScanIndexForward: false,
        TableName: "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User Plan Error: " + JSON.stringify(err));
            fn('User not found', null, null);
        }
        else {
            var activePlan = data.Items.filter(activePlanFilter)[0];
            var pendingPlans = data.Items.filter(pendingPlanFilter);

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

exports.handler = function(event, context) {
    "use strict";

	var payload = JSON.parse(event.body);

	var email = payload.email.toLowerCase();
	var verifyToken = payload.verify;

	getUser(event, email, function(err, verified, correctToken) {
		if (err) {
			responseError.body = new Error('Error in getUser: ' + err);
			context.fail(responseError);
		} else if (verified) {
			console.log('User already verified: ' + email);
			responseSuccess.body = JSON.stringify({
				verified: true
			});
			console.log("response: " + JSON.stringify(responseSuccess));
			context.succeed(responseSuccess);
		} else if (verifyToken == correctToken) {
			// User verified
			updateUser(event, email, function(err, data) {
				if (err) {
					responseError.body = new Error('Error in updateUser: ' + err);
					context.fail(responseError);
				} else {
					getUserPlanAndStatus(email, function (err, plan, status, pendingPlan) {
                        if (err) {
                            responseError.body = new Error('Error in getting user plan: ' + err);
                            context.fail(responseError);
                        }
                        else {
                            console.log('User verified: ' + email);
                            responseSuccess.body = JSON.stringify({
                                verified: true,
                                plan: plan,
                                status: status,
                                pendingPlan: pendingPlan
                            });
                            console.log("response: " + JSON.stringify(responseSuccess));
                            context.succeed(responseSuccess);
                        }
                    });
				}
			});
		} else {
			// Wrong token, not verified
			console.log('User [' + email + '] not verified using token [' + verifyToken + '] Token should be [' + correctToken + ']');
			responseSuccess.body = JSON.stringify({
				verified: false
			});
			console.log("response: " + JSON.stringify(responseSuccess));
			context.succeed(responseSuccess);
		}
	});
};
