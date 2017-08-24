import React, {Component} from 'react';
import Plans from './components/plan/Plans.js'

const ReactGA = require('react-ga');

const style = {
    banner: {
        background: "transparent url('../../../../images/banner.jpg') 0 0 no-repeat local",
        textAlign: "center",
        backgroundSize: "cover",
        filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../../../images/banner.jpg', sizingMethod='scale')",
        height: "200px",
        width: "100%",
        marginBottom: "3em",
        display: "table",
    },

    bannerHead: {
        display: "table-cell",
        verticalAlign: "middle",
        marginBottom: 0,
        fontSize: "2em",
        color: "white",
        fontWeight: 500,
        textShadow: "0 1px 1px black",
    },

    features: {
    },
    feature: {
        padding: "0.5em 2em"
    },
    featureHead: {
        color: "black",
        fontWeight: 500
    }
};

class Home extends Component {

    handlePlanSelect(id) {
        ReactGA.event({
            category: 'Signup',
            action: 'Plan Selected',
            value: id
        });
        this.props.router.push('/signup/' + id);
    }

    render() {
        return (
            <div className="Home">
                <div style={style.banner}>
                    <h1 style={style.bannerHead}>
                        Simple Pricing.<br />
                        Try before you buy.
                    </h1>
                </div>
                <h1>
                    DashVid.io - Cloud storage for your Dashcam footage.
                </h1>
                <Plans planSelected={(id) => this.handlePlanSelect(id)}/>
                <div>
                    <div className="feature-box">
                        <div style={style.feature} >
                            <h3 style={style.featureHead} >Secure Cloud Storage</h3>
                            <p>
                                All of your videos are stored encrypted in the cloud. This gives you the peace of mind that your Dashcam wont overwrite footage you may need in the future
                            </p>
                        </div>
                    </div>

                    <div className="feature-box">
                        <div style={style.feature}>
                            <h3 style={style.featureHead} >Mobile Optimised</h3>
                            <p>
                                All of your footage will be transcoded to a mobile friendly format. This means you can easily view your footage without having to worry about it eating all of your data.
                            </p>
                        </div>
                    </div>

                    <div className="feature-box">
                        <div style={style.feature}>
                            <h3 style={style.featureHead} >Share your clips</h3>
                            <p>
                                Share selected footage publicly. Either by sharing a link or posting it to your favorite social media platform
                            </p>
                        </div>
                    </div>

                    <div className="feature-box">
                        <div style={style.feature}>
                            <h3 style={style.featureHead} >Sign up for Free today</h3>
                            <p>
                                Its Free to signup to our basic plan. However if you choose to opt for one of our paid plans, you can cancel at anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default Home;
