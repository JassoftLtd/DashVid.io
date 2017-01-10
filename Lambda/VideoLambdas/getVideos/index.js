'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))

	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

	dynamodb.query({
		IndexName: "UserVideosByDate",
		KeyConditionExpression:"#user = :user",
        "FilterExpression": '#videoStatus = :status',
        ScanIndexForward: false,
		ExpressionAttributeNames: {
			"#user":"User",
			"#videoStatus":"VideoStatus",
		},
		ExpressionAttributeValues: {
			":user":currentUser,
            ":status":"Uploaded"
		},
		"Limit": "100",
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
