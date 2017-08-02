class Login {

    get emailField() { return '[data-qa="login-field-email"]' }
    get passwordField() { return '[data-qa="login-field-password"]' }

    get loginButton() { return '[data-qa="login-btn-login"]' }

    get formMessage() { return '[data-qa="login-form-message"] span:nth-of-type(2)' }

}

module.exports = new Login();