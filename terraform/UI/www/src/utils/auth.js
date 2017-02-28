var AWS = require('aws-sdk');

var createCognitoIdentityCredentials = function (params) {

    sessionStorage.setItem("CognitoParmas", JSON.stringify(params));

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
}

var reloadCredentials = function () {

    var sessionParams = sessionStorage.getItem("CognitoParmas");

    if(!sessionParams) {
        window.location.href = '/';
    }
    else {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(JSON.parse(sessionParams));
    }

}

var hasCredentials = function () {
    if(AWS.config.credentials) {
        return true
    }

    return false
};

var hasAuth = function () {
    if(AWS.config.credentials || sessionStorage.getItem("CognitoParmas")) {
        return true
    }

    return false
};

var clearCredentials = function () {
    AWS.config.credentials = null;
    sessionStorage.clear()
}

var runWithCredentials = function (callback) {

    if(!hasCredentials()) {
        reloadCredentials()
    }

    if (AWS.config.credentials.needsRefresh()) {
        AWS.config.credentials.refresh(function (err) {
            if (err) {
                clearCredentials();
                return
            }

            console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
            callback();
        })
    }
    else {

        // We can set the get method of the Credentials object to retrieve
        // the unique identifier for the end user (identityId) once the provider
        // has refreshed itself
        AWS.config.credentials.get(function (err) {
            if (err) {
                return
            }
            console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
            callback();
        });
    }
};

export {runWithCredentials, hasAuth, createCognitoIdentityCredentials, clearCredentials};