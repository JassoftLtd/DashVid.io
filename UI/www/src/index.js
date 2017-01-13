import React from 'react';
import './Video.css';

// Import custom components
import Home from './Home.js'
import Account from './Account/Account.js'
import Login from './Account/Login.js'
import Logout from './Account/Logout.js'
import Nav from './Nav.js'
import Video from './Video.js'

import { render } from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

render(
    <div>
        <Router history={browserHistory}>
            <Route path="/" component={Home} />
            <Route path="/Video" component={Video} />
            <Route path="/Account" component={Account} />
            <Route path="/Signup" component={Account} />
        </Router>
    </div>,
    document.getElementById('root')
);

render(
    <div>
        <Login />
        <Logout />
    </div>,
    document.getElementById('auth')
);

render(
    <Nav />,
    document.getElementById('nav')
);
