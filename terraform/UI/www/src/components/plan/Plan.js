import React, { Component } from 'react';
import { Link } from 'react-router';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

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
                    <Link to={"/signup/" + id}><RaisedButton data-qa={"plans-btn-" + id} label="Signup" /></Link>
                </CardActions>
            </Card>
        )
    }
}

Plan.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  daysRetention: PropTypes.number.isRequired,
};