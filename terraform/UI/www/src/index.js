import React, {Component} from 'react';

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
import SharePage from './pages/SharePage.js'

import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();

var authUtils = require('./utils/auth.js');


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

        // TODO workout how to reload Nav?
        if(!loggedIn) {
            authUtils.clearCredentials()
            window.location.href = '/';
        }
        else {
            window.location.href = '/video';
        }

    }

    render() {
        return (
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <Route path="/" component={PageWrapper} loggedIn={this.state.loggedIn} logIn={() => {this.onAuthStateChange(true)}} logOut={() => {this.onAuthStateChange(false)}} >
                        <IndexRoute component={Home} />
                        <Route path="video" component={VideoPage} />
                        <Route path="account" component={Account} />
                        <Route path="login" component={LoginPage} loggedIn={() => {this.onAuthStateChange(true)}} />
                        <Route path="signup/:plan" component={SignupPage} />
                        <Route path="verify" component={Verify} />
                        <Route path="reset" component={Reset} />
                        <Route path="share/:shareId" component={SharePage} />
                    </Route>
                    <Route path="subscription" >
                        <Route path="addCard" component={AddCard} />
                    </Route>
                </Router>
            </MuiThemeProvider>
        );
    }

}

export default App;

const style = {
    footer: {
        background: "#111",
        color: "#888",
        textAlign: "center",
        padding: "0.5em 2em"
    },
    footerLink: {
        color: "#ddd",
    }
};

class PageWrapper extends Component {

    render() {
        return (
            <div>
                <Nav loggedIn={this.props.route.loggedIn} logIn={this.props.route.logIn} logOut={this.props.route.logOut} />

                <div>
                    {this.props.children}
                </div>

                <div style={style.footer}>
                    <p>
                        <a style={style.footerLink} href="/">Terms &amp; Conditions</a> | <a href="/">Privacy Policy</a>
                    </p>
                </div>
            </div>
        )
    }
}

render(
    <App />,
    document.getElementById('container')
);

