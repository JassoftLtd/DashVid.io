'use strict';
console.log('Loading videos for User');

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videoFromDynamoDB = {}


	var responseBody = {
		video: videosFromDynamoDB
	};
	var response = {
		statusCode: responseCode,
		headers: {
		},
		body: JSON.stringify(responseBody)
	};
	console.log("response: " + JSON.stringify(response))
	context.succeed(response);
};