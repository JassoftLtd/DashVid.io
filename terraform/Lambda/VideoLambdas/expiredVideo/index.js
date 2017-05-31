/*jshint loopfunc: true */
console.log('video expiring for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        var record = event.Records[i];

		var bucket = record.s3.bucket.name;
		var key = record.s3.object.key;

        let keyParts = key.split('/');

        //Extract the parts from the key
        var videoId = keyParts[2].split('.')[0];

        console.log('Video expired in bucket [' + bucket + '], Key [' + key + ']');

        dynamodb.update({
            TableName: "Videos",
            Key:{
                "Id": videoId
            },
            UpdateExpression: "remove Files.Original",
            ReturnValues:"UPDATED_NEW"
        }, function(err, data) {
            if (err) {
                console.error('Unable to update video status for videoId [' + videoId + ']. Error JSON:', JSON.stringify(err, null, 2));
                context.fail();
            } else {
                console.log("Video status updated succeeded:", JSON.stringify(data, null, 2));

                if (i == event.Records.length - 1) {
                    context.succeed();
                }
            }
        });
    }
};