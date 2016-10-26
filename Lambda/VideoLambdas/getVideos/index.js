'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;

	var currentUser = "TestUser";

	dynamodb.query({
		IndexName: "UserVideosByDate",
		KeyConditionExpression:"#user = :user",
		ExpressionAttributeNames: {
			"#user":"User",
		},
		ExpressionAttributeValues: {
			":user":currentUser
		},
		"Limit": "10",
		"TableName": "Videos"
	}, function(err, data) {
		if (err)
			return context.fail(err);
		else
		var response = {
			statusCode: responseCode,
			headers: {
			},
			body: JSON.stringify({
				videos: data.Items
			})
		};
		console.log("response: " + JSON.stringify(response))
		context.succeed(response);
	});

};
