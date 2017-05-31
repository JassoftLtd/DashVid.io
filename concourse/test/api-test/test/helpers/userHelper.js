var assert = require('assert');
var AWS = require('aws-sdk');
var generator = require('./generators.js');
var emailHelper = require('./emailHelper.js');
var authHelper = require('./authHelper.js');
var Promise = require('promise');
var promiseRetry = require('promise-retry');

var stripe = require('stripe')('pk_test_ebVZiJokoWIbXD1TNNZ8lj2A');

var stripeWebhookHelper = require('./stripeWebhookHelper.js');
var subscriptionHelper = require('./subscriptionHelper.js');
var planHelper = require('./planHelper.js');

exports.getLoggedInUser = function (plan = "free") {

    var email = generator.email();
    var password = generator.password();

    return authHelper.signup(email, password, plan)
        .then(function (result) {
            return emailHelper.getEmails(email, "Verification Email for DashVid.io")
                .then((result) => emailHelper.getVerifyTokenFromEmail(result))
                .then(function (token) {

                    return authHelper.verify(email, token)
                        .then(function (result) {
                            return authHelper.login(email, password)
                                .then(function (result) {

                                    var params = {
                                        IdentityPoolId: process.env.aws_identity_pool,
                                        IdentityId: result.data.identityId,
                                        Logins: {
                                            'cognito-identity.amazonaws.com': result.data.token
                                        }
                                    }

                                    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

                                    AWS.config.region = process.env.aws_region;

                                    return AWS.config.credentials.getPromise()
                                        .then(function () {

                                            return Promise.resolve({
                                                email: email,
                                                password: password,
                                                credentials: AWS.config.credentials
                                            })

                                        });


                                });
                        });
                });
        });
}

exports.getLoggedInUserOnPaidPlan = function (plan = "standard") {
    return new Promise(function (resolve, reject) {
        exports.getLoggedInUser("standard")
            .then(function (user) {

                var payload = {
                    card: {
                        number: '4242424242424242',
                        cvc: '123',
                        exp_month: '04',
                        exp_year: '20'
                    }
                };

                stripe.tokens.create(payload, function (err, token) {
                    if (err) {
                        console.error("Error creating token");
                        reject("Error creating token")
                    }

                    subscriptionHelper.addCard(user, token.id)
                        .catch(function (error) {
                            console.error("Error adding card");
                            reject(error);
                        })
                        .then(function (result) {
                            assert.equal(result.data.added, true);

                            promiseRetry(function (retry, number) {
                                return planHelper.getPlan(user)
                                    .then(function (result) {
                                        assert(result.data.plan);
                                        assert.equal(result.data.plan, "standard");
                                        assert.equal(result.data.status, "Active");
                                        resolve(user);
                                    })
                                    .catch(retry);
                            })
                            .catch(function (error) {
                                console.error("Error getting plan")
                                reject(error)
                            });

                        })
                })

            });
    });
}