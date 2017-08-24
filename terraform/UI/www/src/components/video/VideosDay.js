import React, { Component } from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Moment from 'moment';

import {
    ShareButtons,
    generateShareIcon
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');


const style = {
    card: {
    },
    progress: {
        "height": "20px",
        "marginBottom": "20px",
        "overflow": "hidden",
        "backgroundColor": "#f5f5f5",
        "borderRadius": "4px",
        "WebkitBoxShadow": "inset 0 1px 2px rgba(0,0,0,.1)",
        "boxShadow": "inset 0 1px 2px rgba(0,0,0,.1)"
    },
    progressBar: {
        "float": "left",
        "height": "100%",
        "fontSize": "12px",
        "lineHeight": "20px",
        "color": "#fff",
        "textAlign": "center",
        "backgroundColor": "#337ab7",
        "WebkitBoxShadow": "inset 0 -1px 0 rgba(0,0,0,.15)",
        "boxShadow": "inset 0 -1px 0 rgba(0,0,0,.15)",
        "WebkitTransition": "width .6s ease",
        "OTransition": "width .6s ease",
        "transition": "width .6s ease",
    },
    progressBarVideo: {
        "backgroundColor": "#5cb85c",
    }
};

const millisecondsInDay = 86400000

export default class VideosDay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showShareVideoDialog: false,
        }
    }

    shareVideoAction(video) {
        const {shareVideo} = this.props;

        shareVideo(video.Id).then(function (shareResult) {
            video.shareLink = shareResult

            this.setState({
                showShareVideoDialog: true,
                shareLink: shareResult.Link
            });
        }.bind(this));
    }

    handleShareDialogClose = () => {
        this.setState({
            showShareVideoDialog: false
        });
    };

    render() {
        const {date, videos, playVideo} = this.props;

        var dateFormatted = Moment(date).format('DD MMMM YYYY');

        let totalOffset = 0;

        let videosFormatted = videos.reverse().map(function (video, i) {

            var start = video.RecordedDate - date;
            var end = start + video.VideoDuration;

            let requiredOffset = (start / millisecondsInDay) * 100;

            let offset;

            if (totalOffset < requiredOffset) {

                let offsetSize = requiredOffset - totalOffset
                offset = (
                    <div style={{...style.progressBar, ...{width: offsetSize + "%"}}}></div>
                )
                totalOffset = requiredOffset;
            }


            let videoSize = ((end / millisecondsInDay) * 100) - ((start / millisecondsInDay) * 100 )

            totalOffset = totalOffset + videoSize;

            return ([
                offset,
                <div style={{...style.progressBar, ...style.progressBarVideo, ...{"width": videoSize + "%"}}}></div>
            ]);
        });

        let finalOffset = (
            <div style={{...style.progressBar, ...{width: 100 - totalOffset + "%"}}}></div>
        )

        let videoRows = videos.map(function (video, i) {

            var start = Moment(video.RecordedDate).format('HH:mm:ss')
            var end = Moment(video.RecordedDate + video.VideoDuration).format('HH:mm:ss')

            if(video.shareLink) {

            }

            return (
                <TableRow key={video.Id}>
                    <TableRowColumn>{start}</TableRowColumn>
                    <TableRowColumn>{end}</TableRowColumn>
                    <TableRowColumn><RaisedButton label="Play" primary={true} onTouchTap={()=>{playVideo(video.Id)}} /></TableRowColumn>
                    <TableRowColumn><RaisedButton label="Share" secondary={true} onTouchTap={()=>{this.shareVideoAction(video)}} /></TableRowColumn>
                </TableRow>
            );
        }.bind(this));

        const shareDialogActions = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleShareDialogClose}
            />,
        ];

        return (
            <Card style={style.card}>
                <CardTitle title={dateFormatted}
                           actAsExpander={true}
                           showExpandableButton={true} />
                <CardText actAsExpander={true}>
                    <div style={style.progress}>
                        {videosFormatted}
                        {finalOffset}
                    </div>
                </CardText>
                <CardText expandable={true}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Start</TableHeaderColumn>
                                <TableHeaderColumn>End</TableHeaderColumn>
                                <TableHeaderColumn>Play</TableHeaderColumn>
                                <TableHeaderColumn>Share</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {videoRows}
                        </TableBody>
                    </Table>
                </CardText>
                <Dialog
                    title="Share Video"
                    actions={shareDialogActions}
                    modal={false}
                    open={this.state.showShareVideoDialog}
                    onRequestClose={this.handleShareDialogClose} >
                    <p>Copy and Paste this link to share your video</p>
                    <pre>{this.state.shareLink}</pre>
                    <div>
                        <FacebookShareButton url={this.state.shareLink}><FacebookIcon/></FacebookShareButton>
                        <GooglePlusShareButton url={this.state.shareLink}><GooglePlusIcon/></GooglePlusShareButton>
                        <LinkedinShareButton url={this.state.shareLink}><LinkedinIcon/></LinkedinShareButton>
                        <TwitterShareButton url={this.state.shareLink}><TwitterIcon/></TwitterShareButton>
                        <TelegramShareButton url={this.state.shareLink}><TelegramIcon/></TelegramShareButton>
                        <WhatsappShareButton url={this.state.shareLink}><WhatsappIcon/></WhatsappShareButton>
                    </div>
                </Dialog>
            </Card>
        )
    }
}

    VideosDay.propTypes = {
    date: PropTypes.number.isRequired,
    videos: PropTypes.array.isRequired,
    playVideo: PropTypes.func.isRequired,
    shareVideo: PropTypes.func.isRequired
};