import React, {Component} from 'react';
import Plans from './Plan/Plans.js'

class Home extends Component {

    render() {
        return (
            <div className="Home">
                <p>Home</p>
                <Plans/>
            </div>
        );
    }
}



export default Home;
