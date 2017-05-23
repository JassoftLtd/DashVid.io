console.log('Loading ChangePassword function');

// dependencies
var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
var crypto = require('crypto');

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

function computeHash(password, salt, fn) {
	// Bytesize
	var len = 128;
	var iterations = 4096;
    var digest = 'SHA512';

	if (3 == arguments.length) {
		crypto.pbkdf2(password, salt, iterations, len, digest, function(err, derivedKey) {
			if (err) return fn(err);
			else fn(null, salt, derivedKey.toString('base64'));
		});
	} else {
		fn = salt;
		crypto.randomBytes(len, function(err, salt) {
			if (err) return fn(err);
			salt = salt.toString('base64');
			computeHash(password, salt, fn);
		});
	}
}

function getUser(event, email, fn) {
	dynamodb.getItem({
		TableName: process.env.auth_db_table,
		Key: {
			email: {
				S: email
			}
		}
	}, function(err, data) {
		if (err) return fn(err);
		else {
			if ('Item' in data) {
				var hash = data.Item.passwordHash.S;
				var salt = data.Item.passwordSalt.S;
				fn(null, hash, salt);
			} else {
				fn(null, null); // User not found
			}
		}
	});
}

function updateUser(event, email, password, salt, fn) {
	dynamodb.updateItem({
			TableName: process.env.auth_db_table,
			Key: {
				email: {
					S: email
				}
			},
			AttributeUpdates: {
				passwordHash: {
					Action: 'PUT',
					Value: {
						S: password
					}
				},
				passwordSalt: {
					Action: 'PUT',
					Value: {
						S: salt
					}
				}
			}
		},
		fn);
}

exports.handler = function(event, context) {
    "use strict";

	var payload = JSON.parse(event.body);

	console.log('Payload: ' + JSON.stringify(payload));

	var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();
	var oldPassword = payload.oldPassword;
	var newPassword = payload.newPassword;

	getUser(event, email, function(err, correctHash, salt) {
		if (err) {
			responseError.body = JSON.stringify(new Error('Error in getUser: ' + JSON.stringify(err)));
            console.log(JSON.stringify(responseError.body));
			context.fail(responseError);
		} else {
			if (correctHash === null) {
				// User not found
				console.log('User not found: ' + email);
				responseSuccess.body = JSON.stringify({
					changed: false
				});
				console.log("response: " + JSON.stringify(responseSuccess));
				context.succeed(responseSuccess);
			} else {
				computeHash(oldPassword, salt, function(err, salt, hash) {
					if (err) {
						responseError.body = JSON.stringify(new Error('Error in hash: ' + err));
                        console.log(JSON.stringify(responseError.body));
						context.fail(responseError);
					} else {
						if (hash == correctHash) {
							// Login ok
							console.log('User logged in: ' + email);
							computeHash(newPassword, function(err, newSalt, newHash) {
								if (err) {
									responseError.body = JSON.stringify(new Error('Error in computeHash: ' + err));
                                    console.log(JSON.stringify(responseError.body));
									context.fail(responseError);
								} else {
									updateUser(event, email, newHash, newSalt, function(err, data) {
										if (err) {
											responseError.body = JSON.stringify(new Error('Error in updateUser: ' + err));
                                            console.log(JSON.stringify(responseError.body));
											context.fail(responseError);
										} else {
											console.log('User password changed: ' + email);
											responseSuccess.body = JSON.stringify({
												changed: true
											});
											console.log("response: " + JSON.stringify(responseSuccess));
											context.succeed(responseSuccess);
										}
									});
								}
							});
						} else {
							// Login failed
							console.log('User login failed: ' + email);
							responseSuccess.body = JSON.stringify({
								changed: false
							});
							console.log("response: " + JSON.stringify(responseSuccess));
							context.succeed(responseSuccess);
						}
					}
				});
			}
		}
	});
};
