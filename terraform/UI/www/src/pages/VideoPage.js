import React, {Component} from 'react';

import VideosByDay from '../components/video/VideosByDay.js'

import VideoPlayer from './VideoPlayer.js'

const api = require('../utils/api.js');

export default class VideoPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: null,
            videosRequiresReload: false,
            videoToPlay: null,
            expectedVideos: []
        };

        this.loadVideos();
    }

    loadVideos() {
        var config = {
            invokeUrl: api.getApiAddress(),
            accessKey: AWS.config.credentials.accessKeyId,
            secretKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken,
            region: AWS.config.region
        }
        var apigClient = apigClientFactory.newClient(config);

        var params = {
            //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        };

        // Template syntax follows url-template https://www.npmjs.com/package/url-template
        var pathTemplate = '/v1/video'
        var method = 'GET';
        var additionalParams = {};
        var body = {};

        apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
            .then(function (result) {
                // _this.props.reloadedCallback();

                this.setState({
                    videos: result.data,
                    mounted: true
                });

                for (var i = 0; i < result.data.length; i++) {
                    let day = result.data[i]
                    for (var o = 0; o < day.videos.length; o++) {
                        let video = day.videos[o]
                        var index = expectedVideos.indexOf(video.Id);

                        if (index > -1) {
                            expectedVideos.splice(index, 1);
                        }
                    }
                }

                if(expectedVideos && expectedVideos.length > 0) {
                    setTimeout(function() {
                        this.loadContent(expectedVideos);
                    }, 2000);
                }
            }.bind(this)).catch(function (result) {
            //This is where you would put an error callback
        });
    }

    onVideosModified(videoId) {
        this.setState({
            videosRequiresReload: true,
            expectedVideos: this.state.expectedVideos.concat([videoId])
        })
    }

    onVideosLoaded() {
        this.setState({videosRequiresReload: false})
    }

    onPlayVideo(videoId) {
        this.setState({videoToPlay: videoId})
    }

    render() {
        return (
            <div className="App">
                <VideoPlayer videoId={this.state.videoToPlay}/>
                <VideosByDay videosByDate={this.state.videos} playVideo={ this.props.onPlayVideo.bind(this) }/>
                {/*<VideoAdd videoAddedCallback={(videoId) => this.onVideosModified(videoId)}/>*/}
            </div>
        );
    }
}

VideoPage.propTypes = {
}