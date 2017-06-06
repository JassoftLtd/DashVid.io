import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import {muiTheme} from 'storybook-addon-material-ui';
import VideosDay from './VideosDay';
import VideosByDay from './VideosByDay';
var videos = require('../../data/test-videos.json');


storiesOf('VideosByDay', module)
    .addDecorator(muiTheme())
    .add('Multiple Days', () => <VideosByDay videosByDate={videos} playVideo={ action('Play Video') } />)

storiesOf('VideosDay', module)
    .addDecorator(muiTheme())
    .add('Neighbouring Videos', () => <VideosDay date={videos[0].date} videos={videos[0].videos} playVideo={ action('Play Video') } />)
