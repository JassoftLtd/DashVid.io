var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var generator = require('./helpers/generators.js');

var tokenOverride = 'TestToken';

describe('Auth', function () {

    this.timeout(5000);

    describe('Signup', function () {

        it('Given I am a new User, When i signup for an account, Then it should be created', function () {

            var email = generator.email();
            var password = generator.password();

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    assert.equal(result.data.created, true);
                });

        })
    });

    describe('Account Verification', function () {

        it('Given I activate a new account, When signing up for the Free plan, Then the returned status should be Active', function () {

            var email = generator.email();
            var password = generator.password();

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            assert.equal(result.data.verified, true);
                            assert.equal(result.data.plan, "free");
                            assert.equal(result.data.status, "Active");
                        });
                });
        })

        it('Given I activate a new account, When signing up for the Standard plan, Then the returned status should be Pending', function () {

            var email = generator.email();
            var password = generator.password();

            return authHelper.signup(email, password, "Standard")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            assert.equal(result.data.verified, true);
                            assert.equal(result.data.plan, "standard");
                            assert.equal(result.data.status, "Pending");
                        });
                });
        })
    });

    describe('Account Login', function () {

        it('Given I have a verified account, When i supply my login credentials, Then i should be returned a login token', function () {

            var email = generator.email();
            var password = generator.password();

            return authHelper.signup(email, password, "Free")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            return authHelper.login(email, password)
                                .then(function (result) {
                                    assert.equal(result.data.login, true);
                                    assert(result.data.identityId);
                                    assert(result.data.token);
                                });
                        });
                });

        })
    });

});
