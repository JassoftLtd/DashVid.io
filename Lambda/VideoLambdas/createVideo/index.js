'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();

var uuid = require('node-uuid');

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var generatedId = uuid.v1();
	var currentUser = "TestUser";
	var uploadedDate = new Date().getTime().toString();

	dynamodb.putItem({
		TableName: "Videos",
		Item: {
			Id: {
				S: generatedId
			},
			User: {
				S: currentUser
			},
			Uploaded: {
				S: uploadedDate
			}
		}
	}, function(err, data) {
		if (err)
			return context.fail(err);
		else
			var responseBody = {
				videoId: generatedId
			};
			var response = {
				statusCode: responseCode,
				headers: {
				},
				body: JSON.stringify(responseBody)
			};
			console.log("response: " + JSON.stringify(response))
			context.succeed(response);
	});
};