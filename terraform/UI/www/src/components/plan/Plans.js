import React, {Component} from 'react';

import Plan from './Plan';

var plans = require('../../data/plans.json');

const style = {
    display: "inline-block",
    clear: "both"
};

export default class Plans extends Component {

    render() {

        let planCards = plans.map(function (planData, i) {
            return (<Plan key={planData.id} id={planData.id} name={planData.name} price={planData.price.GBP} daysRetention={planData.retentionDays}/>)
        });

        return (
            <div style={style}>
                {planCards}
            </div>
        );
    }
}