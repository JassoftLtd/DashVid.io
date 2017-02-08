var assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var authHelper = require('./helpers/authHelper.js');
var videoHelper = require('./helpers/videoHelper.js');
var generator = require('./helpers/generators.js');

describe('Video', function () {

    this.timeout(10000);

    describe('Create Video', function () {

        it('Given I have a verified account, When I request to upload a video, Then I should be given the URl to upload it to', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    let file = new File("./testData/01291238_0160.MP4");

                    console.log(JSON.stringify(file))

                    return videoHelper.createVideo(user, file.name, file.type)
                        .then(function (result) {
                            assert(result.data.url);

                            return new Promise(function (fulfill, reject){


                                var xhr = new XMLHttpRequest();
                                xhr.open('PUT', result.data.url);
                                // xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
                                xhr.onload = function() {
                                    if (xhr.status === 200) {
                                        fulfill('Upload completed')
                                    } else {
                                        console.log(JSON.stringify(xhr))
                                        reject('Upload error status: ' + xhr.status)
                                    }
                                };
                                xhr.send(file)
                            });


                        })

                });
        });
    });

});
