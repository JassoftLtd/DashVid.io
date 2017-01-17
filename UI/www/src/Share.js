import React, {Component} from 'react';

class Share extends Component {

    handleShare (e) {
        console.log("Share video: " + this.props.videoId)
    }

    render() {
        return (
            <button onClick={()=>{this.handleShare()}}>Share Video</button>
        );
    }
}


export default Share;
