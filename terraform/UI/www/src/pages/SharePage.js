import React, {Component} from 'react';

import VideoPlayer from '../components/video/VideoPlayer.js'

const api = require('../utils/api.js');

const ReactGA = require('react-ga');

export default class SharePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            shareId: this.props.params.shareId
        };
    }

    componentDidMount() {
        this.playVideo();
    }


    playVideo() {

        ReactGA.event({
            category: 'Shared Video',
            action: 'Play'
        });

        fetch(api.getApiAddress() + '/v1/share/' + this.state.shareId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            this.setState({
                videoToPlayUrl: (json.urls.web) ? json.urls.web : json.urls.original
            })
        }.bind(this));
    }

    render() {
        return (
            <div className="App">
                <VideoPlayer videoUrl={this.state.videoToPlayUrl}/>
            </div>
        );
    }
}

SharePage.propTypes = {
}