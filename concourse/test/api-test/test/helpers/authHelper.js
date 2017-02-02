var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

var signup  = function (email, password, plan) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS
    }
    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/auth/signup'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        email: email,
        password: password,
        plan: plan
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

var verify  = function (email, token) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS
    }
    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/auth/verifyUser'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        email: email,
        verify: token
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

var login  = function (email, password) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS
    }
    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/auth/login'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        email: email,
        password: password
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

export {signup, verify, login};