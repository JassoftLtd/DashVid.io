var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

var assert = require('assert');

describe('Auth', function () {

    describe('Signup', function () {

        it('Should allow me to signup with a new user', function () {

            this.timeout(5000);

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
                email: "test@dashvid.io",
                password: "testPasword",
                plan: "Free"
            };

            return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                .then(function (result) {
                    console.error(JSON.stringify(result))
                    assert.equal(result.created, true);
                });
        });

    });

})
;
