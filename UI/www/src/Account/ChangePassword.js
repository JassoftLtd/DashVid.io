import React, {Component} from 'react';
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')
var authUtils = require('../utils/auth.js');

AWS.config.region = 'eu-west-1'; // Region

class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPassword: "",
            newPassword: "",
            verifyPassword: ""
        };
    }

    handleChangePassword (e) {

        e.preventDefault();

        if(this.state.newPassword !== this.state.verifyPassword) {
            this.setState({
                message: "Passwords do not match"
            });
            return
        }

        const _this = this;

        authUtils.runWithCredentials(function () {

            var config = {
                invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev',
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
            var pathTemplate = '/v1/auth/changePassword'
            var method = 'POST';
            var additionalParams = {};
            var body = {
                oldPassword: _this.state.oldPassword,
                newPassword: _this.state.newPassword
            };

            apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                .then(function (result) {
                    console.log('parsed json', result)

                    if (result.data.changed) {
                        _this.setState({
                            message: 'Password changed for user',
                            oldPassword: "",
                            newPassword: "",
                            verifyPassword: "",
                        });
                    } else {
                        _this.setState({
                            message: 'Password not changed for user'
                        });
                    }
                }).catch(function (result) {
                //This is where you would put an error callback
                console.error('failed', result)
            });
        });


    }

    handleChangeOldPassword (e) {
        this.setState({oldPassword: e.target.value});
    }

    handleChangeNewPassword (e) {
        this.setState({newPassword: e.target.value});
    }

    handleChangeVerifyPassword (e) {
        this.setState({verifyPassword: e.target.value});
    }

    render() {
        var message

        if(this.state.message) {
            message = (
                <tr>
                    <td colSpan="2">
                        <p>{this.state.message}</p>
                    </td>
                </tr>
            )
        }

        return (
            <div>
                <h2>Change Password</h2>
                <table>
                    {message}
                    <tr>
                        <td>Old Password</td>
                        <td><input onChange={this.handleChangeOldPassword.bind(this)}
                                   type="password" id="oldPassword" size="20" /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input onChange={this.handleChangeNewPassword.bind(this)}
                                   type="password" id="newPassword" size="20" /></td>
                    </tr>
                    <tr>
                        <td>Verify Password</td>
                        <td><input onChange={this.handleChangeVerifyPassword.bind(this)}
                                   type="password" id="verifyPassword" size="20" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button id="signup-button" onClick={this.handleChangePassword.bind(this)}>Change Password</button>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default ChangePassword