import React, {Component} from 'react';

import ChangePassword from './ChangePassword.js'

class Account extends Component {

    render() {
        return (
            <div className="Account">
                <h1>Account Functions</h1>
                <h2>Change Password</h2>
                <ChangePassword/>
            </div>
        );
    }
}

export default Account