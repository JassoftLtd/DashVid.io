import React, {Component} from 'react';

import VideosByDay from '../components/video/VideosByDay.js'
import VideoPlayer from '../components/video/VideoPlayer.js'

import VideoAdd from '../Video.js'

const authUtils = require('../utils/auth.js');
const promiseRetry = require('promise-retry');

const ReactGA = require('react-ga');

export default class VideoPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            videosRequiresReload: false,
            videoToPlay: null,
            expectedVideos: []
        };
    }

    componentDidMount() {
        this.loadVideos();
    }

    loadVideos() {

        return authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                };

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/video';
                var method = 'GET';
                var additionalParams = {};
                var body = {};

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {

                        this.setState({
                            videos: result.data,
                            mounted: true
                        });


                    }.bind(this))
                    .catch(function (result) {
                        ReactGA.exception({
                            description: 'Failed to Load Videos',
                            fatal: true
                        });
                    });
            }.bind(this));

    }


    onVideosModified(videoId) {

        ReactGA.event({
            category: 'Video',
            action: 'Video Added'
        });

        this.setState({
            expectedVideos: this.state.expectedVideos.concat([videoId])
        })

        promiseRetry(function (retry, number) {
            return this.loadVideos()
                .then(function(result) {
                    for (var i = 0; i < this.state.videos.length; i++) {

                        let day = this.state.videos[i]
                        for (var o = 0; o < day.videos.length; o++) {
                            let video = day.videos[o]
                            var index = this.state.expectedVideos.indexOf(video.Id);

                            if (index > -1) {
                                this.setState({
                                    expectedVideos: this.state.expectedVideos.splice(index, 1)
                                });
                                return
                            }
                        }
                    }

                    if(this.state.expectedVideos && this.state.expectedVideos.length > 0) {
                        retry()
                    }
                }.bind(this))
        }.bind(this));
    }

    onVideosLoaded() {
        this.setState({videosRequiresReload: false})
    }

    onPlayVideo(videoId) {

        ReactGA.event({
            category: 'Video',
            action: 'Video Played'
        });

        this.setState({videoToPlay: videoId})

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                    "videoId": videoId
                };

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/video/{videoId}'
                var method = 'GET';
                var additionalParams = {
                };
                var body = {};

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        //This is where you would put a success callback
                        this.setState({
                            videoToPlayUrl: (result.data.urls.web) ? result.data.urls.web : result.data.urls.original
                        })
                    }.bind(this))
                    .catch(function (result) {
                        ReactGA.exception({
                            description: 'Failed to Play Video',
                            fatal: true
                        });
                    });
            }.bind(this));
    }

    onShareVideo(videoId) {
        ReactGA.event({
            category: 'Video',
            action: 'Video Shared'
        });

        return authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

                var params = {};

                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/share'
                var method = 'POST';
                var additionalParams = {};
                var body = {
                    videoId: videoId
                };

                return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        return result.data
                    });
            });
    }

    render() {
        return (
            <div className="App" data-qa="video-page">
                <VideoPlayer videoUrl={this.state.videoToPlayUrl}/>
                <VideosByDay videosByDate={this.state.videos} playVideo={(videoId) => this.onPlayVideo(videoId)} shareVideo={(videoId) => this.onShareVideo(videoId)} />
                <VideoAdd videoAddedCallback={(videoId) => this.onVideosModified(videoId)}/>
            </div>
        );
    }
}

VideoPage.propTypes = {
}