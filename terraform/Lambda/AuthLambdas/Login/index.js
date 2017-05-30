// dependencies
var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
var crypto = require('crypto');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();
var cognitoidentity = new AWS.CognitoIdentity();

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
				var verified = data.Item.verified.BOOL;
				fn(null, hash, salt, verified);
			} else {
				fn(null, null); // User not found
			}
		}
	});
}

function getToken(event, email, fn) {
	var param = {
		IdentityPoolId: process.env.auth_identity_pool,
		Logins: {} // To have provider name in a variable
	};
	param.Logins[process.env.auth_developer_provider_name] = email;
	cognitoidentity.getOpenIdTokenForDeveloperIdentity(param,
		function(err, data) {
			if (err) return fn(err); // an error occurred
			else fn(null, data.IdentityId, data.Token); // successful response
		});
}

exports.handler = function(event, context) {
    "use strict";

	var payload = JSON.parse(event.body);

	var email = payload.email.toLowerCase();
	var clearPassword = payload.password;

	getUser(event, email, function(err, correctHash, salt, verified) {
		if (err) {
			responseError.body = new Error('Error in getUser: ' + err);
			context.fail(JSON.stringify(responseError));
		} else {
			if (correctHash === null) {
				// User not found
				console.log('User not found: ' + email);
				responseSuccess.body = JSON.stringify({
					login: false
				});
				console.log("response: " + JSON.stringify(responseSuccess));
				context.succeed(responseSuccess);
			} else if (!verified) {
				// User not verified
				console.log('User not verified: ' + email);
				responseSuccess.body = JSON.stringify({
					login: false,
					verified: false,
				});
				console.log("response: " + JSON.stringify(responseSuccess));
				context.succeed(responseSuccess);
			} else {
				computeHash(clearPassword, salt, function(err, salt, hash) {
					if (err) {
						responseError.body = new Error('Error in hash: ' + err);
						context.fail(JSON.stringify(responseError));
					} else {
						console.log('correctHash: ' + correctHash + ' hash: ' + hash);
						if (hash == correctHash) {
							// Login ok
							console.log('User logged in: ' + email);
							getToken(event, email, function(err, identityId, token) {
								if (err) {
									responseError.body = 'Error in getToken: ' + err;
									context.fail(JSON.stringify(responseError));
								} else {
									responseSuccess.body = JSON.stringify({
										login: true,
										identityId: identityId,
										token: token
									});
									console.log("response: " + JSON.stringify(responseSuccess));
									context.succeed(responseSuccess);
								}
							});
						} else {
							// Login failed
							console.log('User login failed: ' + email);
							responseSuccess.body = JSON.stringify({
								login:false
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
