class AddCard {

    get pageContent() { return '[data-qa="add-card-page"]' }

    get nameField() { return '[data-qa="addCard-field-name"]' }
    get cardNumberField() { return '[data-qa="addCard-field-number"]' }
    get expirationField() { return '[data-qa="addCard-field-expiration"]' }
    get cvcField() { return '[data-qa="addCard-field-cvc"]' }

    get addCardButton() { return '[data-qa="addCard-btn-add"]' }

}

module.exports = new AddCard();