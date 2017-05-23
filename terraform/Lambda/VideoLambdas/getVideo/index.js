console.log('Loading video for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videoId = event.pathParameters.id;

	dynamodb.get({
		TableName: "Videos",
		Key:{
			"Id": videoId
		}
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        var s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            useAccelerateEndpoint: true
        });

        var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

        if(currentUser !== data.Item.User) {
            console.error("Video does not belong to user");
            context.fail();
        }

        console.log('Getting video from Bucket [' + data.Item.Bucket + '] Key [' + data.Item.Key + ']');

        var url = s3.getSignedUrl('getObject', {
            Bucket: data.Item.Bucket,
            Key: data.Item.Key,
            Expires: 3600
        });

        var transcodedUrl;

        if(data.Item.TranscodedVideo) {
            transcodedUrl = s3.getSignedUrl('getObject', {
                Bucket: data.Item.TranscodedVideo.Bucket,
                Key: data.Item.TranscodedVideo.Key,
                Expires: 3600
            });
        }

        var response = {
            statusCode: responseCode,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                video: {
                    Id: data.Item.Id
                },
                originalUrl: url,
                url: transcodedUrl
            })
        };
        console.log("response: " + JSON.stringify(response));
        context.succeed(response);

	});
};
