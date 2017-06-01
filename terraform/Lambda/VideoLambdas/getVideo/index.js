console.log('Loading video for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    useAccelerateEndpoint: true
});

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videoId = event.pathParameters.id;

	dynamodb.get({
		TableName: "Videos",
		Key:{
			"Id": videoId
		},
        AttributesToGet: [
            'Id',
            'User',
            'Files',
        ]
	}, function(err, data) {
		if (err) {
            return context.fail(err);
        }

        var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

        if(currentUser !== data.Item.User) {
            console.error("Video does not belong to user");
            context.fail();
        }

        let urls = {};

        if(data.Item.Files.Original) {
            console.log('Getting video url from Bucket [' + data.Item.Files.Original.Bucket + '] Key [' + data.Item.Files.Original.Key + ']');
            urls.original = s3.getSignedUrl('getObject', {
                Bucket: data.Item.Files.Original.Bucket,
                Key: data.Item.Files.Original.Key,
                Expires: 3600
            });
        }

        if(data.Item.Files.Web) {
            console.log('Getting video url from Bucket [' + data.Item.Files.Web.Bucket + '] Key [' + data.Item.Files.Web.Key + ']');
            urls.web = s3.getSignedUrl('getObject', {
                Bucket: data.Item.Files.Web.Bucket,
                Key: data.Item.Files.Web.Key,
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
                urls: urls,
            })
        };
        console.log("response: " + JSON.stringify(response));
        context.succeed(response);

	});
};
