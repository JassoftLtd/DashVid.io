console.log('transcode video');

exports.handler = function(event, context) {
    "use strict";

	console.log("request: " + JSON.stringify(event));

    context.succeed();
};
