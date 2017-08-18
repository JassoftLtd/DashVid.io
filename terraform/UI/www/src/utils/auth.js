var AWS = require('aws-sdk');

const api = require('./api.js');
var apigClientFactory = require('aws-api-gateway-client')

AWS.config.region = window.REACT_APP_AWS_REGION;

var createCognitoIdentityCredentials = function (params) {

    localStorage.setItem("CognitoParmas", JSON.stringify(params));

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
}

var reloadCredentials = function () {

    var sessionParams = localStorage.getItem("CognitoParmas");

    if(!sessionParams) {
        window.location.href = '/';
    }
    else {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(JSON.parse(sessionParams));
    }

}

var hasAuth = function () {
    if(AWS.config.credentials || localStorage.getItem("CognitoParmas")) {
        return true
    }

    return false
};

var clearCredentials = function () {
    AWS.config.credentials = null;
    localStorage.clear()
}

var getAuthApiGatewayClient = function () {

    if(!AWS.config.credentials) {
        reloadCredentials()
    }

    return AWS.config.credentials.getPromise()
        .catch(function (err) {
            console.error(err);
            clearCredentials()
            window.location.href = '/';
        })
        .then(function () {
            var config = {
                invokeUrl: api.getApiAddress(),
                accessKey: AWS.config.credentials.accessKeyId,
                secretKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken,
                region: AWS.config.region
            }

            return apigClientFactory.newClient(config);
        })
};

export {getAuthApiGatewayClient, hasAuth, createCognitoIdentityCredentials, clearCredentials};