var AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
const dynamodb = new AWS.DynamoDB.DocumentClient();

const uuidV4 = require('uuid/v4');

exports.handler = function(event, context) {
    "use strict";

    console.log("event: " + JSON.stringify(event));

    var payload = JSON.parse(event.body);
    var videoId = payload.videoId;

    var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];

    // Get video and check it belongs to user
    dynamodb.get({
        TableName: "Videos",
        Key:{
            "Id": videoId
        },
        AttributesToGet: [
            'User'
        ]
    }, function(err, data) {
        if (err) {
            return context.fail(err);
        }

        if (currentUser !== data.Item.User) {
            console.error("Video does not belong to user");
            context.fail();
        }

        var generatedId = uuidV4();

        // Insert Share Record
        dynamodb.put({
            TableName: "Shares",
            Item: {
                Id: generatedId,
                User: currentUser,
                Video: videoId,
                Shared: new Date().getTime(),
            }
        }, function (err, data) {
            if (err) {
                context.fail('Unable to share video' + err);
            }

            var responseBody = {
                Id: generatedId,
                Link: process.env.shareUrlPrefix + generatedId,
            };
            var response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(responseBody)
            };
            console.log("response: " + JSON.stringify(response));
            context.succeed(response);
        });


    });

};
