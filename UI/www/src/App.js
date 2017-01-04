import React, { Component } from 'react';
var Dropzone = require('react-dropzone');
import './App.css';
import 'whatwg-fetch'
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

AWS.config.region = 'eu-west-1'; // Region

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to DashVid.io</h2>
        </div>
        <p className="App-intro">
          The handy place to store your dashcam footage.
        </p>
        <Login />
        <Logout />
        <VideoAdd />
        <VideoList />
      </div>
    );
  }
}

////////////////
// Login //
////////////////

// Login Container

var Login = React.createClass({


    getInitialState: function() {
        return {email:"", password:""};
    },

    handleLogin: function() {

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(function(response) {
            return response.json()
        }).then(function(json) {
            console.log('parsed json', json)

            var params = {
                IdentityPoolId: 'eu-west-1:ac18a09a-6c09-47f2-a297-f3ce8a40f1b4',
                IdentityId: json.identityId,
                Logins: {
                    'cognito-identity.amazonaws.com': json.token
                }
            }
            localStorage.setItem("IdentityPoolParams", JSON.stringify(params));

            AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })

    },

    handleChangeEmail : function(e){
        this.setState({email : e.target.value});
    },

    handleChangePassword : function(e){
        this.setState({password : e.target.value});
    },

    render: function() {

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if (!identityPoolParams) {
            return (
                <table>
                    <tr>
                        <td>Email</td>
                        <td><input value={this.state.email} onChange={this.handleChangeEmail} type="email" id="email" size="20"/></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input value={this.state.password} onChange={this.handleChangePassword} type="password" id="password" size="20"/></td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button onClick={this.handleLogin} type="submit" id="login-button">Login</button>
                        </td>
                    </tr>
                </table>
            );
        } else {
            return ( <p>Logged In</p> )
        }
    }
});

////////////////
// Logout //
////////////////

// Logout Container

var Logout = React.createClass({

    handleLogout: function() {

        localStorage.removeItem("IdentityPoolParams");

    },

    render: function() {

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if (identityPoolParams) {
            return (
                <button onClick={this.handleLogout} id="logout-button">Logout</button>
            );
        } else {
            return null
        }
    }
});

////////////////
// Video List //
////////////////

// Video List Container

var VideoList = React.createClass({

    getInitialState: function() {
        return {videos: [], mounted: false};
    },

    loadContent: function() {

        const _this = this;

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if (identityPoolParams) {
            // initialize the Credentials object with our parameters
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolParams);

            // We can set the get method of the Credentials object to retrieve
            // the unique identifier for the end user (identityId) once the provider
            // has refreshed itself
            AWS.config.credentials.get(function (err) {
                if (err) {
                    localStorage.removeItem("IdentityPoolParams");
                    return;
                }
                console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);

                var config = {
                    invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev'
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
                            videos: result.data.videos,
                            mounted: true
                        })
                    }).catch(function (result) {
                    //This is where you would put an error callback
                });
            });
        }
    },

    componentDidMount: function() {
        if(this.props.url !== ''){
            this.loadContent();
        }
    },

    render: function() {

        var videos;

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if(this.state.videos && identityPoolParams) {
            videos = this.state.videos.map(function(video, i) {

                return (
                    <tr key={video.Id}>
                         <td>{video.Id}</td>
                         <td>{video.Uploaded}</td>
                         <td>{video.User}</td>
                     </tr>
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
                            </tr>
                            </thead>
                            <tbody>
                            {videos}
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

    onDrop: function (acceptedFiles, rejectedFiles) {
        console.log('Accepted files: ', acceptedFiles);
        console.log('Rejected files: ', rejectedFiles);

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if (identityPoolParams) {
            // initialize the Credentials object with our parameters
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolParams);

            // We can set the get method of the Credentials object to retrieve
            // the unique identifier for the end user (identityId) once the provider
            // has refreshed itself
            AWS.config.credentials.get(function (err) {
                if (err) {
                    localStorage.removeItem("IdentityPoolParams");
                    return;
                }
                console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);


                var config = {
                    invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev'
                }
                var apigClient = apigClientFactory.newClient(config);

                acceptedFiles.forEach((file) => {

                    console.log('Posting video: ' + file.name)

                    var params = {
                        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
                    };
                    // Template syntax follows url-template https://www.npmjs.com/package/url-template
                    var pathTemplate = '/v1/video'
                    var method = 'POST';
                    var additionalParams = {};
                    var body = {};

                    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                        .then(function (result) {
                            //This is where you would put a success callback
                            console.log(result)

                            var videosBucketName = 'dash-cam-videos';

                            var s3 = new AWS.S3({
                                apiVersion: '2006-03-01',
                                params: {Bucket: videosBucketName}
                            });

                            var fileName = result.data.videoId;

                            var videoKey = fileName;

                            console.log('Uploading video to bucket: [' + videosBucketName + '] Key [' + videoKey + ']')

                            s3.upload({
                                Key: videoKey,
                                Body: file,
                                ACL: 'private'
                            }, function (err, data) {
                                if (err) {
                                    return alert('There was an error uploading your video: ' + err.message);
                                }
                                alert('Successfully uploaded video.');
                            });

                        }).catch(function (result) {
                        //This is where you would put an error callback
                    });

                });
            });
        }
    },

    render: function () {
        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        if (identityPoolParams) {
            return (
                <div>
                    <Dropzone onDrop={this.onDrop}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                </div>
            );
        } else {
            return null
        }
    }
});

export default App;
