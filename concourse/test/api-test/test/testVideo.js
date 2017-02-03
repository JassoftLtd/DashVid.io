var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var generator = require('./helpers/generators.js');

describe('Video', function () {

    this.timeout(10000);

    describe('Create Video', function () {

        it('Given I have a verified account, When I request to upload a video, Then I should be given the URl to upload it to', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    var filename = generator.filename();

                    return videoHelper.createVideo(user, filename, ".mp4")
                        .then(function (result) {
                            assert(result.data.url);
                        })

                });
        });
    });

});
