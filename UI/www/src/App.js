import React, {Component} from 'react';
import ReactPlayer from 'react-player'
var Dropzone = require('react-dropzone');
import './App.css';
import 'whatwg-fetch'
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

AWS.config.region = 'eu-west-1'; // Region

function runWithCredentials (callback) {
    var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

    // initialize the Credentials object with our parameters
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolParams);

    if (AWS.config.credentials.needsRefresh()) {
        AWS.config.credentials.refresh(function (err) {
            if (!err) {
                console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
                callback();
            }
            else {
                localStorage.removeItem("IdentityPoolParams");
            }
        })
    }
    else {

        // We can set the get method of the Credentials object to retrieve
        // the unique identifier for the end user (identityId) once the provider
        // has refreshed itself
        AWS.config.credentials.get(function (err) {
            if (!err) {
                console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
                callback();
            }
            else {
                localStorage.removeItem("IdentityPoolParams");
            }
        });
    }

}

class App extends Component {

    constructor(props) {
        super(props);

        var identityPoolParams = JSON.parse(localStorage.getItem("IdentityPoolParams"));

        this.state = {
            loggedIn: identityPoolParams != null,
            videosRequiresReload: true,
            videoToPlay: null
        };
    }

    onAuthStateChange(loggedIn) {
        console.log('App Knows of Auth state change')
        this.setState({loggedIn: loggedIn})
    }

    onVideosModified() {
        console.log('App Knows of videos modified')
        this.setState({videosRequiresReload: true})
    }

    onVideosLoaded() {
        console.log('App Knows of videos modified')
        this.setState({videosRequiresReload: false})
    }

    onPlayVideo(videoId) {
        console.log('App Knows of play video request for video', videoId)
        this.setState({videoToPlay: videoId})
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Welcome to DashVid.io</h2>
                </div>
                <p className="App-intro">
                    The handy place to store your dashcam footage.
                </p>
                <Login loggedIn={this.state.loggedIn} loginCallback={(loggedIn) => this.onAuthStateChange(loggedIn)}/>
                <Logout loggedIn={this.state.loggedIn} logoutCallback={(loggedIn) => this.onAuthStateChange(loggedIn) }/>
                <VideoPlayer videoId={this.state.videoToPlay}/>
                <VideoAdd loggedIn={this.state.loggedIn} videoAddedCallback={() => this.onVideosModified()}/>
                <VideoList loggedIn={this.state.loggedIn} requiresReload={this.state.videosRequiresReload} reloadedCallback={() => this.onVideosLoaded()} playVideoCallback={(videoId) => this.onPlayVideo(videoId)}/>
            </div>
        );
    }
}

////////////////
// Login //
////////////////

// Login Container

var Login = React.createClass({


    getInitialState: function () {
        return {email: "", password: ""};
    },

    handleLogin: function () {

        const _this = this;

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
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

            _this.props.loginCallback(true)

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

    },

    handleChangeEmail: function (e) {
        this.setState({email: e.target.value});
    },

    handleChangePassword: function (e) {
        this.setState({password: e.target.value});
    },

    render: function () {

        if (!this.props.loggedIn) {
            return (
                <form action="#" onSubmit={this.handleLogin}>
                    <table>
                        <tr>
                            <td>Email</td>
                            <td><input value={this.state.email} onChange={this.handleChangeEmail} type="email"
                                       id="email"
                                       size="20"/></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input value={this.state.password} onChange={this.handleChangePassword} type="password"
                                       id="password" size="20"/></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit" id="login-button">Login</button>
                            </td>
                        </tr>
                    </table>
                </form>
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

    handleLogout: function () {

        localStorage.removeItem("IdentityPoolParams");
        this.props.logoutCallback(false)

    },

    render: function () {

        if (this.props.loggedIn) {
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

    getInitialState: function () {
        return {videos: [], mounted: false};
    },

    loadContent: function () {

        const _this = this;

        if (this.props.loggedIn) {

            runWithCredentials(function () {

                var config = {
                    invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev',
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
                            videos: result.data.videos,
                            mounted: true
                        })
                    }).catch(function (result) {
                    //This is where you would put an error callback
                });
            });
        }

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

        if (this.state.videos && this.props.loggedIn) {
            videos = this.state.videos.map(function (video, i) {

                return (
                    <tr key={video.Id}>
                        <td>{video.Id}</td>
                        <td>{video.Uploaded}</td>
                        <td>{video.User}</td>
                        <td>{video.VideoStatus}</td>
                        <td>{video.RecordedDate}</td>
                        <td>{video.VideoDuration /1000}s</td>
                        <td><button onClick={()=>{_this.props.playVideoCallback(video.Id)}}>Play</button></td>
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
                                <td>Status</td>
                                <td>Redorded Date</td>
                                <td>Duration</td>
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

        this.setState({
            files: acceptedFiles
        });

        const _this = this;

        if (this.props.loggedIn) {

            runWithCredentials(function () {

                var config = {
                    invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev',
                    accessKey: AWS.config.credentials.accessKeyId,
                    secretKey: AWS.config.credentials.secretAccessKey,
                    sessionToken: AWS.config.credentials.sessionToken,
                    region: AWS.config.region
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

                            console.log('Uploading video to URL: [' + result.data.url + ']')

                            fetch(result.data.url, {
                                method: 'PUT',
                                body: file,
                                headers: {
                                    'Content-Type': 'text/plain;charset=UTF-8'
                                }
                            }).then(function (result) {
                                console.log('Successfully uploaded video.');
                                var index = _this.state.files.indexOf(file.name);
                                _this.state.files.splice(index, 1);
                                _this.props.videoAddedCallback()
                            }).catch(function (err) {
                                console.error('There was an error uploading your video: ' + err.message);
                            })

                        }).catch(function (result) {
                        //This is where you would put an error callback
                    });

                });
            });
        }
    },

    render: function () {
        if (this.props.loggedIn) {
            var uploading;
            if(this.state && this.state.files) {
                var files = this.state.files.map(function (file, i) {

                    return (
                        <li key={file.name}>{file.name}</li>
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
        } else {
            return null
        }
    }
});


////////////////
// Video Player //
////////////////

// Video Player Container

var VideoPlayer = React.createClass({

    getInitialState: function () {
        return {
            video: {},
            url: ""
        };
    },

    loadContent: function (videoId) {

        const _this = this;

            runWithCredentials(function () {

            var config = {
                invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev',
                accessKey: AWS.config.credentials.accessKeyId,
                secretKey: AWS.config.credentials.secretAccessKey,
                sessionToken: AWS.config.credentials.sessionToken,
                region: AWS.config.region
            }
            var apigClient = apigClientFactory.newClient(config);

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
                    console.log(JSON.stringify(result))
                    //This is where you would put a success callback
                    _this.setState({
                        video: result.data.video,
                        url: result.data.url
                    })
                }).catch(function (result) {
                //This is where you would put an error callback
            });
        });

    },

    componentDidUpdate: function () {
        if (this.props.videoId !== null && this.props.videoId !== this.state.video.Id) {
            this.loadContent(this.props.videoId);
        }
    },

    render: function () {
        return <ReactPlayer url={this.state.url} playing controls />
    }
});

export default App;
