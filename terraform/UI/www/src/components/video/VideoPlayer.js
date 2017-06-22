import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'

const style = {
    videoPlayer: {
        marginTop: "1em"
    }
};

export default class VideoPlayer extends Component {

    focus() {
        if(this.refs.videoPlayer) {
            window.scrollTo(this.refs.videoPlayer.offsetTop, 0);
        }
    }

    render() {
        const {videoUrl} = this.props;

        if(videoUrl) {
            return (
                <div ref="videoPlayer" style={style.videoPlayer}>
                    <ReactPlayer url={videoUrl}
                                 onStart={this.focus()}
                                 width="100%"
                                 controls
                                 fileConfig={{ attributes: { autoPlay: true }}}/>
                </div>
            )
        }

        return (<div ref="videoPlayer" />)
    }
}

VideoPlayer.propTypes = {
    videoUrl: PropTypes.string
};