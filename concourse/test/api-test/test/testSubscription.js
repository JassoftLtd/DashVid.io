var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var subscriptionHelper = require('./helpers/subscriptionHelper.js');
var generator = require('./helpers/generators.js');

var stripe = require('stripe')('pk_test_ebVZiJokoWIbXD1TNNZ8lj2A');

describe('Subscription', function () {

    this.timeout(10000);

    describe('Add Card', function () {

        it('Given I have a verified account on a pending standard plan, When I add a card, Then my plan should become active', function () {
           return authHelper.getLoggedInUser("standard")
                .then(function (user) {

                    var card = {
                        number: '4242424242424242',
                        cvc: '123',
                        exp_month: '04',
                        exp_year: '20',
                        address_zip: ''
                    }

                    return stripe.card.createToken(card)
                        .then(function (token) {

                            return subscriptionHelper.addCard(user, generator.cardToken())
                                .catch(function (error) {
                                    console.error(error)
                                })
                        });

                });
        });
    });

});
