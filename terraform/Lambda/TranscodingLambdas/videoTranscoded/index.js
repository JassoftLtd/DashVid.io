console.log('video transcoded');

exports.handler = function(event, context) {
    "use strict";

    console.log("Event: " + JSON.stringify(event));

    for(var i = 0; i < event.Records.length; i++) {

        let record = event.Records[i];

        let message = JSON.stringify(record.Sns.Message);

        console.log("Message: " + JSON.parse(message));
    }
};
