import React from 'react';
import './Nav.css';
import CurrentPlan from './Plan/CurrentPlan.js'
import Logout from './Account/Logout.js'

var Nav = React.createClass({

    getInitialState: function() {
        return {menuToggle: ''}
    },

    onAuthStateChange: function(loggedIn) {
        this.props.loggedInCallback(loggedIn)
    },

    handleChange: function() {
        var self = this;          // Store `this` component outside the callback
        if ('onorientationchange' in window) {
            window.addEventListener("orientationchange", function () {
                this.closeMenu()
                // `this` is now pointing to `window`, not the component. So use `self`.
                self.setState({
                    orientation: !self.state.orientation
                })
                console.log("onorientationchange");
            }, false);
        }
    },

    toggleHorizontal() {
//     [].forEach.call(
//         document.getElementById('menu').querySelectorAll('.custom-can-transform'),
//         function(el){
//             el.classList.toggle('pure-menu-horizontal');
//         }
//     );
    },

    toggleMenu() {
        // set timeout so that the panel has a chance to roll up
        // before the menu switches states
        if (this.state.menuToggle === 'open') {
            this.setState({menuToggle: ''})
            // setTimeout(toggleHorizontal, 500);
        }
        else {
            this.setState({menuToggle: 'open'})
            // toggleHorizontal();
        }
        document.getElementById('toggle').classList.toggle('x');
    },

    closeMenu() {
        if (this.state.menuToggle === 'open') {
            this.toggleMenu();
        }
    },

    render: function() {

        //Authed
        var videoLink
        var accountLink

        //unAuthed
        var signupLink

        if (this.props.loggedIn) {
            videoLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/video">Videos</a></li>
            accountLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/account">Account</a></li>
        }
        else {
            signupLink = <li className="pure-menu-item"><a className="pure-menu-link" href="/signup">Login / Signup</a></li>
        }

        var classes = "custom-wrapper pure-g " + this.state.menuToggle

        return (
            <div className={classes} id="menu">
                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pure-menu">
                        <a href={this.props.homeRoute} className="pure-menu-heading custom-brand"><img src="/images/DashVid.svg" alt="DashVid.io" height="40px" /></a>
                        <a href="#" onClick={this.toggleMenu} className="custom-toggle" id="toggle"><s className="bar"></s><s className="bar"></s></a>
                    </div>
                </div>
                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pure-menu pure-menu-horizontal custom-can-transform">
                        <ul className="pure-menu-list">
                            {videoLink}
                            {accountLink}
                        </ul>
                    </div>
                </div>
                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pure-menu pure-menu-horizontal custom-menu-3 custom-can-transform">
                        <ul className="pure-menu-list">
                            {signupLink}
                            <CurrentPlan loggedIn={this.props.loggedIn}  />
                            <Logout loggedIn={this.props.loggedIn} loggedInCallback={(loggedIn) => this.onAuthStateChange(loggedIn)} />
                        </ul>
                    </div>
                </div>
            </div>
        );

        // return (
        //     <ul className="pure-menu-list">
        //         {videoLink}
        //         {accountLink}
        //         {signupLink}
        //     </ul>
        // );
    }
})

export default Nav;
