import React, {Component} from 'react';

import ChangePassword from './ChangePassword.js'

class Account extends Component {

    render() {
        return (
            <div className="Account">
                <ChangePassword/>
            </div>
        );
    }
}

export default Account