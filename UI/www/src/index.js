import React, {Component} from 'react';
import './Video.css';

// Import custom components
import Account from './Account.js'
import Video from './Video.js'

import { render } from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

class App extends Component {

    constructor(props) {
        super(props);

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        this.state = {
            loggedIn: identityPoolParams != null,
        };
    }

}

export default App;

render(
    <div>
        <Router history={browserHistory} handler={App}>
            <Route path="/" component={Video}/>
            <Route path="/Account" component={Account}/>
        </Router>
    </div>,
    document.getElementById('root')
);
