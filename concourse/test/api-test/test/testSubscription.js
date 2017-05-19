var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var subscriptionHelper = require('./helpers/subscriptionHelper.js');
var planHelper = require('./helpers/planHelper.js');

var stripe = require('stripe')('pk_test_ebVZiJokoWIbXD1TNNZ8lj2A');

describe('Subscription', function () {

    this.timeout(30000);

    describe('Add Card', function () {

        it('Given I have a verified account on a pending standard plan, When I add a card, Then my plan should become active', function (done) {
           authHelper.getLoggedInUser("standard")
                .then(function (user) {

                    var payload = {
                        card: {
                            number: '4242424242424242',
                            cvc: '123',
                            exp_month: '04',
                            exp_year: '20'
                        }
                    }


                    stripe.tokens.create(payload, function (err, token) {
                        if(err) {
                            console.error("Error creating token")
                            done("Error creating token")
                        }

                        subscriptionHelper.addCard(user, token.id)
                            .catch(function (error) {
                                console.error("Error adding card")
                                done(error)
                            })
                            .then(function (result) {
                                assert.equal(result.data.added, true);

                                planHelper.getPlan(user)
                                    .catch(function (error) {
                                        console.error("Error getting plan")
                                        done(error)
                                    })
                                    .then(function (result) {
                                        assert(result.data.plan);
                                        assert.equal(result.data.plan, "standard");
                                        assert.equal(result.data.status, "Active");
                                        done();
                                    });

                            })
                    })

                })
        });
    });

    it('Given I have a verified account on an active standard plan, When I downgrade my subscription, Then my plan should downgrade to an active free plan', function () {

        return authHelper.getLoggedInUser("standard")
            .then(function (user) {
                return planHelper.switchPlan(user, "free")
                    .then(function () {
                        return planHelper.getPlan(user)
                            .then(function (result) {
                                assert(result.data.plan);
                                assert.equal(result.data.plan, "free");
                                assert.equal(result.data.status, "Active");
                            });
                    })
            });
    });

    it('Given I have a verified account on an active free plan with no card details, When I upgrade my subscription, Then my plan should change to a pending standard plan', function () {

        return authHelper.getLoggedInUser("free")
            .then(function (user) {
                return planHelper.switchPlan(user, "standard")
                    .then(function () {
                        return planHelper.getPlan(user)
                            .then(function (result) {
                                assert(result.data.plan);
                                assert.equal(result.data.plan, "standard");
                                assert.equal(result.data.status, "Pending");
                            });
                    })
            });
    });

    it('Given I have a verified account on a pending standard, When I downgrade my subscription, Then my pending standard plan should be canceled', function () {

        return authHelper.getLoggedInUser("free")
            .then(function (user) {
                return planHelper.switchPlan(user, "standard")
                    .then(function () {
                        return planHelper.getPlan(user)
                            .then(function (result) {
                                assert(result.data.plan);
                                assert.equal(result.data.plan, "standard");
                                assert.equal(result.data.status, "Pending");

                            // Now cancel the upgrade
                            });
                    })
            });
    });

    // it('Given I have a verified account on an active standard plan, When I have a payment fail, Then I should should receive a warning email', function (done) {
    //     done();
    // });

});
