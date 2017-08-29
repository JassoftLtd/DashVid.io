console.log('create video for User');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

const uuidV4 = require('uuid/v4');

exports.handler = function (event, context) {
    "use strict";

    var responseCode = 200;

    console.log("event: " + JSON.stringify(event));
    console.log("identity: " + JSON.stringify(event.requestContext.identity.cognitoIdentityId));

    var payload = JSON.parse(event.body);

    const signedUrlExpireSeconds = 3600; // 1 hour

    var generatedId = uuidV4();
    var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];
    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();
    var fileExtension = payload.fileName.split('.').pop();

    getUserPlan(context, email, function (plan) {
        let bucket = process.env.plan_bucket;

        getCameraId(context, email, payload.cameraKey, function (cameraId) {
            var s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                useAccelerateEndpoint: true
            });

            const url = s3.getSignedUrl('putObject', {
                Bucket: bucket,
                Key: currentUser + '/' + cameraId + '/' + generatedId + '.' + fileExtension,
                Expires: signedUrlExpireSeconds,
                ContentType: 'text/plain;charset=UTF-8'
            });

            var responseBody = {
                Id: generatedId,
                url: url
            };
            var response = {
                statusCode: responseCode,
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

function getUserPlan(context, email, fn) {
    console.log('Getting plan for user: ' + email);

    dynamodb.query({
        KeyConditionExpression: "#user = :user",
        FilterExpression: '#planStatus = :status',
        ExpressionAttributeNames: {
            "#user": "User",
            "#planStatus": "PlanStatus",
        },
        ExpressionAttributeValues: {
            ":user": email,
            ":status": "Active"
        },
        ScanIndexForward: false,
        TableName: "Subscriptions"
    }, function (err, data) {
        if (err) {
            console.error("User not found: " + JSON.stringify(err));
            context.fail();
        }
        else {
            var plan = data.Items[0].Plan;
            console.log("User plan is " + plan);
            fn(plan);
        }
    });
}

function getCameraId(context, email, cameraKey, fn) {
    console.log('Getting camera for key: ' + cameraKey);

    dynamodb.query({
        IndexName: "UserCameras",
        KeyConditionExpression: "#user = :user",
        FilterExpression: '#cameraKey = :cameraKey',
        ExpressionAttributeNames: {
            "#user": "User",
            "#cameraKey": "CameraKey",
        },
        ExpressionAttributeValues: {
            ":user": email,
            ":cameraKey": cameraKey
        },
        TableName: "Cameras"
    }, function (err, data) {
        if (err) {
            console.error("Camera not found for User: " + email + " Error: " + err);
            context.fail();
        }
        else {
            if (data.Count > 1) {
                console.error("User has multiple cameras with same key? This should not happen: " + JSON.stringify(data));
                context.fail();
            }

            let cameraId = data.Items[0].Id;
            console.log("Camera Id is " + cameraId);
            fn(cameraId);
        }
    });
}