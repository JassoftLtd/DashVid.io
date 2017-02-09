var assert = require('assert');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');

var authHelper = require('./helpers/authHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var generator = require('./helpers/generators.js');

describe('Video', function () {

    this.timeout(60000);

    describe('Create Video', function () {

        it('Given I have a verified account, When I request to upload a video, Then I should be given the URl to upload it to', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return videoHelper.createVideo(user, "01291238_0160", ".MP4")
                        .then(function (result) {
                            assert(result.data.url);

                            console.log('Uploading file')

                            let filepath = './test/testData/01291238_0160.MP4';

                            let stream = fs.createReadStream(filepath)
                            let stat = fs.statSync(filepath);

                            let options = {
                                method: 'PUT',
                                uri: result.data.url,
                                body: stream,
                                headers: {
                                    'content-type': 'text/plain;charset=UTF-8',
                                    'Content-Length': stat.size
                                }
                            };

                            return rp(options)
                                .then(function () {
                                    console.log('Uploaded Video')
                                });

                        });

                });
        });
    });

});
