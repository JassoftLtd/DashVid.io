class Signup {

    get emailField() { return '[data-qa="signup-field-email"]' }
    get passwordField() { return '[data-qa="signup-field-password"]' }
    get passwordVerifyField() { return '[data-qa="signup-field-password-verify"]' }

    get termsAndConditionsCheckbox() { return '[data-qa="signup-check-terms"]' }

    get signupButton() { return '[data-qa="signup-btn-signup"]' }

    get formMessage() { return '[data-qa="signup-form-message"] span:nth-of-type(2)' }

}

module.exports = new Signup();