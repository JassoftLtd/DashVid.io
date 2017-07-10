import React, { Component } from 'react';
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

    handlePlanSelect (id) {
        this.props.planSelected(id)
    }

    render() {
        const {id, name, price, features, currentPlan} = this.props;

        let action = (
            <RaisedButton data-qa={"plans-btn-" + id} label="Select Plan" onClick={() => this.handlePlanSelect(id)}  />
        );

        if (currentPlan) {
            action = (
                <span>Current Plan</span>
            )
        }

        let priceDisplay = price > 0 ? "£" + price + " Per Month" : 'Free'

        let featuresDisplay = features.map(function (feature, i) {
            return (<li key={i}>{feature}</li>)
        })

        return (
            <Card style={style.card}>
                <CardTitle title={name} subtitle={priceDisplay}/>
                <CardText>
                    <ul>
                        {featuresDisplay}
                    </ul>
                </CardText>
                <CardActions>
                    {action}
                </CardActions>
            </Card>
        )
    }
}

Plan.propTypes = {
  planSelected: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  currentPlan: PropTypes.bool.isRequired,
};