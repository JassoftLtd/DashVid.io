class Video {

    get pageContent() { return '[data-qa="account-page"]' }

    get currentPlan() { return '[data-qa="account-current-plan"]' }

}

module.exports = new Video();