class Verify {

    get confirmationMessage() { return '[data-qa="verify-text-confirmation"]' }
    get pendingMessage() { return '[data-qa="verify-text-pending"]' }
    get failedMessage() { return '[data-qa="verify-text-failed"]' }

}

module.exports = new Verify();