var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.expireVideo  = function (video) {

    let videoLink = video.originalUrl.split('?')[0];

    let videoLinkParts = videoLink.split('.s3-accelerate.amazonaws.com/');

    let bucket = videoLinkParts[0].split('://')[1];
    let key = videoLinkParts[1];

    return s3.deleteObject({Bucket: bucket, Key: key}).promise()
}
