import React, {Component} from 'react';
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

export default class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            passwordError: null,
            oldPassword: "",
            oldPasswordError: null,
            verifyPassword: "",
            verifyPasswordError: null,
            message: null
        };
    }

    handleChangePassword (e) {
        this.setState({
            passwordError: null
        });
        this.setState({password: e.target.value});
    }

    handleChangeOldPassword (e) {
        this.setState({
            oldPasswordError: null
        });
        this.setState({oldPassword: e.target.value});
    }

    handleChangeVerifyPassword (e) {
        this.setState({
            verifyPasswordError: null
        });
        this.setState({verifyPassword: e.target.value});
    }

    handleChangePasswordSubmit (e) {

        e.preventDefault();

        this.setState({
            oldPasswordError: null,
            passwordError: null,
            verifyPasswordError: null,
            message: null
        });

        if(this.state.oldPassword.length === 0) {
            this.setState({
                oldPasswordError: "Please enter your password"
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

        this.props.changePassword(this.state.oldPassword, this.state.password)

        this.setState({
            oldPassword: "",
            password: "",
            verifyPassword: ""
        });
    }

    render() {
        const {message} = this.props;

        return (
            <Card style={style.card}>
                <CardTitle title="Change Password" subtitle={message} />
                <form onSubmit={this.handleChangePasswordSubmit.bind(this)}>
                    <CardText>
                        <TextField
                            id="oldPassword"
                            hintText="Old Password"
                            type="password"
                            errorText={this.state.oldPasswordError}
                            value={this.state.oldPassword}
                            onChange={this.handleChangeOldPassword.bind(this)}
                            data-qa="signup-field-password-old"
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
                    <CardActions>
                        <RaisedButton type="submit" label="Change Password" primary={true} />
                    </CardActions>
                </form>
            </Card>
        );
    }
}

ChangePassword.propTypes = {
    message: PropTypes.string,
    changePassword: PropTypes.func.isRequired,
}