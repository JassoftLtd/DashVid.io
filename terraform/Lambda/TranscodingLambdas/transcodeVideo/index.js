/*jshint loopfunc: true */
console.log('transcode video');

var AWS = require('aws-sdk');
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
            }
        }, function(err, data) {
            if (err) {
                console.log(err);
                return context.fail(err);
            }
            else {
                let key = data.Item.Key;
                console.log('video located at Bucket [' + data.Item.Bucket + '] Key [' +key + ']');

                var params = {
                    Input: {
                        Key: key
                    },
                    PipelineId: process.env.PipelineId, /* test-web-transcoder */
                    OutputKeyPrefix: 'transcoded/',
                    Outputs: [
                        {
                            Key: key.split('.')[0] + '.mp4',
                            PresetId: '1351620000001-500030', // h264
                            SegmentDuration: "30",
                        }
                    ],
                    Playlists: [
                        {
                            Name: key.split('.')[0],
                            Format: 'MPEG-DASH',
                            OutputKeys: [
                                key.split('.')[0] + '.mp4',
                            ]
                        }
                    ]
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
