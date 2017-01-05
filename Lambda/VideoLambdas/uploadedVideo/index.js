'use strict';
console.log('videos uploaded for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        var record = event.Records[i];

		var key = record.s3.object.key;

		//Extract the videoId from the key
		var videoId = /[^/]*$/.exec(key)[0];

        // TODO, validate the uploaded file

        dynamodb.update({
            TableName: "Videos",
            Key:{
                "Id": videoId
            },
            UpdateExpression: "set VideoStatus = :status",
            ExpressionAttributeValues:{
                ":status":"Uploaded"
            },
            ReturnValues:"UPDATED_NEW"
        }, function(err, data) {
            if (err) {
                console.error('Unable to update video status for videoId [' + videoId + ']. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                console.log("Video status updated succeeded:", JSON.stringify(data, null, 2));
            }

            if (i == event.Records.length -1) {
                context.succeed();
            }
        });

    }

};

//EVENT
// {
//     "Records": [
//     {
//         "eventVersion": "2.0",
//         "eventSource": "aws:s3",
//         "awsRegion": "eu-west-1",
//         "eventTime": "2017-01-04T20:24:21.676Z",
//         "eventName": "ObjectCreated:Put",
//         "userIdentity": {
//             "principalId": "AWS:AROAJD67JECNUTXKY2CHY:CognitoIdentityCredentials"
//         },
//         "requestParameters": {
//             "sourceIPAddress": "82.37.62.130"
//         },
//         "responseElements": {
//             "x-amz-request-id": "542A413054E612B7",
//             "x-amz-id-2": "a5plng54Uonf3C7KRlx1FSZ+xwlMvidRhIOBphW3UcMXrW3ek39OJ+NZ7uT0i9rq8c90Wex7HHE="
//         },
//         "s3": {
//             "s3SchemaVersion": "1.0",
//             "configurationId": "tf-s3-lambda-20170104202259480919742ggp",
//             "bucket": {
//                 "name": "dash-cam-videos",
//                 "ownerIdentity": {
//                     "principalId": "A3PMHVQCLHVUU0"
//                 },
//                 "arn": "arn:aws:s3:::dash-cam-videos"
//             },
//             "object": {
//                 "key": "c0caeae0-d2bb-11e6-a7d8-9d41f43688cd",
//                 "size": 4191180,
//                 "eTag": "b1f507aae053b88257ae4f25e4ea4ebd",
//                 "sequencer": "00586D59F3652EC261"
//             }
//         }
//     }
// ]
// }