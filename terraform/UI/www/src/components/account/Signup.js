import React, {Component} from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
var api = require('../../utils/api.js');

const style = {
    card: {
        margin: 12,
        float: 'left',
    }
};

export default class Signup extends Component {

    constructor(props) {
        super(props);

        var plan = (this.props.location && this.props.location.query.plan) ? this.props.location.query.plan : "Free";

        this.state = {
            plan: plan,
            email: "",
            emailError: null,
            password: "",
            passwordError: null,
            verifyPassword: "",
            verifyPasswordError: null,
            message: null
        };
    }

    handleSignup (e) {

        e.preventDefault();

        this.setState({
            emailError: null,
            passwordError: null,
            verifyPasswordError: null,
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

        if(this.state.verifyPassword.length === 0) {
            this.setState({
                verifyPasswordError: "Please enter your password again"
            });
            return
        }

        if(this.state.password !== this.state.verifyPassword) {
            this.setState({
                verifyPasswordError: "Passwords do not match"
            });
            return
        }

        const _this = this;

        fetch(api.getApiAddress() + '/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                plan: this.state.plan,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.created) {
                _this.setState({
                    message: "User " + _this.state.email + " created. Please check your email to validate the user and enable login.",
                    email: "",
                    password: "",
                    verifyPassword: "",
                });
            }
            else {
                _this.setState({
                    message: "Failed to create User " + _this.state.email + "."
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
            _this.setState({
                message: "Signup Failed"
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

    handleChangeVerifyPassword (e) {
        this.setState({
            verifyPasswordError: null
        });
        this.setState({verifyPassword: e.target.value});
    }

    render() {
        return (
            <Card style={style.card}>
                <CardTitle title="Signup" subtitle={this.state.message} />
                <form onSubmit={this.handleSignup.bind(this)}>
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
                        <br />
                        <TextField
                            id="verifyPassword"
                            hintText="Verify Password"
                            type="password"
                            errorText={this.state.verifyPasswordError}
                            value={this.state.verifyPassword}
                            onChange={this.handleChangeVerifyPassword.bind(this)}
                        />
                    </CardText>
                    <CardText>
                        <Checkbox label="I've read the terms and conditions" />
                    </CardText>
                    <CardActions>
                        <RaisedButton type="submit" label="Sign Up" primary={true} />
                    </CardActions>
                </form>
            </Card>
        );
    }
}