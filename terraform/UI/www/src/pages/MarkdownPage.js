import React, {Component} from 'react';

const ReactMarkdown = require('react-markdown');

const style = {
    content: {
        "margin": 12
    }
};

export default class MarkdownPage extends Component {

    constructor(props, content) {
        super(props);

        this.state = {
            content: content
        };
    }

    render() {
        return (
            <div style={style.content}>
                <ReactMarkdown source={this.state.content} />
            </div>
        );
    }
}