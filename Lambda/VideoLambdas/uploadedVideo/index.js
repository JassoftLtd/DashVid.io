'use strict';
console.log('Loading videos for User');

exports.handler = function(event, context) {
	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

	var videosFromDynamoDB = []

	var responseBody = {
		videos: videosFromDynamoDB
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
};

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