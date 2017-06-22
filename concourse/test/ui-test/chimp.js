module.exports = {
    user: process.env.SAUCE_USER,
    key: process.env.SAUCE_KEY,
    port: 80,
    host: "ondemand.saucelabs.com",
    name: "Dashvid.io Test UI",

    webdriverio: {
        baseUrl: process.env.DASHVID_UI_ADDRESS
    }
}