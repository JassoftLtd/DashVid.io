import React, { Component } from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    card: {
        margin: 12,
        float: 'left',
    }
};

export default class Plan extends Component {

    render() {
        const {id, name, price, daysRetention} = this.props;
        return (
            <Card style={style.card}>
                <CardTitle title={name} subtitle={price}/>
                <CardText>
                    <ul>
                        <li>{daysRetention} Days Retention of original video</li>
                    </ul>
                </CardText>
                <CardActions>
                    <RaisedButton label="Signup" href={"/signup?plan=" + id}/>
                </CardActions>
            </Card>
        )
    }
}

Plan.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  price: React.PropTypes.string.isRequired,
  daysRetention: React.PropTypes.number.isRequired,
};