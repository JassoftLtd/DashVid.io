// dependencies
var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');

const uuidV4 = require('uuid/v4');

// Get reference to AWS clients
var dynamodb;
var ses;

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
		crypto.pbkdf2(password, salt, iterations, len, digest, fn);
	} else {
		fn = salt;
		crypto.randomBytes(len, function(err, salt) {
			if (err) return fn(err);
			salt = salt.toString('base64');
			crypto.pbkdf2(password, salt, iterations, len, digest, function(err, derivedKey) {
                if (err) {
                    responseError.body = new Error('Error in hash: ' + err);
                    context.fail(responseError);
                }
                else {
                    fn(salt, derivedKey.toString('base64'));
                }
			});
		});
	}
}

function storeUser(context, email, hash, salt, fn) {

	// Bytesize
	var len = 128;
	crypto.randomBytes(len, function(err, token) {
		if (err) return fn(err);
		token = token.toString('hex');

        if(process.env.token_override && process.env.token_override !== '') {
            console.log('Auth token override: ' + process.env.token_override);
            token = process.env.token_override;
        }

        console.log('Storing User in [' + process.env.auth_db_table + ']: ' + email);

		dynamodb.put({
			TableName: process.env.auth_db_table,
			Item: {
				email: email,
				passwordHash: hash,
				passwordSalt: salt,
				verified: false,
				verifyToken: token
			},
			ConditionExpression: 'attribute_not_exists (email)'
		}, function(err, data) {
            if (err) {
                if (err.code == 'ConditionalCheckFailedException') {
                    // userId already found
                    responseSuccess.body = JSON.stringify({
                        created: false
                    });
                    console.log("response: " + JSON.stringify(responseSuccess));
                    context.succeed(responseSuccess);
                } else {
                    console.error('Error in storeUser: ' + err);
                    responseError.body = new Error('Error in storeUser: ' + err);
                    context.fail(responseError);
                }
            }
            else {
                fn(token);
            }
		});
	});
}

function storePlan(email, plan, token, fn) {

    console.log('Storing Plan: Free');

	dynamodb.put({
		TableName: process.env.subscriptions_db_table,
		Item: {
			User: email,
			Plan: "free",
            PlanStatus: "Active",
            SubscriptionTime: new Date().getTime()
		}
	}, function(err, data) {
		if (err) {
            responseError.body = new Error('Error storing plan: ' + err);
            context.fail(responseError);
		}
		else {
			// If plan is free then carry on
			if(plan == "free") {
                fn(email, token);
            }
            else {
			//	If plan isn't free then add it as pending
				storePaidPlan(email, plan, token, fn);
			}
        }
	});
}

function storePaidPlan(email, plan, token, fn) {

    console.log('Storing Plan: ' + plan);

	dynamodb.put({
		TableName: process.env.subscriptions_db_table,
		Item: {
			User: email,
			Plan: plan,
            PlanStatus: "Pending",
            SubscriptionTime: new Date().getTime()
		}
	}, function(err, data) {
		if (err) {
            responseError.body = new Error('Error storing plan: ' + err);
            context.fail(responseError);
		}
		else {
			fn(email, token);
        }
	});
}

function createCamera(email, fn) {

    let generatedId = uuidV4();

    console.log('Creating Camera: ' + generatedId);

	dynamodb.put({
		TableName: process.env.cameras_db_table,
		Item: {
			Id: generatedId,
			User: email,
            CameraKey: uuidV4(),
            CameraName: 'Camera 1',
		}
	}, function(err, data) {
		if (err) {
            responseError.body = new Error('Error creating Camera: ' + err);
            context.fail(responseError);
		}
		else fn(email);
	});
}

function sendVerificationEmail(email, token, fn) {

	console.log('Sending Email to User: ' + email);

	var subject = 'Verification Email for ' + process.env.auth_application_name;
	var verificationLink = process.env.auth_verification_page + '?email=' + encodeURIComponent(email) + '&verify=' + token;
	ses.sendEmail({
		Source: process.env.auth_email_from_address,
		Destination: {
			ToAddresses: [
				email
			]
		},
		Message: {
			Subject: {
				Data: subject
			},
			Body: {
				Html: {
					Data: '<html><head>' +
					'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
					'<title>' + subject + '</title>' +
					'</head><body>' +
					'Please <a href="' + verificationLink + '">click here to verify your email address</a> or copy & paste the following link in a browser:' +
					'<br><br>' +
					'<a href="' + verificationLink + '">' + verificationLink + '</a>' +
					'</body></html>'
				}
			}
		}
	}, fn);
}

exports.handler = function(event, context) {
    "use strict";

    dynamodb = new AWS.DynamoDB.DocumentClient();
    ses = new AWS.SES();

	var payload = JSON.parse(event.body);

	var email = payload.email.toLowerCase();
	var clearPassword = payload.password;
    var plan = payload.plan.toLowerCase();

	computeHash(clearPassword, function(salt, hash) {
		storeUser(context, email, hash, salt, function(token) {
			storePlan(email, plan, token, function (email, token) {
				createCamera(email, function (email) {
					sendVerificationEmail(email, token, function(err, data) {
						if (err) {
							console.error(err);
							responseError.body = new Error('Error in sendVerificationEmail: ' + err);
							context.fail(responseError);
						} else {
							responseSuccess.body = JSON.stringify({
								created: true
							});

							console.log("response: " + JSON.stringify(responseSuccess));
							context.succeed(responseSuccess);
						}
					});
                });
			});
		});
	});
};
