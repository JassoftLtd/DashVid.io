import React, {Component} from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';

const style = {
    card: {
        margin: 12,
        float: 'left',
    }
};

export default class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            emailError: null,
            password: "",
            passwordError: null,
            verifyPassword: "",
            verifyPasswordError: null,
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

        this.props.signup(this.state.email, this.state.password, this.props.plan)
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
        const {message} = this.props;

        return (
            <Card style={style.card}>
                <CardTitle title="Signup" subtitle={message} data-qa="signup-form-message" />
                <form onSubmit={this.handleSignup.bind(this)}>
                    <CardText>
                        <TextField
                            id="email"
                            hintText="Email"
                            type="email"
                            errorText={this.state.emailError}
                            value={this.state.email}
                            onChange={this.handleChangeEmail.bind(this)}
                            data-qa="signup-field-email"
                        />
                        <br />
                        <TextField
                            id="password"
                            hintText="Password"
                            type="password"
                            errorText={this.state.passwordError}
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)}
                            data-qa="signup-field-password"
                        />
                        <br />
                        <TextField
                            id="verifyPassword"
                            hintText="Verify Password"
                            type="password"
                            errorText={this.state.verifyPasswordError}
                            value={this.state.verifyPassword}
                            onChange={this.handleChangeVerifyPassword.bind(this)}
                            data-qa="signup-field-password-verify"
                        />
                    </CardText>
                    <CardText>
                        <Checkbox label="I've read the terms and conditions"
                                  data-qa="signup-check-terms" />
                    </CardText>
                    <CardActions>
                        <RaisedButton type="submit" label="Sign Up" primary={true}
                                      data-qa="signup-btn-signup" />
                    </CardActions>
                </form>
            </Card>
        );
    }
}

Signup.propTypes = {
    message: PropTypes.string,
    plan: PropTypes.string.isRequired,
    signup: PropTypes.func.isRequired
}