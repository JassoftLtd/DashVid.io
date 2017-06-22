import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import {muiTheme} from 'storybook-addon-material-ui';

import Nav from './Nav';

storiesOf('Nav', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('Logged Out', () => <Nav homeRoute="/" loggedIn={false} />)
    .add('Logged In', () => <Nav homeRoute="/" loggedIn={true} />);
