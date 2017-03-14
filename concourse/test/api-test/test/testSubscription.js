var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var subscriptionHelper = require('./helpers/subscriptionHelper.js');
var generator = require('./helpers/generators.js');

describe('Subscription', function () {

    this.timeout(10000);

    describe('Add Card', function () {

        it('Given I have a verified account on a pending standard plan, When I add a card, Then my plan should become active', function () {
           return authHelper.getLoggedInUser("standard")
                .then(function (user) {

                    return subscriptionHelper.addCard(user, generator.cardToken())
                        .catch(function (error) {
                            console.error(error)
                        })

                });
        });
    });

});
