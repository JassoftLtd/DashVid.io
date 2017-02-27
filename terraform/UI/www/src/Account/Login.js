import React, {Component} from 'react';
var authUtils = require('../utils/auth.js');
var api = require('../utils/api.js');

////////////////
// Login //
////////////////

// Login Container

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            message: null
        };
    }

    handleLogin (e) {

        if(this.state.email.length === 0) {
            this.setState({
                message: "Please enter an email address"
            });
            return
        }

        if(this.state.password.length === 0) {
            this.setState({
                message: "Please enter your password"
            });
            return
        }

        const _this = this;

        fetch(api.getApiAddress() + '/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.login) {
                var params = {
                    IdentityPoolId: window.REACT_APP_AWS_IDENTITY_POOL,
                    IdentityId: json.identityId,
                    Logins: {
                        'cognito-identity.amazonaws.com': json.token
                    }
                }

                authUtils.createCognitoIdentityCredentials(params)

                _this.props.loggedInCallback(true)

                window.location.href = '/video';
            }
            else {
                _this.setState({
                    message: "Login Failed"
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    }

    handleLostPassword () {

        if(this.state.email.length === 0) {
            this.setState({
                message: "Please enter an email address"
            });
            return
        }

        const _this = this;

        fetch(api.getApiAddress() + '/v1/auth/lostPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.sent) {
                _this.setState({
                    message: "Lost password email sent to " + _this.state.email + "",
                    email: "",
                    password: ""
                });
            }
            else {
                _this.setState({
                    message: "Failed sent lost password email to " + _this.state.email + "."
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    }

    handleChangeEmail (e) {
        this.setState({email: e.target.value});
    }

    handleChangePassword (e) {
        this.setState({password: e.target.value});
    }

    render() {

        if (this.props.loggedIn) {
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
                <table>
                    <tbody>
                        {message}
                        <tr>
                            <td>Email</td>
                            <td><input onChange={this.handleChangeEmail.bind(this)} type="email"
                                       id="email"
                                       size="20"/></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input onChange={this.handleChangePassword.bind(this)} type="password"
                                       id="password" size="20"/></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit" id="login-button" onClick={this.handleLogin.bind(this)}>Login</button>
                                <button id="lost-password-button" onClick={this.handleLostPassword.bind(this)}>Lost Password</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        } else {
            return ( <p>Logged In</p> )
        }
    }
}

export default Login