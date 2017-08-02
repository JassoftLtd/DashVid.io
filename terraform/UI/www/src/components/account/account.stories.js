import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router';
import { Route, Link } from 'react-router';
import {muiTheme} from 'storybook-addon-material-ui';

import Login from './Login';
import Signup from './Signup';
import ChangePassword from './ChangePassword';
import AddCard from './AddCard';

const stories = storiesOf('Button', module);

storiesOf('Login', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('Clean Login', () => <Login login={ action('Login') } lostPassword={ action('lostPassword') } />)
    .add('Errored Login', () => <Login login={ action('Login') } lostPassword={ action('lostPassword') } message={"Login Failed"} />);

storiesOf('Signup', module)
    .addDecorator(muiTheme())
    .add('free', () => <Signup signup={ action('Signup') } plan={'free'} />)
    .add('standard', () => <Signup signup={ action('Signup') } plan={'standard'} />);

storiesOf('Change Password', module)
    .addDecorator(muiTheme())
    .add('form', () => <ChangePassword changePassword={ action('Change Password') } />)

storiesOf('Add Card', module)
    .addDecorator(muiTheme())
    .add('form', () => <AddCard addCard={ action('Add Card') } />)
    .add('Message', () => <AddCard addCard={ action('Add Card') } message="Adding of card Failed" />)
