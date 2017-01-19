import React, {Component} from 'react';

class Plans extends Component {

    render() {
        return (
            <div className="pricing-tables pure-g">
                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pricing-table pricing-table-free">
                        <div className="pricing-table-header">
                            <h2>Free</h2>

                            <span className="pricing-table-price">
                            £0 <span>per month</span>
                        </span>
                        </div>

                        <ul className="pricing-table-list">
                            <li>7 Days video retention</li>
                        </ul>

                        <button className="button-choose pure-button">Choose</button>
                    </div>
                </div>

                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pricing-table pricing-table-standard">
                        <div className="pricing-table-header">
                            <h2>Standard</h2>

                            <span className="pricing-table-price">
                            £10 <span>per month</span>
                        </span>
                        </div>

                        <ul className="pricing-table-list">
                            <li>30 Days video retention</li>
                        </ul>

                        <button className="button-choose pure-button">Choose</button>
                    </div>
                </div>

                <div className="pure-u-1 pure-u-md-1-3">
                    <div className="pricing-table pricing-table-premium">
                        <div className="pricing-table-header">
                            <h2>Premium</h2>

                            <span className="pricing-table-price">
                            £18 <span>per month</span>
                        </span>
                        </div>

                        <ul className="pricing-table-list">
                            <li>60 Days video retention</li>
                        </ul>

                        <button className="button-choose pure-button">Choose</button>
                    </div>
                </div>
            </div>
        );
    }
}



export default Plans;
