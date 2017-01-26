import React, {Component} from 'react';

var authUtils = require('../utils/auth.js');

////////////////
// Logout //
////////////////

// Logout Container

class Logout extends Component {

    handleLogout () {

        authUtils.clearCredentials()

        window.location.href = '/';
    }

    render () {

        if (authUtils.hasAuth()) {
            return (
                <button onClick={this.handleLogout.bind(this)} id="logout-button">Logout</button>
            );
        } else {
            return null
        }
    }
}

export default Logout