import React, {Component} from 'react';
var global = require('./config.json')

class Verify extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "Verifying..."
        };

        var email = this.props.location.query.email
        var verify = this.props.location.query.verify

        if(!email || !verify) {
            this.state = {
                message: "Unable to extract email and token from url"
            };
            return
        }

        const _this = this;

        fetch(global.apiAddress + '/v1/auth/verifyUser', {
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
                    message: "User verified."
                });

                window.location.href = '/signup';
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    }

    render() {
        return (<p>{this.state.message}</p>);
    }
}

export default Verify