var AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    useAccelerateEndpoint: true
});

exports.handler = function(event, context) {
    "use strict";

    console.log("event: " + JSON.stringify(event));

    var shareId = event.pathParameters.shareId;

    console.log("Getting shared video", shareId);

    // Get share record
    dynamodb.get({
        TableName: "Shares",
        Key:{
            "Id": shareId
        }
    }, function(err, data) {
        if (err) {
            return context.fail(err);
        }

        // Get video record
        dynamodb.get({
            TableName: "Videos",
            Key:{
                "Id": data.Item.Video
            }
        }, function(err, data) {
            if (err) {
                return context.fail(err);
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
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    video: {
                        Id: data.Item.Id
                    },
                    urls : {
                        original: url,
                        web: transcodedUrl
                    }
                })
            };
            console.log("response: " + JSON.stringify(response));
            context.succeed(response);

        });

    });
};
