import React, {Component} from 'react';
import { browserHistory } from 'react-router';

var authUtils = require('../utils/auth.js');

////////////////
// Login //
////////////////

// Login Container

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    handleLogin (e) {

        e.preventDefault();

        const _this = this;

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/login', {
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

            var params = {
                IdentityPoolId: 'eu-west-1:ac18a09a-6c09-47f2-a297-f3ce8a40f1b4',
                IdentityId: json.identityId,
                Logins: {
                    'cognito-identity.amazonaws.com': json.token
                }
            }

            authUtils.createCognitoIdentityCredentials(params)

            _this.props.authCallback(true)

            browserHistory.push('/Video');

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

        if (!authUtils.hasAuth()) {
            return (
                <form action="#" onSubmit={this.handleLogin.bind(this)}>
                    <table>
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
                                <button type="submit" id="login-button">Login</button>
                            </td>
                        </tr>
                    </table>
                </form>
            );
        } else {
            return ( <p>Logged In</p> )
        }
    }
}

export default Login