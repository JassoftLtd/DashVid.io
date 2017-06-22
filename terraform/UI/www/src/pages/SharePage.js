import React, {Component} from 'react';

import VideoPlayer from '../components/video/VideoPlayer.js'

const api = require('../utils/api.js');

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

        fetch(api.getApiAddress() + '/v1/share/' + this.state.shareId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            this.setState({
                videoToPlayUrl: (response.body.urls.web) ? response.body.urls.web : response.body.urls.original
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