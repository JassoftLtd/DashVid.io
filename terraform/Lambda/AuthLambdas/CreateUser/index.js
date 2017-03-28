// dependencies
const AWS = require('aws-sdk');
const crypto = require('crypto');

// Get reference to AWS clients
const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

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
	var digest = 'SHA1';

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

function storeUser(email, hash, salt, fn) {

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

	planStatus = plan == "free" ? "Active" : "Pending";

    console.log('Storing Plan: ' + plan);

	dynamodb.put({
		TableName: process.env.subscriptions_db_table,
		Item: {
			User: email,
			Plan: plan,
            PlanStatus: planStatus,
            SubscriptionTime: new Date().getTime()
		},
		ConditionExpression: 'attribute_not_exists (email)'
	}, function(err, data) {
		if (err) {
            responseError.body = new Error('Error storing plan: ' + err);
            context.fail(responseError);
		}
		else fn(email, token);
	});
}

function sendVerificationEmail(email, token, fn) {

	console.log('Email Disabled Status:' + process.env.email_disabled);

    if(process.env.email_disabled === false) {

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
    else {
    	fn(null, null);
	}
}

exports.handler = function(event, context) {
    "use strict";

	var payload = JSON.parse(event.body);

	var email = payload.email;
	var clearPassword = payload.password;
    var plan = payload.plan.toLowerCase();

	computeHash(clearPassword, function(salt, hash) {
		storeUser(email, hash, salt, function(token) {
			storePlan(email, plan, token, function (email, token) {
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
};
