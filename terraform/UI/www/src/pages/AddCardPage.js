import React, {Component} from 'react';
import AddCard from '../components/account/AddCard.js'

const authUtils = require('../utils/auth.js');

const ReactGA = require('react-ga');

const style = {
    addCard: {
        "display": "inline-block"
    }
};

export default class AddCardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: null
        };
    }

    onSubmit(name, number, exp_month, exp_year, cvc) {

        ReactGA.event({
            category: 'Signup',
            action: 'Card Added'
        });

        const _this = this
        /* global Stripe:false */
        Stripe.card.createToken({
            number,
            exp_month,
            exp_year,
            cvc,
            name
        }, (status, response) => {
            if (response.error) {
                _this.setState({
                    message: "Adding Card Failed"
                });
                console.error('Adding card failed with error: ' + response.error.message);
                ReactGA.exception({
                    description: 'Stripe failed to generate card token',
                    fatal: true
                });
            } else {
                const cardToken = response.id;

                authUtils.getAuthApiGatewayClient()
                    .then(function (apigClient) {

                        var params = {
                            //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                        };
                        // Template syntax follows url-template https://www.npmjs.com/package/url-template
                        var pathTemplate = '/v1/subscription/addCard';
                        var method = 'POST';
                        var additionalParams = {};
                        var body = {
                            token: cardToken
                        };

                        apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                            .then(function (result) {
                                console.log('Card set for user');
                                if(result.data.added) {
                                    this.props.router.push('/account');
                                }
                            }.bind(this)).catch(function (error) {
                                this.setState({
                                    message: "Adding Card Failed"
                                });
                                ReactGA.exception({
                                    description: 'Failed to Add Card',
                                    fatal: true
                                });
                            });
                    }.bind(this));
            }
        });
    }

    render() {

        return (
            <div style={style.addCard} data-qa="add-card-page">
                <AddCard
                    addCard={this.onSubmit.bind(this)}
                    getName={this.state.message}
                />
            </div>
        );
    }
}

AddCardPage.propTypes = {
}