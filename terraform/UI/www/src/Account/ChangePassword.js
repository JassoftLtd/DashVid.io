import React, {Component} from 'react';
var authUtils = require('../utils/auth.js');

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

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

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
        <div className="pure-g">
            <div className="pure-u-1 pure-u-md-1-2">
                <h2 className="content-subhead">Change Password</h2>
                <form onSubmit={this.handleChangePassword.bind(this)} className="pure-form pure-form-aligned">
                    <fieldset>
                        {message}
                        <div className="pure-control-group">
                            <label htmlFor="name">Old Password</label>
                            <input className="pure-input-2-3" id="oldPassword" type="password" value={this.state.oldPassword} onChange={this.handleChangeOldPassword.bind(this)} placeholder="Old Password" autoComplete="off" />
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Password</label>
                            <input className="pure-input-2-3" id="newPassword" type="password" value={this.state.newPassword} onChange={this.handleChangeNewPassword.bind(this)} placeholder="Password" autoComplete="off" />
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Verify Password</label>
                            <input className="pure-input-2-3" id="verifyPassword" type="password"value={this.state.verifyPassword}  onChange={this.handleChangeVerifyPassword.bind(this)} placeholder="Verify Password" autoComplete="off" />
                        </div>
                        <div className="pure-controls">
                            <button type="submit" className="pure-button button-success">Change Password</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        );
    }
}

export default ChangePassword