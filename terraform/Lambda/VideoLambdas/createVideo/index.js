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

    var payload = JSON.parse(event.body);


    const signedUrlExpireSeconds = 3600 // 1 hour

	var generatedId = uuid.v1();
	var currentUser = event.requestContext.identity.cognitoIdentityId.split(':')[1];
    var email = event.requestContext.identity.cognitoAuthenticationProvider.split(':').pop();
    var fileExtension = payload.fileName.split('.').pop();
    const _key = currentUser + '/' + generatedId + '.' + fileExtension;

    getUserPlan(email, function (err, plan) {
        if (err) {
            context.fail()
        }

        let bucket = process.env['plan_bucket_' + plan.toLowerCase()]

        var s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });

        const url = s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: _key,
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
    })

};

function getUserPlan(email, fn) {
    console.log('Getting plan for user: ' + email)

    dynamodb.query({
        KeyConditionExpression:"#user = :user",
        FilterExpression: '#planStatus = :status',
        ExpressionAttributeNames: {
            "#user":"User",
            "#planStatus":"PlanStatus",
        },
        ExpressionAttributeValues: {
            ":user":email,
            ":status":"Active"
        },
        "TableName": "Subscriptions"
    }, function(err, data) {
        if (err) {
            console.error("User not found: " + JSON.stringify(err))
            fn('User not found', null)
        }
        else {
            if(data.Count > 1) {
                console.error("User had multiple active Subscriptions: " + JSON.stringify(data))
                fn('User had multiple active Subscriptions', null); // User not found
            }

            var plan = data.Items[0].Plan;
            console.log("User plan is " + plan)
            fn(null, plan);
        }
    });
}