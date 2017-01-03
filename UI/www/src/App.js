import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'whatwg-fetch'
var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Login />
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

            AWS.config.region = 'eu-west-1'; // Region

            var params = {
                IdentityPoolId: 'eu-west-1:ac18a09a-6c09-47f2-a297-f3ce8a40f1b4',
                IdentityId: json.identityId,
                Logins: {
                    'cognito-identity.amazonaws.com': json.token
                }
            }

            AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

            AWS.config.update({
                credentials: params
            });

            var cognitoidentityParams = {
                IdentityId: json.identityId, /* required */
                Logins: {
                    'cognito-identity.amazonaws.com': json.token
                }
            };

            var cognitoidentity = new AWS.CognitoIdentity({apiVersion: '2014-06-30'});
            cognitoidentity.getCredentialsForIdentity(cognitoidentityParams, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                }
                else {
                    console.log(data);           // successful response
                    localStorage.setItem("AWSCredentials", data.Credentials);
                }
            });


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

        var credentials = localStorage.getItem("AWSCredentials")

        if (!credentials) {
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
                        <td colspan="2">
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
// Video List //
////////////////

// Video List Container

var VideoList = React.createClass({

    getInitialState: function() {
        return {videos: [], mounted: false};
    },

    loadContent: function() {

        var credentials = localStorage.getItem("AWSCredentials")

        if (credentials) {
            var config = {
                invokeUrl: 'https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev',
                accessKey: credentials.AccessKeyId,
                secretKey: credentials.AccessKeyId,
                sessionToken: credentials.SessionToken,
                region: 'eu-west-1'
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

            const _this = this;

            apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
                .then(function(result){
                    //This is where you would put a success callback
                    _this.setState({
                        videos : result.data.videos,
                        mounted: true
                    })
                }).catch( function(result){
                //This is where you would put an error callback
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

        if(this.state.videos) {
            videos = this.state.videos.map(function(video, i) {

                return (
                    <tr key={video.Id}>
                         <td>{video.Id}</td>
                         <td>{video.Uploaded}</td>
                         <td>{video.User}</td>
                     </tr>
                 );
            });

        }

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
});

export default App;
