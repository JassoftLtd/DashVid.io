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
		// "Limit": "100",
		"TableName": "Videos"
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        var dayGroups = [];

        for(var i = 0, len = data.Items.length; i<len; i+=1) {
            var video = data.Items[i];

            console.log("getUTCDay:" + new Date(video.RecordedDate).getUTCDay())
            console.log("getDate:" + new Date(video.RecordedDate).getDate())
            console.log("getDay:" + new Date(video.RecordedDate).getDay())

            var recordedDay = new Date(video.RecordedDate).getDate()

            if(!dayGroups[recordedDay]) {
            	dayGroups[recordedDay] = []
			}

            dayGroups[recordedDay] = video
        }

		var response = {
			statusCode: responseCode,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				videos: dayGroups
			})
		};

		console.log("response: " + JSON.stringify(response))
		context.succeed(response);
	});

};
