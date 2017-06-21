import React, {Component} from 'react';
var authUtils = require('./../utils/auth.js');
var api = require('./../utils/api.js');
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

class CurrentPlan extends Component {

    constructor(props) {
        super(props);

        const _this = this;

        if (this.props.loggedIn) {
            authUtils.getAuthApiGatewayClient()
                .then(function (apigClient) {

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
                            _this.setState({
                                plan: result.data.plan,
                                status: result.data.status
                            })
                        }).catch(function (result) {
                        //This is where you would put an error callback
                    });
                });
        }
    }

    render() {
        if (this.props.loggedIn && this.state) {
            var status
            if (this.state.status && this.state.status === 'Pending') {
                status = (<a href="/subscription/addCard">{this.state.status}</a>)
            }
            return (
                <li className="pure-menu-item"><a className="pure-menu-link" href="#">{this.state.plan}{status}</a></li>
            );
        }
        else {
            return null
        }
    }
}



export default CurrentPlan;
