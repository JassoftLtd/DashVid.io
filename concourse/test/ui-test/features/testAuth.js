var assert = require('assert');

describe('Auth', function () {

    describe('Signup', function () {

        it('Given I am a new User, When i signup for an account, Then it should be created', function () {

            browser.url('/');
            expect(browser.getTitle()).to.equal('Dashvid.io');

        });
    });

});
