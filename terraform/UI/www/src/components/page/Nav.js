import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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

    render() {
        let appLinks
        let authLink
        if(this.props.loggedIn) {
            appLinks = (
                <span>
                    <Link to="/video"><RaisedButton data-qa="nav-btn-videos" label="Videos"/></Link>
                    <Link to="/account"><RaisedButton data-qa="nav-btn-account" label="Account" /></Link>
                    {/* Which Plan */}

                </span>
            )
            authLink = (<Link to="/"><RaisedButton data-qa="nav-btn-logout" label="Logout" /></Link>)
        } else {
            authLink = (<Link to="/login"><RaisedButton data-qa="nav-btn-login" label="Login" /></Link>)
        }

        return (
            <AppBar style={style.bar}
                    iconElementLeft={<Link to="/"><img src="/images/DashVid.svg" alt="DashVid.io" data-qa="nav-link-home" style={style.logo} /></Link>}
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
    loggedIn: PropTypes.bool.isRequired,
}