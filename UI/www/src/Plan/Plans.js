import React, {Component} from 'react';

var planData = require('../data/plans.json');

class Plans extends Component {

    constructor(props) {
        super(props);

        this.state = {
            plans: planData
        };
    }

    render() {
        var plans;

        if (this.state.plans) {
            plans = this.state.plans.map(function (plan, i) {

                return (
                    <div key={plan.Name}>
                        <p><strong>{plan.Name}</strong></p>
                        <p>{plan.RetentionDays} Days video retention</p>
                        <p>Cost £{plan.Cost.GBP} per month</p>
                        <a href={"/signup?plan=" + plan.Name}>Sign up</a>
                    </div>
                );
            });
        }

        return (
            <div className="Plans">
                {plans}
            </div>
        );
    }
}



export default Plans;
