import React, {Component} from 'react';
import './Video.css';
import 'whatwg-fetch'
import VideoPlayer from './VideoPlayer.js'
import VideosByDay from './components/video/VideosByDay.js'

const Dropzone = require('react-dropzone');
const AWS = require('aws-sdk');
const apigClientFactory = require('aws-api-gateway-client')
const S3Upload = require('./s3upload.js')

AWS.config.region = 'eu-west-1'; // Region

const authUtils = require('./utils/auth.js');
const api = require('./utils/api.js');

class Video extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videosRequiresReload: false,
            videoToPlay: null,
            expectedVideos: []
        };
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
                <VideoList requiresReload={this.state.videosRequiresReload}  expectedVideos={this.state.expectedVideos} reloadedCallback={() => this.onVideosLoaded()} playVideoCallback={(videoId) => this.onPlayVideo(videoId)}/>
                <VideoAdd videoAddedCallback={(videoId) => this.onVideosModified(videoId)}/>
            </div>
        );
    }
}


////////////////
// Video List //
////////////////

// Video List Container

var VideoList = React.createClass({

    getInitialState: function () {
        return {data: [], mounted: false};
    },

    loadContent: function (expectedVideos) {

        const _this = this;

        authUtils.runWithCredentials(function () {

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
                    _this.props.reloadedCallback();

                    _this.setState({
                        data: result.data,
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
                            _this.loadContent(expectedVideos);
                        }, 2000);
                    }
                }).catch(function (result) {
                //This is where you would put an error callback
            });
        });

    },

    componentDidMount: function () {
        this.loadContent(this.props.expectedVideos);
    },

    componentDidUpdate: function () {
        if(this.props.requiresReload) {
            this.loadContent(this.props.expectedVideos);
        }
    },

    render: function () {
        if (this.state.data) {
            <VideosByDay videosByDate={this.state.data} playVideo={ this.props.playVideoCallback }/>
        }
        return null
    }
});

////////////////
// Video Add //
////////////////

// Video Add Container

var VideoAdd = React.createClass({

    getInitialState: function () {

        const _this = this;

        authUtils.runWithCredentials(function () {

            var config = {
                invokeUrl: api.getApiAddress(),
                accessKey: AWS.config.credentials.accessKeyId,
                secretKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken,
                region: AWS.config.region
            }
            var apigClient = apigClientFactory.newClient(config);

            console.log('Loading Cameras')

            var params = {
                //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
            };
            // Template syntax follows url-template https://www.npmjs.com/package/url-template
            var pathTemplate = '/v1/camera'
            var method = 'GET';
            var additionalParams = {};

            return apigClient.invokeApi(params, pathTemplate, method, additionalParams)
                .then(function (result) {
                    console.log('Loaded Cameras: [' + result.data + ']')

                    _this.setState({
                        cameras: result.data,
                        CameraKey: result.data[0].CameraKey
                    });
                });
        });

        return {
            uploadStatus: []
        };
    },

    getStatusIndex(file) {
        for(var i = 0; i < this.state.uploadStatus.length; i++)
        {
            if(this.state.uploadStatus[i].file === file)
            {
                return i;
            }
        }
    },

    onDrop: function (acceptedFiles, rejectedFiles) {
        console.log('Accepted files: ', acceptedFiles);
        console.log('Rejected files: ', rejectedFiles);

        const _this = this;

        authUtils.runWithCredentials(function () {

            var config = {
                invokeUrl: api.getApiAddress(),
                accessKey: AWS.config.credentials.accessKeyId,
                secretKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken,
                region: AWS.config.region
            }
            var apigClient = apigClientFactory.newClient(config);

            acceptedFiles.forEach((file) => {

                var uploadStatus = _this.state.uploadStatus;
                uploadStatus.push({
                    file: file,
                    status: "",
                    percent: 0
                });

                _this.setState({
                    uploadStatus: uploadStatus
                });

                console.log('Posting video: ' + file.name)

                var params = {
                    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                };
                // Template syntax follows url-template https://www.npmjs.com/package/url-template
                var pathTemplate = '/v1/video'
                var method = 'POST';
                var additionalParams = {};
                var body = {
                    fileName: file.name,
                    fileType: file.type,
                    cameraKey: _this.state.CameraKey
                };

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        console.log('Uploading video to URL: [' + result.data.url + ']')

                        var videoId = result.data.Id;

                        new S3Upload(file, result.data.url,
                            function(percent, status, file) {
                                var index = _this.getStatusIndex(file);

                                var uploadStatus = _this.state.uploadStatus;

                                uploadStatus[index] = {
                                    file: file,
                                    status: status,
                                    percent: percent
                                };

                                _this.setState({
                                    uploadStatus: uploadStatus
                                });

                            },
                            function(signResult, file) {
                                console.log('Successfully uploaded video.');
                                _this.props.videoAddedCallback(videoId)
                            });

                    }).catch(function (result) {
                    //This is where you would put an error callback
                });

            });
        });
    },

    handleSelectCamera (e) {
        this.setState({CameraKey: e.target.value});
    },

    render: function () {
        var uploading;
        if(this.state && this.state.uploadStatus && this.state.uploadStatus.length > 0) {
            var files = this.state.uploadStatus.map(function (status, i) {

                return (
                    <li key={status.file.name}>{status.file.name} - {status.status} - {status.percent}%</li>
                );
            });

            uploading = (
                <div>
                    <p>Files uploading</p>
                    <ul>
                        {files}
                    </ul>
                </div>
            )
        }

        let cameras

        if(this.state.cameras) {
            cameras = this.state.cameras.map(function (camera, i) {
                return <option value={camera.CameraKey}>{camera.Name}</option>
            });
        }

        return (
            <div className="pure-g">
                <div className="pure-u-22-24">
                    <select name="CameraKey" onChange={this.handleSelectCamera}>
                        {cameras}
                    </select>
                </div>
                <div className="pure-u-1-24"/>
                <div className="pure-u-22-24">
                    <Dropzone onDrop={this.onDrop} className="video-dropzone">
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                    {uploading}
                </div>
                <div className="pure-u-1-24"/>
            </div>
        );
    }
});


export default Video;
