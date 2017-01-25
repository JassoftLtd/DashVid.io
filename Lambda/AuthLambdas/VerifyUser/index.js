console.log('Loading function');

// dependencies
var AWS = require('aws-sdk');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();

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
	dynamodb.getItem({
		TableName: event.stageVariables.auth_db_table,
		Key: {
			email: {
				S: email
			}
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
	dynamodb.updateItem({
			TableName: event.stageVariables.auth_db_table,
			Key: {
				email: {
					S: email
				}
			},
			AttributeUpdates: {
				verified: {
					Action: 'PUT',
					Value: {
						BOOL: true
					}
				},
				verifyToken: {
					Action: 'DELETE'
				}
			}
		},
		fn);
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
					console.log('User verified: ' + email);
					responseSuccess.body = JSON.stringify({
						verified: true
					})
					console.log("response: " + JSON.stringify(responseSuccess))
					context.succeed(responseSuccess);
				}
			});
		} else {
			// Wrong token, not verified
			console.log('User not verified: ' + email);
			responseSuccess.body = JSON.stringify({
				verified: false
			})
			console.log("response: " + JSON.stringify(responseSuccess))
			context.succeed(responseSuccess);
		}
	});
}
