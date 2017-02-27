import React, {Component} from 'react';
var authUtils = require('./../utils/auth.js');
var api = require('./../utils/api.js');
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')
AWS.config.region = 'eu-west-1'; // Region

class CurrentPlan extends Component {

    constructor(props) {
        super(props);

        const _this = this;


        this.state = {
            plan: "LOAD ME"
        };

        if (authUtils.hasAuth()) {
            authUtils.runWithCredentials(function () {

                var config = {
                    invokeUrl: api.getApiAddress(),
                    accessKey: AWS.config.credentials.accessKeyId,
                    secretKey: AWS.config.credentials.secretAccessKey,
                    sessionToken: AWS.config.credentials.sessionToken,
                    region: AWS.config.region
                }
                var apigClient = apigClientFactory.newClient(config);

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                };

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/plan'
                var method = 'GET';
                var additionalParams = {};
                var body = {};

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        //This is where you would put a success callback
                        _this.state = {
                            plan: result.data.plan
                        }
                    }).catch(function (result) {
                    //This is where you would put an error callback
                });
            });
        }
    }

    render() {
        if (this.props.loggedIn) {
            return (
                <div>
                    {this.state.plan}
                </div>
            );
        }
        else {
            return null
        }
    }
}



export default CurrentPlan;
