var assert = require('assert');

var authHelper = require('./helpers/authHelper.js')
var generator = require('./helpers/generators.js')

var tokenOverride = 'TestToken'

describe('Auth', function () {

    this.timeout(5000);

    describe('Signup', function () {

        it('Should allow me to signup with a new user', function () {

            var email = generator.email()
            var password = generator.password()

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    assert.equal(result.data.created, true);
                });

        })
    });

    describe('Account Verification', function () {

        it('Given I activate a new account, When signing up for the Free plan, Then the returned status should be Active', function () {

            var email = generator.email()
            var password = generator.password()

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            assert.equal(result.data.verified, true);
                            assert.equal(result.data.plan, "Free");
                            assert.equal(result.data.status, "Active");
                        });
                });
        })

        it('Given I activate a new account, When signing up for the Standard plan, Then the returned status should be Pending', function () {

            var email = generator.email()
            var password = generator.password()

            return authHelper.signup(email, password, "Standard")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            assert.equal(result.data.verified, true);
                            assert.equal(result.data.plan, "Standard");
                            assert.equal(result.data.status, "Pending");
                        });
                });
        })
    });

    describe('Account Login', function () {

        it('Should allow me to login to a new account', function () {

            var email = generator.email()
            var password = generator.password()

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            return authHelper.login(email, password)
                                .then(function (result) {
                                    assert.equal(result.data.login, true);
                                    // assert.equal(result.data.identityId, "");
                                    // assert.equal(result.data.token, "");
                                });
                        });
                });

        })
    });

});
