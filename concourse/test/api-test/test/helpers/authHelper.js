var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')
var generator = require('./generators.js');

exports.tokenOverride = 'TestToken';

exports.signup  = function (email, password, plan) {
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

exports.verify  = function (email, token) {
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

exports.login  = function (email, password) {
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

exports.lostPassword  = function (email) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS
    }
    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/auth/lostPassword'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        email: email
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

exports.resetPassword  = function (email, newPassword) {
    var config = {
        invokeUrl: process.env.DASHVID_API_ADDRESS
    }
    var apigClient = apigClientFactory.newClient(config);

    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    };
    // Template syntax follows url-template https://www.npmjs.com/package/url-template
    var pathTemplate = '/v1/auth/resetPassword'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        email: email,
        lost: exports.tokenOverride,
        password: newPassword
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

exports.changePassword  = function (user, oldPassword, newPassword) {
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
    var pathTemplate = '/v1/auth/changePassword'
    var method = 'POST';
    var additionalParams = {};
    var body = {
        oldPassword: oldPassword,
        newPassword: newPassword
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}

exports.getLoggedInUser = function (plan="Free") {

    var email = generator.email();
    var password = generator.password();

    return exports.signup(email, password, plan)
        .then(function (result) {
            console.log('User Signed Up')
            return exports.verify(email, exports.tokenOverride)
                .then(function (result) {
                    console.log('User Verified')
                    return exports.login(email, password)
                        .then(function (result) {
                            console.log('User Logged In')

                            var params = {
                                IdentityPoolId: process.env.aws_identity_pool,
                                IdentityId: result.data.identityId,
                                Logins: {
                                    'cognito-identity.amazonaws.com': result.data.token
                                }
                            }

                            AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

                            AWS.config.region = process.env.aws_region;

                            return AWS.config.credentials.getPromise()
                                .then(function() {

                                return Promise.resolve({
                                        email: email,
                                        password: password,
                                        credentials: AWS.config.credentials
                                    })

                                });


                        })
                        .catch(function (error) {
                            console.error(error)
                        });
                });
        });
}