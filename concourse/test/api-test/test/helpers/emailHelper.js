var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var Promise = require('bluebird');
var promiseRetry = require('promise-retry');

const filter = require('promise-filter')
const simpleParser = require('mailparser').simpleParser;

const bucket = "dashvid-test-emails";

exports.getEmails  = function (email, subject) {

    return promiseRetry(function (retry, number) {
        return s3.listObjects({Bucket: bucket, MaxKeys: 1000}).promise()
            .then(function (data) {

                return Promise.map(data.Contents, function (emailObject) {
                    return s3.getObject({Bucket: bucket, Key: emailObject.Key}).promise()
                        .then(function (data) {
                            var emailSource = data.Body.toString('utf8');
                            // console.log('emailSource: ' + emailSource)

                            return simpleParser(emailSource)
                                .then(function (mail, resolve, reject) {
                                    if (mail.to.text === email && mail.subject === subject) {
                                        s3.deleteObject({Bucket: bucket, Key: emailObject.Key});
                                        return mail.html
                                    }
                                    return undefined
                                });
                        });
                }).then(filter((result) => result != undefined))
                    .then(function (emails) {
                        if (emails.length === 0) {
                            throw "No matching emails"
                        }
                        return emails;
                    })
                    .catch(retry);
            })
    });
}

exports.getVerifyTokenFromEmail = function (emailContent) {
    var re = new RegExp('verify=([a-zA-Z0-9]*)<');
    var matches  = String(emailContent).match(re);
    return matches[1];
}

exports.getResetTokenFromEmail = function (emailContent) {
    var re = new RegExp('lost=([a-zA-Z0-9]*)<');
    var matches  = String(emailContent).match(re);
    return matches[1];
}
