'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))
    console.log("identity: " + JSON.stringify(event.requestContext.identity))

	var currentUser = "TestUser";

	dynamodb.query({
		IndexName: "UserVideosByDate",
		KeyConditionExpression:"#user = :user",
        ScanIndexForward: false,
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
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				videos: data.Items
			})
		};
		console.log("response: " + JSON.stringify(response))
		context.succeed(response);
	});

};
