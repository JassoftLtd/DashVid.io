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
        },
        AttributesToGet: [
            'Video',
        ]
    }, function(err, data) {
        if (err) {
            return context.fail(err);
        }

        // Get video record
        dynamodb.get({
            TableName: "Videos",
            Key:{
                "Id": data.Item.Video
            },
            AttributesToGet: [
                'Id',
                'Files',
            ]
        }, function(err, data) {
            if (err) {
                return context.fail(err);
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
                statusCode: 200,
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

    });
};
