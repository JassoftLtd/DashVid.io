import React, {Component} from 'react';
import { IndexLink, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

const style = {
    bar: {
        "backgroundColor": "white"
    },
    logo: {
        "height": "40px",
        "cursor": "hand"
    }
};

export default class Nav extends Component {

    handleTouchTap() {
        window.location.href = this.props.homeRoute;
    }

    render() {
        let appLinks
        let authLink
        if(this.props.loggedIn) {
            appLinks = (
                <span>
                    <Link to="/video"><RaisedButton label="Videos" /></Link>
                    <Link to="/account"><RaisedButton label="Account" /></Link>
                    {/* Which Plan */}

                </span>
            )
            authLink = (<Link to="/"><RaisedButton label="Logout" /></Link>)
        } else {
            authLink = (<Link to="/login"><RaisedButton label="Login" /></Link>)
        }

        return (
            <AppBar style={style.bar}
                    iconElementLeft={<IndexLink to="/"><img src="/images/DashVid.svg" alt="DashVid.io" style={style.logo} /></IndexLink>}
                onLeftIconButtonTouchTap={this.handleTouchTap}
                iconElementRight={
                    <span>
                        {appLinks}
                        {authLink}
                    </span>
                }
            />
        );
    }
}

Nav.propTypes = {
    homeRoute: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
}