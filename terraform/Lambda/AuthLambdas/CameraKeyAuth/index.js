// dependencies
var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
var crypto = require('crypto');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();
var cognitoidentity = new AWS.CognitoIdentity();

var responseSuccess = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};

var responseError = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};

function getUserByCameraKey(context, cameraKey, fn) {
    console.log('Getting camera for key: ' + cameraKey);

    dynamodb.query({
        IndexName: "CameraKey",
        KeyConditionExpression: '#cameraKey = :cameraKey',
        ExpressionAttributeNames: {
            "#cameraKey": "CameraKey",
        },
        ExpressionAttributeValues: {
            ":cameraKey": cameraKey
        },
        TableName: "Cameras"
    }, function (err, data) {
        if (err) {
            console.error("Camera not found for key: " + cameraKey + " Error: " + err);
            context.fail();
        }
        else {
            if (data.Count > 1) {
                console.error("User has multiple cameras with same key? This should not happen: " + JSON.stringify(data));
                context.fail();
            }
            if (data.Count === 0) {
                console.error("User not found with camera key");
                context.fail();
            }

            console.log('DB Data: ', JSON.stringify(data.Items));

            let email = data.Items[0].User;
            console.log("User is " + email);
            fn(email);
        }
    });
}

function getToken(email, fn) {
    var param = {
        IdentityPoolId: process.env.auth_identity_pool,
        Logins: {} // To have provider name in a variable
    };
    param.Logins[process.env.auth_developer_provider_name] = email;
    cognitoidentity.getOpenIdTokenForDeveloperIdentity(param,
        function (err, data) {
            if (err) return fn(err); // an error occurred
            else fn(null, data.IdentityId, data.Token); // successful response
        });
}

exports.handler = function (event, context) {
    "use strict";

    var payload = JSON.parse(event.body);

    var cameraKey = payload.cameraKey;

    getUserByCameraKey(context, cameraKey, function (email) {
        // Login ok
        console.log('User logged in: ' + email);
        getToken(email, function (err, identityId, token) {
            if (err) {
                responseError.body = 'Error in getToken: ' + err;
                context.fail(JSON.stringify(responseError));
            } else {
                responseSuccess.body = JSON.stringify({
                    login: true,
                    identityId: identityId,
                    token: token
                });
                console.log("response: " + JSON.stringify(responseSuccess));
                context.succeed(responseSuccess);
            }
        });


    });
};
