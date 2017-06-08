import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router';
import { Route, Link } from 'react-router';
import {muiTheme} from 'storybook-addon-material-ui';

import Login from './Login';
import Signup from './Signup';

const stories = storiesOf('Button', module);

storiesOf('Login', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('Unauthenticated Login', () => <Login loginCallback={ action('LoggedIn') } />);

const routes = (
    <Route path="/signup/:plan" component={Signup}/>
);

storiesOf('Signup', module)
    .addDecorator(StoryRouter({}, {autoRoute: false, initialEntry: ['/signup/free']}))
    .addDecorator(muiTheme())
    .add('free', () => routes);

storiesOf('Signup', module)
    .addDecorator(StoryRouter({}, {autoRoute: false, initialEntry: ['/signup/standard']}))
    .addDecorator(muiTheme())
    .add('standard', () => routes);