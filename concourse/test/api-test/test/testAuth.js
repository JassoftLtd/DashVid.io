var assert = require('assert');

var authHelper = require('./helpers/authHelper.js');
var generator = require('./helpers/generators.js');

describe('Auth', function () {

    this.timeout(10000);

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
                    return authHelper.verify(email, authHelper.tokenOverride)
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
                    return authHelper.verify(email, authHelper.tokenOverride)
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
                    return authHelper.verify(email, authHelper.tokenOverride)
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

    describe('Change Password', function () {

        it('Given I have a verified account, When I attempt to change my password, Then my password should be changed', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    var newPassword = generator.password();

                    return authHelper.changePassword(user, user.password, newPassword)
                        .then(function (result) {
                            assert.equal(result.data.changed, true);
                        });
                });
        });
    });

    describe('Lost Password', function () {

        it('Given I have a verified account, When I have lost my password, Then I should be able to request a reset', function () {
           return authHelper.getLoggedInUser()
                .then(function (user) {

                    return authHelper.lostPassword(user.email)
                        .then(function (result) {
                            assert.equal(result.data.sent, true);
                        })

                });
        });
    });

});
