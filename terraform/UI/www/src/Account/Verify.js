import React, {Component} from 'react';
import { Link } from 'react-router';
const api = require('../utils/api.js');

const ReactGA = require('react-ga');

class Verify extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: (
                <p data-qa="verify-text-pending">Verifying...</p>
            )
        };

        var email = this.props.location.query.email
        var verify = this.props.location.query.verify

        if(!email || !verify) {
            this.state = {
                message: (
                    <p data-qa="verify-text-failed">Unable to extract email and token from url</p>
                )
            };
            return
        }

        ReactGA.event({
            category: 'Signup',
            action: 'User Verified'
        });

        const _this = this;

        fetch(api.getApiAddress() + '/v1/auth/verifyUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                verify: verify
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.verified) {
                _this.setState({
                    message: (
                        <div>
                            <p data-qa="verify-text-confirmation">User verified.</p>
                            <p>You may now <Link to="/login">Login</Link> and start using Dashvid.io</p>
                        </div>
                    )
                });
            }
            else {
                _this.setState({
                    message: (
                        <p data-qa="verify-text-failed">User verification failed.</p>
                    )
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    }

    render() {
        return this.state.message;
    }
}

export default Verify