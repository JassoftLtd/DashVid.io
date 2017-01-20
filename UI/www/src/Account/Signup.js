import React, {Component} from 'react';
import Login from './Login.js'

class Signup extends Component {

    constructor(props) {
        super(props);

        var plan = this.props.location.query.plan ? this.props.location.query.plan : "Free";

        this.state = {
            plan: plan
        };
    }

    handleSignup (e) {

        e.preventDefault();

        if(this.state.password !== this.state.verifyPassword) {
            this.setState({
                message: "Passwords do not match"
            });
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
            <div className="pricing-tables pure-g">
                <div className="pure-u-1 pure-u-md-1-2">
                    <Login loggedIn={this.props.loggedIn} />
                </div>
                <div className="pure-u-1 pure-u-md-1-2">
                    <form action="#" onSubmit={this.handleSignup.bind(this)}>
                        <table>
                            <tbody>
                                {message}
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
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup