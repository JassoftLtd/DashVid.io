console.log('Loading cameras for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event));

    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();

	dynamodb.query({
		IndexName: "UserCameras",
        KeyConditionExpression:"#user = :user",
        ExpressionAttributeNames: {
            "#user":"User",
        },
        ExpressionAttributeValues: {
            ":user":email,
        },
		TableName: "Cameras"
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        console.log("DynamoDB Result:" + JSON.stringify(data.Items));

        var responseBody = [];

        for(var i = 0; i < data.Items.length; i++) {
            var camera = data.Items[i];

            responseBody.push({
                    Id: camera.Id,
                    CameraKey: camera.CameraKey,
                    Name: camera.CameraName
                });
        }

        console.log("Cameras: " + JSON.stringify(responseBody));

		var response = {
			statusCode: responseCode,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(responseBody)
		};

		console.log("response: " + JSON.stringify(response));
		context.succeed(response);
	});

};