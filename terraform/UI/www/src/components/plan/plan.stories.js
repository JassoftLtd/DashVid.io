import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-router';
import {muiTheme} from 'storybook-addon-material-ui';
import Plan from './Plan';
import Plans from './Plans';

storiesOf('Plan', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('Free plan', () => <Plan key="free" id="free" name="Free" price="0" daysRetention={7} />)
    .add('Standard plan', () => <Plan key="standard" id="standard" name="Standard" price="£10" daysRetention={30} />);

storiesOf('Plans', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('List of Plans', () => <Plans />);