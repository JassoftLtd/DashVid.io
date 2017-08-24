import React, {Component} from 'react';
import { Link } from 'react-router';

import ChangePassword from '../components/account/ChangePassword.js'
import Plans from '../components/plan/Plans.js'

const authUtils = require('../utils/auth.js');

const ReactGA = require('react-ga');

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
                        ReactGA.exception({
                            description: 'Failed to load Plan',
                        });
                });
            }.bind(this));
    }

    handleChangePassword (oldPassword, password) {

        ReactGA.event({
            category: 'Account',
            action: 'Password Changed'
        });

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
                        ReactGA.exception({
                            description: 'Failed to Change Password',
                            fatal: true
                        });
                });
            }.bind(this));
    }

    handlePlanChange (id) {

        ReactGA.event({
            category: 'Account',
            action: 'Change Plan'
        });

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
                        if (result.data.plan === id) {
                            if(result.data.status === 'Pending') {
                                this.props.router.push('/subscription/addCard');
                            }
                            if(result.data.status === 'Active') {
                                this.loadCurrentPlan()
                            }
                        }
                    }.bind(this)).catch(function (result) {
                        ReactGA.exception({
                            description: 'Failed to Change Plan',
                            fatal: true
                        });
                });
            }.bind(this));
    }

    renderPlanOutput() {
        if(!this.state.plan) {
            return
        }

        if (this.state.plan.pendingPlan) {
            return <p data-qa="account-current-plan">{this.state.plan.pendingPlan.status} Plan: {this.state.plan.pendingPlan.plan} - <Link to="/subscription/addCard">Add Card Details</Link></p>
        }

        return <p data-qa="account-current-plan">Current Plan: {this.state.plan.plan}</p>
    }

    render() {
        let currentPlan = this.renderPlanOutput()
        return (
            <div style={style.account} data-qa="account-page">
                {currentPlan}
                <ChangePassword changePassword={this.handleChangePassword.bind(this)} message={this.state.changePasswordMessage}/>
                <br />
                <Plans planSelected={(id) => this.handlePlanChange(id)} />
            </div>
        );
    }
}

AccountPage.propTypes = {
}