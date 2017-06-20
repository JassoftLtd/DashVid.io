import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'

export default class VideoPlayer extends Component {

    render() {
        const {videoUrl} = this.props;

        if(videoUrl) {
            return (
                <div className="pure-u-1-1">
                    <ReactPlayer url={videoUrl}
                                 width="100%"
                                 controls
                                 fileConfig={{ attributes: { autoPlay: true }}}/>
                </div>
            )
        }

        return null
    }
}

VideoPlayer.propTypes = {
    videoUrl: PropTypes.string
};