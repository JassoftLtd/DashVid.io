/*jshint loopfunc: true */
console.log('video transcoded');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

    console.log("Event: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        let record = event.Records[i];

        let message = JSON.parse(record.Sns.Message);

        console.log("Message: " + JSON.stringify(message));

        var videoId = /(.+?)(\.[^.]*$|$)/.exec(/[^/]*$/.exec(message.input.key)[0])[1];

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
                console.log("Video: " + JSON.stringify(data.Item));

                dynamodb.update({
                    TableName: "Videos",
                    Key:{
                        "Id": videoId
                    },
                    UpdateExpression: "set TranscodedVideo = :transcoded",
                    ExpressionAttributeValues:{
                        ":transcoded":{
                            "Bucket": data.Item.Bucket + "-transcoded",
                            "Key": message.input.key
                        },
                    },
                    ReturnValues:"UPDATED_NEW"
                }, function(err, data) {
                    if (err) {
                        console.error('Unable to update video with transcoded key for videoId [' + videoId + ']. Error JSON:', JSON.stringify(err, null, 2));
                        context.fail();
                    } else {
                        console.log("Video transcoded location updated succeeded:", JSON.stringify(data, null, 2));

                        if (i == event.Records.length - 1) {
                            context.succeed();
                        }
                    }
                });
            }
        });
    }
};
