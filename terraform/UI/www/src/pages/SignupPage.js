import React, {Component} from 'react';

import Signup from '../components/account/Signup.js'

const api = require('../utils/api.js');

const ReactGA = require('react-ga');

const style = {
    signup: {
        "display": "inline-block"
    }
};

export default class SignupPage extends Component {

    constructor(props) {
        super(props);

        var plan = (this.props.params.plan) ? this.props.params.plan : "free";

        this.state = {
            plan: plan,
            message: null
        };
    }

    handleSignup (email, password, plan) {

        ReactGA.event({
            category: 'Signup',
            action: 'Form Submitted'
        });

        this.setState({
            message: null
        });

        fetch(api.getApiAddress() + '/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                plan: plan,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.created) {
                this.setState({
                    message: "User " + email + " created. Please check your email to validate the user and enable login.",
                });
            }
            else {this.setState({
                    message: "Failed to create User " + email + "."
                });
            }

        }.bind(this)).catch(function (ex) {
            this.setState({
                message: "Signup Failed"
            });
            ReactGA.exception({
                description: 'Failed Signup',
                fatal: true
            });
        }.bind(this))

    }

    render() {

        return (
            <div style={style.signup}>
                <Signup signup={ this.handleSignup.bind(this) } plan={this.state.plan} message={this.state.message} />
            </div>
        );
    }
}

SignupPage.propTypes = {
}