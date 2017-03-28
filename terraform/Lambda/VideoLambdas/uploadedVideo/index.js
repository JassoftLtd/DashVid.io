/*jshint loopfunc: true */
console.log('videos uploaded for User');

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB.DocumentClient();
var sns = new AWS.SNS();

var child_process = require("child_process");
var parseString = require('xml2js').parseString;

exports.handler = function(event, context) {
    "use strict";

	var responseCode = 200;
	console.log("request: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        var record = event.Records[i];

		var bucket = record.s3.bucket.name;
		var key = record.s3.object.key;

        //Extract the user from the key
        var user = /[^/]*/.exec(key)[0];

		//Extract the videoId from the key
		var videoId = /(.+?)(\.[^.]*$|$)/.exec(/[^/]*$/.exec(key)[0])[1];

        // TODO, validate the uploaded file

        var s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        });

        console.log('Requesting signed URL for bucket [' + bucket + '], Key [' + key + ']');

        const url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: 3600
        });

        child_process.execFile("/var/task/uploadedVideo/mediainfo", ["--full", "--Output=XML"].concat(url), function (err, stdout, stderr) {
            // command output is in stdout
            if(err) {
                console.error(err);
                context.fail();
            }

            parseString(stdout, function (err, result) {
                console.dir(JSON.stringify(result));

                if(!result.Mediainfo.File) {
                    deleteFile(bucket, key);
                }

                var videoRecord;

                if(result.Mediainfo.File) {
                    for (var f = 0; f < result.Mediainfo.File[0].track.length; f++) {

                        var track = result.Mediainfo.File[0].track[f];

                        if (track.$.type == "Video") {
                            videoRecord = track;
                        }
                    }
                }

                if(!videoRecord) {
                    deleteFile(bucket, key);
                }
                else {

                    console.log("Video Record: " + JSON.stringify(videoRecord));

                    var encodedDate = (videoRecord.Encoded_date) ? Date.parse(videoRecord.Encoded_date[0]) : new Date().getTime() / 1000;

                    dynamodb.put({
                        TableName: "Videos",
                        Item: {
                            Id: videoId,
                            User: user,
                            Uploaded: new Date().getTime(),
                            VideoStatus: "Uploaded",
                            Bucket: bucket,
                            Key: key,
                            RecordedDate: encodedDate,
                            VideoDuration: videoRecord.Duration[0],
                            MediaInfo: result
                        }
                    }, function (err, data) {
                        if (err) {
                            context.fail('Unable to create video record for key [' + key + ']. Error: ' + err);
                            deleteFile(bucket, key);
                        } else {
                            console.log("Video create DynammoDb record succeeded. ID: " + videoId);

                            sns.publish({
                                Message: JSON.stringify({
                                    default: videoId,
                                    videoId: videoId
                                }),
                                MessageStructure: 'json',
                                TargetArn: process.env.snsNewVideoArn
                            }, function(err, data) {
                                if (err) {
                                    context.fail('Error sending SNS message: ' + err);

                                    return;
                                }

                                console.log('push sent');
                                console.log(data);

                                if (i == event.Records.length - 1) {
                                    context.succeed();
                                }
                            });
                        }
                    });
                }
            });

        });
    }
};



function deleteFile (bucket, key) {

    console.log("Deleting file from bucket with key [" + key + "]");

    var s3 = new AWS.S3({
        apiVersion: '2006-03-01'
    });

    const url = s3.deleteObject({
        Bucket: bucket,
        Key: key,
    }, function(err, data) {
        if(err) {
            context.fail('Error deleting file from S3 Bucket [' + bucket + '] Key [' + key + ']');
        }
    });

}