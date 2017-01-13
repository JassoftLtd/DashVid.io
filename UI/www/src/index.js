import React, {Component} from 'react';
import './Video.css';

// Import custom components
import Home from './Home.js'
import Account from './Account/Account.js'
import Login from './Account/Login.js'
import Logout from './Account/Logout.js'
import Signup from './Account/Signup.js'
import Nav from './Nav.js'
import Video from './Video.js'

import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

var authUtils = require('./utils/auth.js');

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: authUtils.hasAuth()
        };
    }

    onAuthStateChange(loggedIn) {
        console.log('Account Knows of Auth state change')
        this.setState({loggedIn: loggedIn})
    }

    render() {
        return (
            <div>
                <Login loggedIn={this.state.loggedIn} authCallback={(loggedIn) => this.onAuthStateChange(loggedIn)} />
                <Logout loggedIn={this.state.loggedIn} authCallback={(loggedIn) => this.onAuthStateChange(loggedIn)} />
                <Nav loggedIn={this.state.loggedIn} />
                <Router history={browserHistory}>
                    <Route path="/" >
                        <IndexRoute component={Home} />
                        <Route path="Video" component={Video} />
                        <Route path="Account" component={Account} />
                        <Route path="Signup" component={Signup} />
                    </Route>
                </Router>
            </div>
        );
    }

}

export default App;

render(
    <App />,
    document.getElementById('root')
);

