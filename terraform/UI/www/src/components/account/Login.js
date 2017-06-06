import React, {Component} from 'react';
import { Link } from 'react-router';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

var authUtils = require('../../utils/auth.js');
var api = require('../../utils/api.js');

const style = {
    card: {
        margin: 12,
        float: 'left',
    }
};

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            emailError: null,
            password: "",
            passwordError: null,
            message: null
        };
    }

    handleLogin (e) {

        e.preventDefault();

        this.setState({
            emailError: null,
            passwordError: null,
            message: null
        });

        if(this.state.email.length === 0) {
            this.setState({
                emailError: "Please enter an email address"
            });
            return
        }

        if(this.state.password.length === 0) {
            this.setState({
                passwordError: "Please enter your password"
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

                _this.setState({
                    email: "",
                    password: ""
                });

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
            _this.setState({
                message: "Login Failed"
            });
        })

    }

    handleLostPassword () {

        this.setState({
            emailError: null,
            passwordError: null,
            message: null
        });

        if(this.state.email.length === 0) {
            this.setState({
                emailError: "Please enter an email address"
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
            console.log('parsing failed', ex);
            _this.setState({
                message: "Password Reset Failed"
            });
        })

    }

    handleChangeEmail (e) {
        this.setState({
            emailError: null,
        });
        this.setState({email: e.target.value});
    }

    handleChangePassword (e) {
        this.setState({
            passwordError: null
        });
        this.setState({password: e.target.value});
    }

    render() {
        return (
            <Card style={style.card}>
                <CardTitle title="Login" subtitle={this.state.message} />
                <form onSubmit={this.handleLogin.bind(this)}>
                    <CardText>
                        <TextField
                            id="email"
                            hintText="Email"
                            type="email"
                            errorText={this.state.emailError}
                            value={this.state.email}
                            onChange={this.handleChangeEmail.bind(this)}
                        />
                        <br />
                        <TextField
                            id="password"
                            hintText="Password"
                            type="password"
                            errorText={this.state.passwordError}
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)}
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton type="submit" label="Login" primary={true} />
                        <RaisedButton label="Forgotten Password" onClick={this.handleLostPassword.bind(this)} />
                    </CardActions>
                    <CardActions>
                        <Link to="/signup">
                            <RaisedButton label="Register" secondary={true}/>
                        </Link>
                    </CardActions>
                </form>
            </Card>
        );
    }
}

Login.propTypes = {
    loginCallback: PropTypes.func.isRequired
}