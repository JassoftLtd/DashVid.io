import React, {Component} from 'react';
import {CardForm} from 'react-payment';

class AddCard extends Component {

    onSubmit(card) {
        const {number, exp_month, exp_year, cvc, name, zip} = card;
        /* global Stripe:false */
        Stripe.card.createToken({
            number,
            exp_month,
            exp_year,
            cvc,
            name,
            address_zip: zip
        }, (status, response) => {
            if (response.error) {
                alert('Adding card failed with error: ' + response.error.message);
            } else {
                const cardToken = response.id;
                // send cardToken to server to be saved under the current user
                // show success message and navigate away from form
                console.log('Response: ' + JSON.stringify(response))
                console.log('Need to send card token to server: ' + cardToken)
            }
        });
    }

    render() {
        return (
            <CardForm
                onSubmit={this.onSubmit}
                getName={true}
            />
        );
    }
}


export default AddCard;
