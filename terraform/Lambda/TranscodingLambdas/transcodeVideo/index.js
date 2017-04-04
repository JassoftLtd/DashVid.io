/*jshint loopfunc: true */
console.log('transcode video');

var dynamodb = new AWS.DynamoDB.DocumentClient();
var elastictranscoder = new AWS.ElasticTranscoder();

exports.handler = function(event, context) {
    "use strict";

	console.log("request: " + JSON.stringify(event));

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
                return context.fail(err);
            }
            else {
                let key = data.Item.Key
                console.log('video located at Bucket [' + data.Item.Bucket + '] Key [' +key + ']')

                var params = {
                    Input: {
                        Key: key
                    },
                    PipelineId: process.env.PipelineId, /* test-web-transcoder */
                    OutputKeyPrefix: 'transcoder/output/',
                    Outputs: [
                        {
                            Key: outputKey(basename(key),'mp4'),
                            PresetId: '1351620000001-500030', // h264
                        }
                    ]
                };

                elastictranscoder.createJob(params, function(err, data) {
                    if (err){
                        console.log(err, err.stack); // an error occurred
                        context.fail();
                        return;
                    }

                    if (i == event.Records.length - 1) {
                        context.succeed();
                    }
                });

            }
        });

    }

    context.succeed();
};
