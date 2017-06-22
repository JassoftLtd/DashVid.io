import React, {Component} from 'react';

import Login from '../components/account/Login.js'

const authUtils = require('../utils/auth.js');
const api = require('../utils/api.js');

const jws = require('jws');

const style = {
    login: {
        "display": "inline-block"
    }
};

export default class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: null
        };
    }

    handleLogin (email, password) {

        fetch(api.getApiAddress() + '/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if(json.login) {

                let token = jws.decode(json.token)

                let payload = JSON.parse(token.payload)

                var params = {
                    IdentityPoolId: payload.aud,
                    IdentityId: json.identityId,
                    Logins: {
                        'cognito-identity.amazonaws.com': json.token
                    }
                }

                authUtils.createCognitoIdentityCredentials(params)

                this.props.routes[0].logIn()
                this.props.route.loggedIn();

                this.props.router.push('/video');

            }
            else {
                this.setState({
                    message: "Login Failed"
                });
            }

        }.bind(this))
        .catch(function (ex) {
            console.log('parsing failed', ex)
            this.setState({
                message: "Login Failed"
        });
        }.bind(this))

    }

    handleLostPassword (email) {

        fetch(api.getApiAddress() + '/v1/auth/lostPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.sent) {
                this.setState({
                    message: "Lost password email sent to " + email + "",
                });
            }
            else {
                this.setState({
                    message: "Failed sent lost password email to " + email + "."
                });
            }

        }.bind(this)).catch(function (ex) {
            console.log('parsing failed', ex);
            this.setState({
                message: "Password Reset Failed"
            });
        }.bind(this))

    }

    render() {

        return (
            <div style={style.login}>
                <Login login={ this.handleLogin.bind(this) } lostPassword={ this.handleLostPassword.bind(this) } message={this.state.message} />
            </div>
        );
    }
}

LoginPage.propTypes = {
}