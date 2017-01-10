'use strict';
console.log('Loading videos for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videoId = event.pathParameters["id"];
    var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];


	dynamodb.get({
		TableName: "Videos",
		Key:{
			"Id": videoId
		}
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }
		else {
            var s3 = new AWS.S3({
                apiVersion: '2006-03-01'
            });

            var bucket = 'dash-cam-videos';
            var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];
            var key = currentUser + '/' + data.Item.Id;

            const url = s3.getSignedUrl('getObject', {
                Bucket: bucket,
                Key: key,
                Expires: 3600
            });

            var response = {
                statusCode: responseCode,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    video: data.Item,
                    url: url
                })
            };
            console.log("response: " + JSON.stringify(response))
            context.succeed(response);
        }
	});

};
