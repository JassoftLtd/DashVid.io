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
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Moment from 'moment';

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
                    <div style={{...style.progressBar, ...{width: offsetSize + "%"}}} role="offset"></div>
                )
                totalOffset = requiredOffset;
            }


            let videoSize = ((end / millisecondsInDay) * 100) - ((start / millisecondsInDay) * 100 )

            totalOffset = totalOffset + videoSize;

            return ([
                offset,
                <div style={{...style.progressBar, ...style.progressBarVideo, ...{"width": videoSize + "%"}}} role="video"></div>
            ]);
        });

        let finalOffset = (
            <div style={{...style.progressBar, ...{width: 100 - totalOffset + "%"}}} role="offset"></div>
        )

        let videoRows = videos.map(function (video, i) {

            var start = Moment(video.RecordedDate).format('HH:mm:ss')
            var end = Moment(video.RecordedDate + video.VideoDuration).format('HH:mm:ss')

            return (
                <TableRow key={video.Id}>
                    <TableRowColumn>{start}</TableRowColumn>
                    <TableRowColumn>{end}</TableRowColumn>
                    <TableRowColumn><RaisedButton label="Play" primary={true} onTouchTap={()=>{{playVideo(video.Id)}}}/></TableRowColumn>
                    <TableRowColumn><RaisedButton label="Share" secondary={true} /></TableRowColumn>
                </TableRow>
            );
        });

        return (
            <Card style={style.card}>
                <CardTitle title={dateFormatted} />
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
            </Card>
        )
    }
}

    VideosDay.propTypes = {
    date: PropTypes.number.isRequired,
    videos: PropTypes.array.isRequired,
    playVideo: PropTypes.func.isRequired
};