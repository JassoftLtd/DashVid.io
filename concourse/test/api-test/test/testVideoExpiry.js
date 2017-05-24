var assert = require('assert');
var fs = require('fs');
var request = require('request');
var promiseRetry = require('promise-retry');

var authHelper = require('./helpers/authHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var cameraHelper = require('./helpers/cameraHelper.js');
var s3Helper = require('./helpers/s3Helper.js');

describe('Video Expiry', function () {

    describe('Video Expired', function () {

        it('Given I have a verified account with an uploaded video, When that video has expired and is removed by S3, Then I should no longer receive a link to that video', function () {
            return authHelper.getLoggedInUser()
                .then(function (user) {
                    return videoHelper.createVideoForUser(user)
                        .then(function (video) {
                            return s3Helper.expireVideo(video)
                                .then(function () {
                                    return promiseRetry(function (retry, number) {
                                        return videoHelper.getVideo(user, video.video.Id)
                                            .then(function (expiredVideo) {
                                                assert(expiredVideo.data.video);
                                                assert(expiredVideo.data.url);
                                                assert(!expiredVideo.data.originalUrl);
                                            })
                                            .catch(retry);
                                    })
                                });
                        });
                });
        });
    });

});
