var assert = require('assert');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var promiseRetry = require('promise-retry');

var authHelper = require('./helpers/authHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var cameraHelper = require('./helpers/cameraHelper.js');
var generator = require('./helpers/generators.js');

describe('Video', function () {

    describe('Create Video', function () {

        it('Given I have a verified account, When I request to upload a video, Then I should be given the URL to upload it to', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return cameraHelper.getCameras(user)
                        .then(function (result) {
                            return videoHelper.createVideo(user, result.data[0].CameraKey, "01291238_0160.MP4", ".MP4")
                                .then(function (result) {
                                    assert(result.data.url);

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
                                            assert(true)
                                        });
                                });
                        });
                });
        });
    });

    describe('Get Videos', function () {

        it('Given I have a verified account, When I havent uploaded any videos, Then It should receive an empty list', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return videoHelper.getVideos(user)
                        .then(function (result) {

                            assert.equal(result.data.length, 0);
                        })

                });
        });

        it('Given I have a verified account, When I request to upload a video, Then It should be listed', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return cameraHelper.getCameras(user)
                        .then(function (result) {
                            return videoHelper.createVideo(user, result.data[0].CameraKey, "01291238_0160.MP4", ".MP4")
                                .then(function (result) {
                                    assert(result.data.url);

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

                                            return promiseRetry(function (retryVideos, numberVideos) {

                                                return videoHelper.getVideos(user)
                                                    .then(function (result) {
                                                        var recordedDate = new Date()

                                                        assert.equal(result.data.length, 1);

                                                        assert.equal(result.data[0].videos.length, 1);
                                                    })
                                                    .catch(retryVideos);
                                            });
                                        });
                                });
                        });
                });
        });

        it('Given I have a verified account, When I have videos loaded, Then I should be able to retrieve the video', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return cameraHelper.getCameras(user)
                        .then(function (result) {
                            return videoHelper.createVideo(user, result.data[0].CameraKey, "01291238_0160.MP4", ".MP4")
                                .then(function (result) {
                                    assert(result.data.url);

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

                                            return promiseRetry(function (retryVideos, numberVideos) {

                                                return videoHelper.getVideos(user)
                                                    .then(function (result) {
                                                        var recordedDate = new Date()

                                                        assert.equal(result.data.length, 1);

                                                        assert.equal(result.data[0].videos.length, 1);

                                                        return promiseRetry(function (retryVideo, numberVideo) {
                                                            return videoHelper.getVideo(user, result.data[0].videos[0].Id)
                                                                .then(function (result) {
                                                                    assert(result.data.video);
                                                                    assert(result.data.urls.original);
                                                                    assert(result.data.urls.web);
                                                                })
                                                                .catch(retryVideo);
                                                        })
                                                    })
                                                    .catch(retryVideos);
                                            });
                                        });

                                });
                        });

                });
        });
    });

});
