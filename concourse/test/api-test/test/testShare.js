var assert = require('assert');
var fs = require('fs');
var request = require('request');

var userHelper = require('./helpers/userHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var shareHelper = require('./helpers/shareHelper.js');

describe('Share', function () {

    describe('Share Video', function () {

        it('Given I have a verified account with an uploaded video, When I request to share that video, Then I should able to access that video without authentication', function () {
           return userHelper.getLoggedInUser()
                .then(function (user) {
                    return videoHelper.createVideoForUser(user)
                        .then(function (video) {
                            return shareHelper.shareVideo(user, video.video)
                                .then(function (shareResult) {
                                    return shareHelper.getSharedVideo(shareResult.data.Id)
                                        .then(function (sharedVideo) {
                                            assert(sharedVideo.data);
                                            assert.equal(sharedVideo.data.video.Id, video.video.Id);
                                            assert.equal(sharedVideo.data.urls.original.split('?')[0], video.urls.original.split('?')[0]);
                                            assert.equal(sharedVideo.data.urls.web.split('?')[0], video.urls.web.split('?')[0]);
                                        })
                                })

                        })
                });
        });
    });

});
