const assert = require('assert');
const wrapAsyncObject = require('xolvio-sync-webdriverio').wrapAsyncObject

var generator = require('../../helpers/generators.js');
const emailHelper = require('../../helpers/emailHelper.js');

const emailHelperSync = wrapAsyncObject(emailHelper, ['getEmails'])

const Plans = require('../pages/plans.page');
const Signup = require('../pages/signup.page');
const Verify = require('../pages/verify.page');
const Login = require('../pages/login.page');
const Video = require('../pages/video.page');

exports.getLoggedInUser = function () {

    let email = generator.email();
    let password = generator.password();

    // Navigate to Signup page
    browser.url('/')
        .click(Plans.freePlan)

    // Fill in Signup form
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

    expect(browser.getText(Verify.confirmationMessage)).to.equal('User verified.')

    // Fill in  Login form
    browser.url('/login')
        .setValue(Login.emailField, email)
        .setValue(Login.passwordField, password)

    // Login
    browser.click(Login.loginButton)

    browser.waitForVisible(Video.pageContent, 10000);
}