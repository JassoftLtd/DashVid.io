var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

exports.addCard  = function (user, cardToken) {
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
    var pathTemplate = '/v1/subscription/addCard';
    var method = 'POST';
    var additionalParams = {};
    var body = {
        token: cardToken
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}