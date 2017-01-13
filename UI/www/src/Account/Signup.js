import React, {Component} from 'react';

class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            verifyPassword: ""
        };
    }

    handleSignup (e) {

        e.preventDefault();

        if(this.state.password !== this.state.verifyPassword) {
            console.error("Do something about this")
            return
        }

        const _this = this;

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/signup', {
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

    handleChangeVerifyPassword (e) {
        this.setState({verifyPassword: e.target.value});
    }

    render() {
        return (
            <form action="#" onSubmit={this.handleSignup.bind(this)}>
                <table>
                    <tr>
                        <td>Email</td>
                        <td><input onChange={this.handleChangeEmail.bind(this)}
                                   type="email" id="email" size="20" /></td>
                    </tr>
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
                            <button id="signup-button">Sign Up</button>
                        </td>
                    </tr>
                </table>
            </form>
        );
    }
}

export default Signup