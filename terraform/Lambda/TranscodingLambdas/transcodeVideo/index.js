/*jshint loopfunc: true */
console.log('transcode video');

var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
var dynamodb = new AWS.DynamoDB.DocumentClient();
var elastictranscoder = new AWS.ElasticTranscoder();

exports.handler = function(event, context) {
    "use strict";

    for(var i = 0; i < event.Records.length; i++) {

        let record = event.Records[i];

        let videoId = record.Sns.Message;

        dynamodb.get({
            TableName: "Videos",
            Key:{
                "Id": videoId
            },
            AttributesToGet: [
                'Files',
            ]
        }, function(err, data) {
            if (err) {
                console.log(err);
                return context.fail(err);
            }
            else {
                let key = data.Item.Files.Original.Key;

                var pipeline = process.env.PipelineId;

                var params = {
                    Input: {
                        Key: key
                    },
                    PipelineId: pipeline,
                    OutputKeyPrefix: 'transcoded/',
                    Outputs: [
                        {
                            Key: key.split('.')[0] + '.mp4',
                            PresetId: '1351620000001-100070', // System preset: Web
                        }
                    ],
                };

                elastictranscoder.createJob(params, function(err, data) {
                    if (err){
                        console.log(err);
                        context.fail();
                        return;
                    }

                    console.log("Data: " + JSON.stringify(data));

                    if (i == event.Records.length - 1) {
                        context.succeed();
                    }
                });

            }
        });
    }
};
