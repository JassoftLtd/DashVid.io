import React, {Component} from 'react';
var authUtils = require('./utils/auth.js');

class Nav extends Component {

    render() {

        //Authed
        var videoLink
        var accountLink

        //unAuthed
        var signupLink

        if (authUtils.hasAuth()) {
            videoLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/video">Videos</a></li>
            accountLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/account">Account</a></li>
        }
        else {
            signupLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/signup">Login / Signup</a></li>
        }

        return (
            <ul className="pure-menu-list">
                {videoLink}
                {accountLink}
                {signupLink}
            </ul>
        );
    }
}

export default Nav;
