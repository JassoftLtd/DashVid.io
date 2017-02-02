console.log('Loading function');

// dependencies
var AWS = require('aws-sdk');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB().DocumentClient();

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
		TableName: event.stageVariables.auth_db_table,
		Key: {
			email: email
		}
	}, function(err, data) {
		if (err) return fn(err);
		else {
			if ('Item' in data) {
				var verified = data.Item.verified.BOOL;
				var verifyToken = null;
				if (!verified) {
					verifyToken = data.Item.verifyToken.S;
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
			TableName: event.stageVariables.auth_db_table,
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

function getUserPlanAndStatus(email, fn) {
    console.log('Getting plan for user: ' + email)

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        ExpressionAttributeNames: {
            "#user":"User",
        },
        ExpressionAttributeValues: {
            ":user":email,
        },
        "TableName": "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User Plan Error: " + JSON.stringify(err))
            fn('User not found', null, null)
        }
        else {
            if(data.Count > 1) {
                console.error("User had multiple pending Subscriptions: " + JSON.stringify(data))
                fn('User had multiple pending Subscriptions', null, null); // User not found
            }

            var plan = data.Items[0].Plan;
            var status = data.Items[0].PlanStatus;
            console.log("User plan is " + plan)
            fn(null, plan, status);
        }
    });
}

exports.handler = function(event, context) {

	var payload = JSON.parse(event.body);

	var email = payload.email;
	var verifyToken = payload.verify;

	getUser(event, email, function(err, verified, correctToken) {
		if (err) {
			responseError.body = new Error('Error in getUser: ' + err)
			context.fail(responseError);
		} else if (verified) {
			console.log('User already verified: ' + email);
			responseSuccess.body = JSON.stringify({
				verified: true
			})
			console.log("response: " + JSON.stringify(responseSuccess))
			context.succeed(responseSuccess);
		} else if (verifyToken == correctToken) {
			// User verified
			updateUser(event, email, function(err, data) {
				if (err) {
					responseError.body = new Error('Error in updateUser: ' + err)
					context.fail(responseError);
				} else {
					getUserPlanAndStatus(email, function (err, plan, status) {
                        if (err) {
                            responseError.body = new Error('Error in getting user plan: ' + err)
                            context.fail(responseError);
                        }
                        else {
                            console.log('User verified: ' + email);
                            responseSuccess.body = JSON.stringify({
                                verified: true,
								plan: plan,
								status: status
                            })
                            console.log("response: " + JSON.stringify(responseSuccess))
                            context.succeed(responseSuccess);
                        }
                    })
				}
			});
		} else {
			// Wrong token, not verified
			console.log('User [' + email + '] not verified using token [' + verifyToken + '] Token should be [' + correctToken + ']');
			responseSuccess.body = JSON.stringify({
				verified: false
			})
			console.log("response: " + JSON.stringify(responseSuccess))
			context.succeed(responseSuccess);
		}
	});
}
