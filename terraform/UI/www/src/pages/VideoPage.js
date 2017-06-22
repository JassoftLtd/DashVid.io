import React, {Component} from 'react';

import VideosByDay from '../components/video/VideosByDay.js'
import VideoPlayer from '../components/video/VideoPlayer.js'

import VideoAdd from '../Video.js'

const authUtils = require('../utils/auth.js');

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

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

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

                        // for (var i = 0; i < result.data.length; i++) {
                        //     let day = result.data[i]
                        //     for (var o = 0; o < day.videos.length; o++) {
                        //         let video = day.videos[o]
                        //         var index = expectedVideos.indexOf(video.Id);
                        //
                        //         if (index > -1) {
                        //             expectedVideos.splice(index, 1);
                        //         }
                        //     }
                        // }
                        //
                        // if(expectedVideos && expectedVideos.length > 0) {
                        //     setTimeout(function() {
                        //         this.loadContent(expectedVideos);
                        //     }, 2000);
                        // }
                    }.bind(this))
                    .catch(function (result) {
                        //This is where you would put an error callback
                    });
            }.bind(this));

    }


    onVideosModified(videoId) {
        this.setState({
            expectedVideos: this.state.expectedVideos.concat([videoId])
        })
        this.loadVideos();
    }

    onVideosLoaded() {
        this.setState({videosRequiresReload: false})
    }

    onPlayVideo(videoId) {
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
                        //This is where you would put an error callback
                    });
            }.bind(this));
    }

    onShareVideo(videoId) {
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
            <div className="App">
                <VideoPlayer videoUrl={this.state.videoToPlayUrl}/>
                <VideosByDay videosByDate={this.state.videos} playVideo={(videoId) => this.onPlayVideo(videoId)} shareVideo={(videoId) => this.onShareVideo(videoId)} />
                <VideoAdd videoAddedCallback={(videoId) => this.onVideosModified(videoId)}/>
            </div>
        );
    }
}

VideoPage.propTypes = {
}