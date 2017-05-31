var assert = require('assert');
var fs = require('fs');
var request = require('request');
var promiseRetry = require('promise-retry');

var userHelper = require('./helpers/userHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var cameraHelper = require('./helpers/cameraHelper.js');
var s3Helper = require('./helpers/s3Helper.js');

describe('Video Expiry', function () {

    describe('Expiry Enabled', function () {

        it('Given I have a verified account with an uploaded video, When that video is stored in S3, Then it should have a defined Expiry time', function () {
            return userHelper.getLoggedInUser()
                .then(function (user) {
                    return videoHelper.createVideoForUser(user)
                        .then(function (video) {
                            return s3Helper.getObject(video)
                                .then(function (videoObject) {
                                    assert(videoObject.Expiration)
                                });
                        });
                });
        });

        // it('Given I have a verified paid account with an uploaded video, When that video is stored in S3, Then it should have a defined Expiry time', function () {
        //     return userHelper.getLoggedInUserOnPaidPlan()
        //         .then(function (user) {
        //             console.log("gotLoggedInUserOnPaidPlan")
        //             return videoHelper.createVideoForUser(user)
        //                 .then(function (video) {
        //                     console.log("createdVideoForUser")
        //                     return s3Helper.getObject(video)
        //                         .then(function (videoObject) {
        //                             console.log("gotObject")
        //                             assert(videoObject.Expiration)
        //                         });
        //                 })
        //                 .catch(function (error) {
        //                     console.error(error)
        //                 });
        //         });
        // });
    });

    describe('Video Expired', function () {

        it('Given I have a verified account with an uploaded video, When that video has expired and is removed by S3, Then I should no longer receive a link to that video', function () {
            return userHelper.getLoggedInUser()
                .then(function (user) {
                    return videoHelper.createVideoForUser(user)
                        .then(function (video) {
                            return s3Helper.expireVideo(video)
                                .then(function () {
                                    return promiseRetry(function (retry, number) {
                                        return videoHelper.getVideo(user, video.video.Id)
                                            .then(function (expiredVideo) {
                                                assert(expiredVideo.data.video);
                                                assert(expiredVideo.data.urls.web);
                                                assert(!expiredVideo.data.urls.original);
                                            })
                                            .catch(retry);
                                    })
                                });
                        });
                });
        });
    });

});
