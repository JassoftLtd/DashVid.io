import React from 'react';
import './Video.css';
import 'whatwg-fetch'

const Dropzone = require('react-dropzone');
const S3Upload = require('./s3upload.js')

const authUtils = require('./utils/auth.js');

////////////////
// Video Add //
////////////////

// Video Add Container

var VideoAdd = React.createClass({

    getInitialState: function () {

        const _this = this;

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

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

        authUtils.getAuthApiGatewayClient()
            .then(function (apigClient) {

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
                return <option key={camera.Id} value={camera.CameraKey}>{camera.Name}</option>
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


export default VideoAdd;
