import React, {Component} from 'react';
import Login from './Login.js'
import './Signup.css';
var api = require('../utils/api.js');

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
                <legend>{this.state.message}</legend>
            )
        }

        if (!this.props.route.loggedIn) {
            return (
                <div className="pure-g">
                    <div className="pure-u-1 pure-u-md-1-2">
                        <h2 className="content-subhead">Login</h2>
                        <Login loggedIn={this.props.route.loggedIn} loggedInCallback={this.props.route.loggedInCallback}/>
                    </div>
                    <div className="pure-u-1 pure-u-md-1-2">
                        <h2 className="content-subhead">Signup</h2>
                        <form action="#" onSubmit={this.handleSignup.bind(this)} className="pure-form pure-form-aligned">
                            <fieldset>
                                {message}
                                <div className="pure-control-group">
                                    <label htmlFor="name">Email</label>
                                    <input className="pure-input-2-3" id="email" type="email" onChange={this.handleChangeEmail.bind(this)} placeholder="Email" autoComplete="off" />
                                </div>
                                <div className="pure-control-group">
                                    <label htmlFor="name">Password</label>
                                    <input className="pure-input-2-3" id="password" type="password" onChange={this.handleChangePassword.bind(this)} placeholder="Password" autoComplete="off" />
                                </div>
                                <div className="pure-control-group">
                                    <label htmlFor="name">Verify Password</label>
                                    <input className="pure-input-2-3" id="verifyPassword" type="password" onChange={this.handleChangeVerifyPassword.bind(this)} placeholder="Verify Password" autoComplete="off" />
                                </div>
                                <div className="pure-controls">
                                    <label htmlFor="cb" className="pure-checkbox">
                                        <input id="cb" type="checkbox" />I've read the terms and conditions
                                    </label>

                                    <button type="submit" className="pure-button button-success">Sign Up</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            );
        } else {
            return ( <p>Logged In</p> )
        }
    }
}

export default Signup