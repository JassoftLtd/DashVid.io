import React, {Component} from 'react';

import ChangePassword from '../components/account/ChangePassword.js'
import Plans from '../components/plan/Plans.js'

var authUtils = require('../utils/auth.js');

const style = {
    account: {
        "display": "inline-block"
    }
};

export default class AccountPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            changePasswordMessage: null,
            changePlanMessage: null
        };
    }

    componentDidMount() {
        this.loadCurrentPlan()
    }

    loadCurrentPlan() {
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
                        this.setState({
                            plan: result.data
                        });
                    }.bind(this)).catch(function (result) {
                    //This is where you would put an error callback
                });
            }.bind(this));
    }

    handleChangePassword (oldPassword, password) {

        this.setState({
            changePasswordMessage: 'Loading...',
        });

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                };

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/auth/changePassword';
                var method = 'POST';
                var additionalParams = {};
                var body = {
                    oldPassword: oldPassword,
                    newPassword: password
                };

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        if (result.data.changed) {
                            this.setState({
                                changePasswordMessage: 'Password changed for user',
                            });
                        } else {
                            this.setState({
                                changePasswordMessage: 'Password not changed for user'
                            });
                        }
                    }.bind(this)).catch(function (result) {
                    //This is where you would put an error callback
                    console.error('failed', result)
                });
            }.bind(this));
    }

    handlePlanChange (id) {
        console.log("Change Plan", id)

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                };

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/plan';
                var method = 'POST';
                var additionalParams = {};
                var body = {
                    plan: id,
                };

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        if (result.data.changed) {
                            this.setState({
                                changePlanMessage: 'Plan Updated',
                            });
                        } else {
                            this.setState({
                                changePlanMessage: 'Failed to change plan'
                            });
                        }
                    }.bind(this)).catch(function (result) {
                    //This is where you would put an error callback
                    console.error('failed', result)
                });
            }.bind(this));
    }

    render() {
        let currentPlan = this.state.plan ? this.state.plan.plan : "...."
        return (
            <div style={style.account}>
                <p>Current Plan: {currentPlan}</p>
                <ChangePassword changePassword={this.handleChangePassword.bind(this)} message={this.state.changePasswordMessage}/>
                <br />
                <Plans planSelected={(id) => this.handlePlanChange(id)} />
            </div>
        );
    }
}

AccountPage.propTypes = {
}