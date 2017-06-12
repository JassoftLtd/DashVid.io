const assert = require('assert');
const wrapAsyncObject = require('xolvio-sync-webdriverio').wrapAsyncObject

const Plans = require('../pages/plans.page');
const Signup = require('../pages/signup.page');
const Verify = require('../pages/verify.page');

const generator = require('../../helpers/generators.js');
const emailHelper = require('../../helpers/emailHelper.js');

const emailHelperSync = wrapAsyncObject(emailHelper, ['getEmails'])

const Nav = require('../pages/nav.page')

describe('Auth', function () {

    describe('Signup', function () {

        it('Given I am a new User, When i signup for an account, Then it should be able to login', function () {

            let email = generator.email();
            let password = generator.password();

            // Navigate to Signup page
            browser.url('/')
                .click(Plans.freePlan)

            // Fill in form
            browser.setValue(Signup.emailField, email)
                .setValue(Signup.passwordField, password)
                .setValue(Signup.passwordVerifyField, password)
                .click(Signup.termsAndConditionsCheckbox)

            // Submit form
            browser.click(Signup.signupButton)

            browser.waitForVisible(Signup.formMessage, 5000);

            // Check for confirmation message
            expect(browser.getText(Signup.formMessage)).to.equal('User ' + email + ' created. Please check your email to validate the user and enable login.')

            let emails = emailHelperSync.getEmails(email, "Verification Email for DashVid.io");

            let link = emailHelper.getVerifyLinkFromEmail(emails[0]);

            browser.url(link)

            browser.waitForVisible(Verify.confirmationMessage, 5000);

            expect(browser.getText(Verify.message)).to.equal('User verified.')

            browser.click(Nav.loginButton)

            expect(browser.getUrl()).to.equal('https://test.dashvid.io/login');

        });
    });

});
