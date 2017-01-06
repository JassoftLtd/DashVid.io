'use strict';
console.log('create video for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var uuid = require('node-uuid');

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var bucket = 'dash-cam-videos';
    const signedUrlExpireSeconds = 60 * 10 // 10 mins

	var generatedId = uuid.v1();
	var currentUser = "TestUser";
	var uploadedDate = new Date().getTime().toString();
    var status = "PendingUpload";
    var key = currentUser + '/' + generatedId

	dynamodb.put({
		TableName: "Videos",
		Item: {
			Id: generatedId,
			User: currentUser,
			Uploaded: uploadedDate,
            VideoStatus: status,
			Key: key
		}
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }
		else {

            const url = s3.getSignedUrl('putObject', {
                Bucket: bucket,
                Key: key,
                Expires: signedUrlExpireSeconds
            })

            var responseBody = {
                url: url
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
        }
	});
};