console.log('Loading function');

// dependencies
var AWS = require('aws-sdk');
var config = require('./config.json');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();


function getUser(email, fn) {
	dynamodb.getItem({
		TableName: config.DDB_TABLE,
		Key: {
			email: {
				S: email
			}
		}
	}, function(err, data) {
		if (err) return fn(err);
		else {
			if (('Item' in data) && ('lostToken' in data.Item)) {
				var lostToken = data.Item.lostToken.S;
				fn(null, lostToken);
			} else {
				fn(null, null); // User or token not found
			}
		}
	});
}


exports.handler = function(event, context) {
	var email = event.email;
	var lostToken = event.lost;
	var newPassword = event.password;

	getUser(email, function(err, correctToken) {
		if (err) {
			context.fail('Error in getUser: ' + err);
		} else if (!correctToken) {
			console.log('No lostToken for user: ' + email);
			context.succeed({
				changed: false
			});
		} else if (lostToken != correctToken) {
			// Wrong token, no password lost
			console.log('Wrong lostToken for user: ' + email);
			context.succeed({
				changed: false
			});
		} else {
			console.log('User logged in: ' + email);
			computeHash(newPassword, function(err, newSalt, newHash) {
				if (err) {
					context.fail('Error in computeHash: ' + err);
				} else {
					updateUser(email, newHash, newSalt, function(err, data) {
						if (err) {
							context.fail('Error in updateUser: ' + err);
						} else {
							console.log('User password changed: ' + email);
							context.succeed({
								changed: true
							});
						}
					});
				}
			});
		}
	});
}
