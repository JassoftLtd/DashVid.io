var assert = require('assert');

var authHelper = require('./helpers/authHelper.js')
var generator = require('./helpers/generators.js')

var tokenOverride = 'TestToken'

describe('Auth', function () {

    describe('Signup', function () {

        it('Should allow me to signup with a new user', function () {

            var email = generator.email()
            var password = generator.password()

            return authHelper.signup(email, password, "Free")

        })
    });

    describe('Account Verification', function () {

        it('Should allow me to activate a new account', function () {

            var email = generator.email()
            var password = generator.password()

            authHelper.signup(email, password, "Free")
                .then(function (result) {
                    return authHelper.verify(email, tokenOverride)
                });

        })
    });

    describe('Account Login', function () {

        it('Should allow me to login to a new account', function () {

            var email = generator.email()
            var password = generator.password()

            authHelper.signup(email, password, "Free")
                .then(function (result) {
                    authHelper.verify(email, tokenOverride)
                        .then(function (result) {
                            return authHelper.login(email, password)
                        });
                });

        })
    });

});
