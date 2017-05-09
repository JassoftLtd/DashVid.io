var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var Promise = require('bluebird');
var sleep = require('sleep');

const simpleParser = require('mailparser').simpleParser;

const bucket = "dashvid-test-emails";

exports.getEmails  = function (email) {

    console.log('Finding emails for: ' + email);

    sleep.sleep(3)

    return s3.listObjects({Bucket: bucket, MaxKeys: 1000}).promise()
        .then(function (data) {

            var result =  Promise.map(data.Contents, function (email) {
                return s3.getObject({Bucket: bucket, Key: email.Key}).promise()
                    .then(function (data) {
                        var emailSource = data.Body.toString('utf8');
                        // console.log('emailSource: ' + emailSource)

                        return simpleParser(emailSource)
                            .then(function (mail, resolve, reject) {
                                console.log('Checking email for match: ' + mail.to.text + ' Result: ' + (mail.to.text === email))
                                if(mail.to.text === email) {
                                    console.log('Found email for: ' + email)
                                    console.log('html: ' + mail.html)
                                    return mail.html
                                }
                                return null
                            });
                    });
            }).then(function (results) {
                console.log('Results: ' + results)

            }).catch(function (error) {
                console.error(error)
            })

            console.log('promise reulst: '  + result)
            console.log('promise reulst: '  + result.resolve())

            return result;

            console.log('finished')
        })

}