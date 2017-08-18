let config = {
    name: "Dashvid.io Test UI",

    webdriverio: {
        baseUrl: process.env.DASHVID_UI_ADDRESS ? process.env.DASHVID_UI_ADDRESS : "http://localhost:3000"
    }
}

let sauceLabsConfig = {
    user: process.env.SAUCE_USER,
    key: process.env.SAUCE_KEY,
    port: 80,
    host: "ondemand.saucelabs.com",

    webdriverio: {
        baseUrl: process.env.DASHVID_UI_ADDRESS
    }
}

if(process.env.SAUCE_USER) {
    console.log("Testing with Sauce Labs")
    config = Object.assign(config, sauceLabsConfig);
}

module.exports = config;