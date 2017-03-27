import React, {Component} from 'react';

var authUtils = require('../utils/auth.js');

////////////////
// Logout //
////////////////

// Logout Container

class Logout extends Component {

    handleLogout () {

        authUtils.clearCredentials()

        this.props.loggedInCallback(false)

        window.location.href = '/';
    }

    render () {

        if (authUtils.hasAuth()) {
            return (
                <li className="pure-menu-item"><a className="pure-menu-link" onClick={this.handleLogout.bind(this)}>Logout</a></li>
            );
        } else {
            return null
        }
    }
}

export default Logout