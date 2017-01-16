import React, {Component} from 'react';

class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
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

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if (json.changed) {
                _this.setState({
                    message: 'Password changed for user ' + _this.state.email,
                    oldPassword: "",
                    newPassword: "",
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
            <table>
                {message}
                <tr>
                    <td>Old Password</td>
                    <td><input onChange={this.handleChangeOldPassword.bind(this)}
                               type="password" id="oldPassword" size="20" /></td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input onChange={this.handleChangeNewPassword.bind(this)}
                               type="password" id="newPassword" size="20" /></td>
                </tr>
                <tr>
                    <td>Verify Password</td>
                    <td><input onChange={this.handleChangeVerifyPassword.bind(this)}
                               type="password" id="verifyPassword" size="20" /></td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <button id="signup-button" onClick={this.handleChangePassword.bind(this)}>Change Password</button>
                    </td>
                </tr>
            </table>
        );
    }
}

export default ChangePassword