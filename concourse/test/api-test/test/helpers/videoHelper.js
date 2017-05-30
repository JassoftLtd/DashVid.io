var apigClientFactory = require('aws-api-gateway-client')
var rp = require('request-promise');
var promiseRetry = require('promise-retry');
var assert = require('assert');
var fs = require('fs');

var cameraHelper = require('./cameraHelper.js');

exports.createVideo  = function (user, cameraKey, fileName, fileType) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS,
        accessKey: user.credentials.accessKeyId,
        secretKey: user.credentials.secretAccessKey,
        sessionToken: user.credentials.sessionToken
    }

    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/video';
    var method = 'POST';
    var additionalParams = {};
    var body = {
        fileName: fileName,
        fileType: fileType,
        cameraKey: cameraKey
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

exports.getVideos  = function (user) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS,
        accessKey: user.credentials.accessKeyId,
        secretKey: user.credentials.secretAccessKey,
        sessionToken: user.credentials.sessionToken
    }

    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/video';
    var method = 'GET';

    return apigClient.invokeApi(params, pathTemplate, method)
}


exports.getVideo  = function (user, videoId) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS,
        accessKey: user.credentials.accessKeyId,
        secretKey: user.credentials.secretAccessKey,
        sessionToken: user.credentials.sessionToken
    }

    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        "videoId": videoId
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/video/{videoId}';
    var method = 'GET';

    return apigClient.invokeApi(params, pathTemplate, method)
}

exports.createVideoForUser = function(user) {
    return cameraHelper.getCameras(user)
        .then(function (result) {
            return exports.createVideo(user, result.data[0].CameraKey, "01291238_0160.MP4", ".MP4")
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

                                return exports.getVideos(user)
                                    .then(function (result) {
                                        assert.equal(result.data.length, 1);

                                        assert.equal(result.data[0].videos.length, 1);

                                        return promiseRetry(function (retryVideo, numberVideo) {
                                            return exports.getVideo(user, result.data[0].videos[0].Id)
                                                .then(function (result) {
                                                    assert(result.data.video);
                                                    assert(result.data.originalUrl);
                                                    assert(result.data.url);

                                                    return result.data;
                                                })
                                                .catch(retryVideo);
                                        })
                                    })
                                    .catch(retryVideos);
                            });
                        });

                });
        });
}