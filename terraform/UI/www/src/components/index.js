import React from 'react';
import { storiesOf } from '@storybook/react';
import {muiTheme} from 'storybook-addon-material-ui';

import Plan from './plan/Plan';
import Plans from './plan/Plans';
import Login from './account/Login';
import Signup from './account/Signup';
import Nav from './page/Nav';

storiesOf('Plan', module)
    .addDecorator(muiTheme())
    .add('Free plan', () => <Plan key="free" id="free" name="Free" price="0" daysRetention={7} />)
    .add('Standard plan', () => <Plan key="standard" id="standard" name="Standard" price="£10" daysRetention={30} />);

storiesOf('Plans', module)
    .addDecorator(muiTheme())
    .add('List of Plans', () => <Plans />);

storiesOf('Login', module)
    .addDecorator(muiTheme())
    .add('Unauthenticated Login', () => <Login />);

//noinspection JSAnnotator
storiesOf('Signup', module)
    .addDecorator(muiTheme())
    .add('free', () => <Signup />);

storiesOf('Nav', module)
    .addDecorator(muiTheme())
    .add('Logged Out', () => <Nav homeRoute="/" loggedIn={false} />)
    .add('Logged In', () => <Nav homeRoute="/" loggedIn={true} />);
