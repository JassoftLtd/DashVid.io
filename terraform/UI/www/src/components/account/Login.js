import React, {Component} from 'react';
import { Link } from 'react-router';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

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

    handleSubmit (e) {
        e.preventDefault();

        this.setState({
            emailError: null,
            passwordError: null
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

        this.props.login(this.state.email, this.state.password)
    }

    handleLostPassword (e) {
        e.preventDefault();

        this.setState({
            emailError: null,
            passwordError: null
        });

        if(this.state.email.length === 0) {
            this.setState({
                emailError: "Please enter an email address"
            });
            return
        }

        this.props.lostPassword(this.state.email)

    }

    render() {
        const {message} = this.props;

        return (
            <Card style={style.card}>
                <CardTitle title="Login" subtitle={message} data-qa="login-form-message" />
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <CardText>
                        <TextField
                            id="email"
                            hintText="Email"
                            type="email"
                            errorText={this.state.emailError}
                            value={this.state.email}
                            onChange={this.handleChangeEmail.bind(this)}
                            data-qa="login-field-email"
                        />
                        <br />
                        <TextField
                            id="password"
                            hintText="Password"
                            type="password"
                            errorText={this.state.passwordError}
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)}
                            data-qa="login-field-password"
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton type="submit" label="Login" primary={true}
                                      data-qa="login-btn-login" />
                        <RaisedButton label="Forgotten Password" onClick={this.handleLostPassword.bind(this)}
                                      data-qa="login-btn-forgotten-password" />
                    </CardActions>
                    <CardActions>
                        <Link to="/signup/free">
                            <RaisedButton label="Register" secondary={true}
                                          data-qa="login-btn-register" />
                        </Link>
                    </CardActions>
                </form>
            </Card>
        );
    }
}

Login.propTypes = {
    message: PropTypes.string,
    login: PropTypes.func.isRequired,
    lostPassword: PropTypes.func.isRequired
}