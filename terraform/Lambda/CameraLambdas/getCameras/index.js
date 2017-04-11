'use strict';
console.log('Loading cameras for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))

	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

	dynamodb.query({
		IndexName: "UserCameras",
		KeyConditionExpression:"#user = :user",
        ScanIndexForward: false,
		ExpressionAttributeNames: {
			"#user":"User",
		},
		ExpressionAttributeValues: {
			":user":currentUser,
		},
		"TableName": "Cameras"
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        var responseBody = []

        for(var i = 0; i < data.Items.length; i++) {
            var camera = data.Items[i];

            responseBody.push({
                    Id: camera.Id,
                    CameraKey: camera.CameraKey,
                    Name: camera.CameraName
                });
        }

        console.log("Cameras: " + JSON.stringify(responseBody))

		var response = {
			statusCode: responseCode,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(responseBody)
		};

		console.log("response: " + JSON.stringify(response))
		context.succeed(response);
	});

};