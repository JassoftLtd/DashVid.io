import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Plan from './Plan';

var plans = require('../../data/plans.json');

const style = {
    display: "inline-block",
    clear: "both"
};

export default class Plans extends Component {

    render() {
        const {currentPlan, planSelected} = this.props;

        let planCards = plans.map(function (planData, i) {
            return (<Plan key={planData.id} id={planData.id} name={planData.name} price={planData.price.GBP} features={planData.features} planSelected={planSelected} currentPlan={planData.id === currentPlan}/>)
        });

        return (
            <div style={style}>
                {planCards}
            </div>
        );
    }
}

Plans.propTypes = {
    planSelected: PropTypes.func.isRequired,
    currentPlan: PropTypes.string,
};