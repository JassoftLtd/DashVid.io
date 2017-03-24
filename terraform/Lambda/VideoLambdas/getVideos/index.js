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

        var responseBody = new Object();
		responseBody.videos = []

        for(var i = 0; i < data.Items.length; i++) {
            var video = data.Items[i];

            var recordedDate = new Date(video.RecordedDate)

            recordedDate.setHours(0)
            recordedDate.setMinutes(0)
            recordedDate.setSeconds(0)
            recordedDate.setMilliseconds(0)

            recordedDate = recordedDate.getTime().toString()

            let recordForDate = getRecordForDate(responseBody.videos, recordedDate)
            if(!recordForDate) {
                responseBody.videos.push({date: recordedDate, videos: []})
                recordForDate = getRecordForDate(responseBody.videos, recordedDate)
			}

            recordForDate.videos.push(video)
			console.log("recordForDate: " + JSON.stringify(recordForDate))
        }

        console.log("dayGroups: " + JSON.stringify(responseBody))

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


function getRecordForDate(collection, date) {
    for(var i = 0; i < collection.length; i++) {
        var record = collection[i];

        if(record.date == date)
        	return record
    }
}