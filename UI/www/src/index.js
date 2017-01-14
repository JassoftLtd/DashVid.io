import React, {Component} from 'react';
import './Video.css';

// Import custom components
import Home from './Home.js'
import Account from './Account/Account.js'
import Login from './Account/Login.js'
import Logout from './Account/Logout.js'
import Signup from './Account/Signup.js'
import Verify from './Account/Verify.js'
import Nav from './Nav.js'
import Video from './Video.js'

import { render } from 'react-dom';
import {Router, Route, IndexRoute, useRouterHistory, browserHistory} from 'react-router';

import createHashHistory from 'history/lib/createHashHistory'

// useRouterHistory creates a composable higher-order function
const appHistory = useRouterHistory(createHashHistory)()

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
                        <Route path="video" component={Video} />
                        <Route path="account" component={Account} />
                        <Route path="signup" component={Signup} />
                        <Route path="verify" component={Verify} />
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

