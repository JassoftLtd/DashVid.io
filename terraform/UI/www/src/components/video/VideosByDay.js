import React, { Component } from 'react';
import {Card} from 'material-ui/Card';
import PropTypes from 'prop-types';
import VideosDay from "./VideosDay.js"

export default class VideosByDay extends Component {

    render() {
        const {videosByDate, playVideo, shareVideo} = this.props;

        if(videosByDate && videosByDate.length > 0) {
            let days = videosByDate.map(function (day, i) {
                return (
                    <VideosDay key={day.date} date={day.date} videos={day.videos} playVideo={ playVideo } shareVideo={ shareVideo }/>
                )
            });

            return (
                <Card>
                    {days}
                </Card>
            )
        }

        return null

    }
}

VideosByDay.propTypes = {
    videosByDate: PropTypes.array.isRequired,
    playVideo: PropTypes.func.isRequired,
    shareVideo: PropTypes.func.isRequired
};