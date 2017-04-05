/*jshint loopfunc: true */
console.log('video transcoded');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
    "use strict";

    console.log("Event: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        let record = event.Records[i];

        let message = record.Sns.Message;

        console.log("Message: " + JSON.parse(message));

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

                if (i == event.Records.length - 1) {
                    context.succeed();
                }
            }
        });
    }
};
