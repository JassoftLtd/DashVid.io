import React, {Component} from 'react';
var api = require('../utils/api.js');

class Reset extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: null,
            email: this.props.location.query.email,
            lost: this.props.location.query.lost
        };
    }

    handleResetPassword (e) {

        e.preventDefault();

        if(this.state.password !== this.state.verifyPassword) {
            this.setState({
                message: "Passwords do not match"
            });
            return
        }

        const _this = this;

        fetch(api.getApiAddress() + '/v1/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                lost: this.state.lost
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if (json.changed) {
                _this.setState({
                    message: 'Password changed for user ' + _this.state.email,
                    email: "",
                    password: "",
                    verifyPassword: "",
                });
            } else {
                _this.setState({
                    message: 'Password not changed for user ' + _this.state.email
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    }

    handleChangePassword (e) {
        this.setState({password: e.target.value});
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
            <form action="#" onSubmit={this.handleResetPassword.bind(this)}>
                <table>
                    {message}
                    <tr>
                        <td>Password</td>
                        <td><input onChange={this.handleChangePassword.bind(this)}
                                   type="password" id="password" size="20" /></td>
                    </tr>
                    <tr>
                        <td>Verify Password</td>
                        <td><input onChange={this.handleChangeVerifyPassword.bind(this)}
                                   type="password" id="verifyPassword" size="20" /></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button id="signup-button">Reset Password</button>
                        </td>
                    </tr>
                </table>
            </form>
        );
    }
}

export default Reset