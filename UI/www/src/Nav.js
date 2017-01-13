import React, {Component} from 'react';
var authUtils = require('./utils/auth.js');

class Nav extends Component {

    onAuthStateChange(loggedIn) {
        console.log('Account Knows of Auth state change')
        this.setState({loggedIn: loggedIn})
    }

    render() {

        var videoLink
        var accountLink

        if (authUtils.hasAuth()) {
            videoLink = <li><a href="/Video">Videos</a></li>
            accountLink = <li><a href="/Account">Account</a></li>
        }

        return (
            <ul className="Nav">
                <li><a href="/">Home</a></li>
                {videoLink}
                {accountLink}
            </ul>
        );
    }
}

export default Nav;
