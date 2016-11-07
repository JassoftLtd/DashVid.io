'use strict';
console.log('Loading videos for User');

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videosFromDynamoDB = []

	var responseBody = {
		videos: videosFromDynamoDB
	};
	var response = {
		statusCode: responseCode,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify(responseBody)
	};
	console.log("response: " + JSON.stringify(response))
	context.succeed(response);
};