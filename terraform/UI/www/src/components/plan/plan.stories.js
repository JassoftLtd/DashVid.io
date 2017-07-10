import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router';
import {muiTheme} from 'storybook-addon-material-ui';
import Plan from './Plan';
import Plans from './Plans';

let features = [
    "Feature 1",
    "Feature 2",
    "Feature 3"
]

storiesOf('Plan', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('Free plan', () => <Plan key="free" id="free" name="Free" price="0" features={features} planSelected={action('planSelected')} currentPlan={false} />)
    .add('Standard plan', () => <Plan key="standard" id="standard" name="Standard" price="£10" features={features} planSelected={action('planSelected')} daysRetention={30} currentPlan={false} />)
    .add('Current plan', () => <Plan key="free" id="free" name="Free" price="0" features={features} planSelected={action('planSelected')} currentPlan={true} />);

storiesOf('Plans', module)
    .addDecorator(muiTheme())
    .addDecorator(StoryRouter())
    .add('List of Plans', () => <Plans planSelected={action('planSelected')} />)
    .add('Active Plan', () => <Plans currentPlan={'free'} planSelected={action('planSelected')} />);