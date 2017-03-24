import React, {Component} from 'react';
var Dropzone = require('react-dropzone');
import './Video.css';
import 'whatwg-fetch'
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')
var S3Upload = require('./s3upload.js')
var moment = require("moment");

import VideoPlayer from './VideoPlayer.js'
// import Share from './Share.js'

AWS.config.region = 'eu-west-1'; // Region

var authUtils = require('./utils/auth.js');
var api = require('./utils/api.js');

class Video extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videosRequiresReload: true,
            videoToPlay: null
        };
    }

    onVideosModified() {
        this.setState({videosRequiresReload: true})
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
                <VideoList requiresReload={this.state.videosRequiresReload} reloadedCallback={() => this.onVideosLoaded()} playVideoCallback={(videoId) => this.onPlayVideo(videoId)}/>
                <VideoAdd videoAddedCallback={() => this.onVideosModified()}/>
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
        return {videos: [], mounted: false};
    },

    loadContent: function () {

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
                    //This is where you would put a success callback
                    _this.setState({
                        data: result.data,
                        mounted: true
                    })
                }).catch(function (result) {
                //This is where you would put an error callback
            });
        });

    },

    componentDidMount: function () {
        this.loadContent();
    },

    componentDidUpdate: function () {
        if(this.props.requiresReload) {
            this.loadContent();
            this.props.reloadedCallback()
        }
    },

    render: function () {

        const _this = this;

        var videos;

        if (this.state.data) {
            days = this.state.data.map(function (dayData, i) {

                videos = dayData.videos.map(function (video, i) {

                    var uploaded = moment(video.Uploaded).toISOString()
                    var recorded = moment(video.RecordedDate).toISOString()

                    return (
                        <tr key={video.Id}>
                            <td>{video.Id}</td>
                            <td>{uploaded}</td>
                            <td>{video.User}</td>
                            <td>{video.VideoStatus}</td>
                            <td>{recorded}</td>
                            <td>{video.VideoDuration /1000}s</td>
                            <td><button onClick={()=>{_this.props.playVideoCallback(video.Id)}}>Play</button></td>
                            {/*<td><Share videoId={video.Id}/></td>*/}
                        </tr>
                    );
                });

                return (
                    <span>
                        <tr key={dayData.date}>
                            <td colSpan="7">{dayData.date}</td>
                        </tr>
                        {videos}
                    </span>
                );
            });

            return (
                <div ref="videocategory" className="VideoList">
                    <div className="Video">
                        <table className="table">
                            <thead>
                            <tr>
                                <td>Id</td>
                                <td>Uploaded</td>
                                <td>By</td>
                                <td>Status</td>
                                <td>Redorded Date</td>
                                <td>Duration</td>
                                <td>Play</td>
                                {/*<td>Share</td>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {days}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
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
        return {uploadStatus: []};
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
                    fileType: file.type
                };

                apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                    .then(function (result) {
                        console.log('Uploading video to URL: [' + result.data.url + ']')

                        this.myUploader = new S3Upload(file, result.data.url,
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
                                _this.props.videoAddedCallback()
                            });

                    }).catch(function (result) {
                    //This is where you would put an error callback
                });

            });
        });
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

        return (
            <div>
                <Dropzone onDrop={this.onDrop}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
                {uploading}
            </div>
        );
    }
});


export default Video;
