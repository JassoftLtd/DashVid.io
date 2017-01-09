'use strict';
console.log('create video for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

var uuid = require('node-uuid');

exports.handler = function(event, context) {
	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))
    console.log("identity: " + JSON.stringify(event.requestContext.identity.cognitoIdentityId))

	var bucket = 'dash-cam-videos';
    const signedUrlExpireSeconds = 3600 // 1 hour

	var generatedId = uuid.v1();
	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];
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

            var s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            });

            const url = s3.getSignedUrl('putObject', {
                Bucket: bucket,
                Key: key,
                Expires: signedUrlExpireSeconds,
                ContentType: 'text/plain;charset=UTF-8'
            });

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