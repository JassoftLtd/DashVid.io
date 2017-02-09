var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

exports.createVideo  = function (user, fileName, fileType) {
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
    var pathTemplate = '/v1/video'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        fileName: fileName,
        fileType: fileType
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
    var pathTemplate = '/v1/video'
    var method = 'GET';
    var additionalParams = {};
    var body = {};

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}
