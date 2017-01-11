import React, {Component} from 'react';

var AWS = require('aws-sdk');

class Account extends Component {

    constructor(props) {
        super(props);

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        this.state = {
            loggedIn: identityPoolParams != null,
        };
    }

    onAuthStateChange(loggedIn) {
        console.log('Account Knows of Auth state change')
        this.setState({loggedIn: loggedIn})
    }

    render() {
        return (
            <div className="App">
                <Login loggedIn={this.state.loggedIn} loginCallback={(loggedIn) => this.onAuthStateChange(loggedIn)}/>
                <Logout loggedIn={this.state.loggedIn} logoutCallback={(loggedIn) => this.onAuthStateChange(loggedIn) }/>
                <p>Account Functions</p>
            </div>
        );
    }
}


////////////////
// Login //
////////////////

// Login Container

var Login = React.createClass({


    getInitialState: function () {
        return {email: "", password: ""};
    },

    handleLogin: function () {

        const _this = this;

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/login', {
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

            var params = {
                IdentityPoolId: 'eu-west-1:ac18a09a-6c09-47f2-a297-f3ce8a40f1b4',
                IdentityId: json.identityId,
                Logins: {
                    'cognito-identity.amazonaws.com': json.token
                }
            }
            localStorage.setItem("IdentityPoolParams", JSON.stringify(params));

            AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

            _this.props.loginCallback(true)

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    },

    handleChangeEmail: function (e) {
        this.setState({email: e.target.value});
    },

    handleChangePassword: function (e) {
        this.setState({password: e.target.value});
    },

    render: function () {

        if (!this.props.loggedIn) {
            return (
                <form action="#" onSubmit={this.handleLogin}>
                    <table>
                        <tr>
                            <td>Email</td>
                            <td><input value={this.state.email} onChange={this.handleChangeEmail} type="email"
                                       id="email"
                                       size="20"/></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input value={this.state.password} onChange={this.handleChangePassword} type="password"
                                       id="password" size="20"/></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit" id="login-button">Login</button>
                            </td>
                        </tr>
                    </table>
                </form>
            );
        } else {
            return ( <p>Logged In</p> )
        }
    }
});

////////////////
// Logout //
////////////////

// Logout Container

var Logout = React.createClass({

    handleLogout: function () {

        localStorage.removeItem("IdentityPoolParams");
        this.props.logoutCallback(false)

    },

    render: function () {

        if (this.props.loggedIn) {
            return (
                <button onClick={this.handleLogout} id="logout-button">Logout</button>
            );
        } else {
            return null
        }
    }
});

export default Account;
