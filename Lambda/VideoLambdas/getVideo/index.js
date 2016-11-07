'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videoId = event.pathParameters["id"];
	var currentUser = "TestUser";


	dynamodb.get({
		TableName: "Videos",
		Key:{
			"Id": videoId
		}
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
				video: data.Item
			})
		};
		console.log("response: " + JSON.stringify(response))
		context.succeed(response);
	});

};
