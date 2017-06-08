import React, {Component} from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import dashvidApp from './reducers'

import './Video.css';

// Import custom components
import Home from './Home.js'
import Account from './Account/Account.js'
import Verify from './Account/Verify.js'
import Reset from './Account/Reset.js'
import AddCard from './Subscription/AddCard.js'
import Nav from './components/page/Nav.js'

import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import VideoPage from './pages/VideoPage.js'

import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();

var authUtils = require('./utils/auth.js');

let store = createStore(dashvidApp)

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: authUtils.hasAuth()
        };
    }

    onAuthStateChange(loggedIn) {
        this.state = {
            loggedIn: loggedIn
        };
    }

    render() {
        var homeRoute = "/"

        if(this.state.loggedIn) {
            homeRoute = "/video"
        }

        return (
            <Provider store={store}>
                <MuiThemeProvider>
                    <div>
                        <Nav homeRoute={homeRoute} loggedIn={this.state.loggedIn} />

                        <div className="l-content">

                            <Router history={browserHistory}>
                                <Route path="/" >
                                    <IndexRoute component={Home} />
                                    <Route path="video" component={VideoPage} />
                                    <Route path="account" component={Account} />
                                    <Route path="login" component={LoginPage} />
                                    <Route path="signup/:plan" component={SignupPage} />
                                    <Route path="verify" component={Verify} />
                                    <Route path="reset" component={Reset} />
                                </Route>
                                <Route path="subscription" >
                                    <Route path="addCard" component={AddCard} />
                                </Route>
                            </Router>

                        </div>

                        <div className="footer l-box">
                            <p>
                                <a href="/">Terms &amp; Conditions</a> | <a href="/">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </MuiThemeProvider>
            </Provider>
        );
    }

}

export default App;

render(
    <App />,
    document.getElementById('container')
);

