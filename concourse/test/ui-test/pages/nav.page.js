class Nav {

    get homeLink() { return '[data-qa="nav-link-home"]' }

    get loginButton() { return '[data-qa="nav-btn-login"]' }
    get logoutButton() { return '[data-qa="nav-btn-logout"]' }
    get videosButton() { return '[data-qa="nav-btn-videos"]' }
    get accountButton() { return '[data-qa="nav-btn-account"]' }

}

module.exports = new Nav();