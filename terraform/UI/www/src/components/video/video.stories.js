import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import {muiTheme} from 'storybook-addon-material-ui';
import VideosDay from './VideosDay';
import VideosByDay from './VideosByDay';
import VideoPlayer from './VideoPlayer';
var videos = require('../../data/test-videos.json');



var shareVideoSuccess = function (videoid) {
    console.log("videoId", videoid)
    return "Some String"
}

storiesOf('VideosByDay', module)
    .addDecorator(muiTheme())
    .add('Multiple Days', () => <VideosByDay videosByDate={videos} playVideo={ action('Play Video') } shareVideo={(videoId) => shareVideoSuccess(videoId)} />)

storiesOf('VideosDay', module)
    .addDecorator(muiTheme())
    .add('Neighbouring Videos', () => <VideosDay date={videos[0].date} videos={videos[0].videos} playVideo={ action('Play Video') } shareVideo={(videoId) => shareVideoSuccess(videoId)} />)

storiesOf('VideoPlayer', module)
    .addDecorator(muiTheme())
    .add('Playing Video (Web)', () => <VideoPlayer videoUrl="https://s3-eu-west-1.amazonaws.com/dashed-sample-videos/0361a703-ab1a-43af-a0ab-516221881401.mp4" />)
    .add('Playing Video (Original)', () => <VideoPlayer videoUrl="https://s3-eu-west-1.amazonaws.com/dashed-sample-videos/01230848_0015.MP4" />)
    .add('No Video', () => <VideoPlayer />)
