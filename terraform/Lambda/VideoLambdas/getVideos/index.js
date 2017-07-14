console.log('Loading videos for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;

    console.log("event: " + JSON.stringify(event));

	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

	dynamodb.query({
		IndexName: "UserVideosByDay",
		KeyConditionExpression:"#user = :user",
        ScanIndexForward: false,
		ExpressionAttributeNames: {
			"#user":"User",
		},
		ExpressionAttributeValues: {
			":user":currentUser
		},
		TableName: "Videos"
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        var responseBody = [];

        for(var i = 0; i < data.Items.length; i++) {
            var video = data.Items[i];

            let recordForDate = getRecordForDate(responseBody, video.RecordedDay);
            if(!recordForDate) {
                responseBody.push({date: video.RecordedDay, videos: []});
                recordForDate = getRecordForDate(responseBody, video.RecordedDay);
			}

			var videoDate = {
                Id: video.Id,
                RecordedDate: parseInt(video.RecordedDate, 10),
                VideoDuration: parseInt(video.VideoDuration, 10),
			};

            recordForDate.videos.push(videoDate);
        }

        for(var o = 0; o < responseBody.length; o++) {
        	let day = responseBody[o];

        	day.videos.sort(function(videoA, videoB) {
        		return videoB.RecordedDate-videoA.RecordedDate;
        	});

            responseBody[o] = day;
        }

        console.log("dayGroups: " + JSON.stringify(responseBody));

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


function getRecordForDate(collection, date) {
    for(var i = 0; i < collection.length; i++) {
        var record = collection[i];

        if(record.date == date)
        	return record;
    }
}