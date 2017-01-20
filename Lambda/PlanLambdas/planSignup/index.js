'use strict';
console.log('create video for User');

var https = require("https");

var AWS = require('aws-sdk');
// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {
	var responseCode = 200;

    console.log("event: " + JSON.stringify(event))

    const goCardlessApi = process.env.go_cardless_api;
    const apiKey = process.env.go_cardless_access_token;

    for(var i = 0; i < event.Records.length; i++) {
        var record = event.Records[i];

        var payload = JSON.parse(record.Sns.Message);

        getUserPlan(event, payload.email, function (plan) {

            if(plan !== 'free')
            {

                var options = {
                    hostname: goCardlessApi,
                    path: '/redirect_flows',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'GoCardless-Version': '2015-07-06',
                        'Authorization': 'Bearer ' + apiKey
                    }
                };
                var req = https.request(options, function(res) {
                    console.log('Status: ' + res.statusCode);
                    console.log('Headers: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (body) {
                        console.log('Body: ' + body);

                        var redirect_url = body.redirect_flows.redirect_url

                        if (i == event.Records.length - 1) {
                            context.succeed();
                        }
                    });
                });
                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });

                // write data to request body
                req.write(JSON.stringify({
                        "redirect_flows": {
                        "description": "DashVid.io Subscription",
                        "session_token": payload.email,
                        "success_redirect_url": "https://example.com/pay/confirm"
                    }
                }));
                req.end();

            }
            else {
                if (i == event.Records.length - 1) {
                    context.succeed();
                }
            }
        })
    }

};

function getUserPlan(event, email, fn) {
    dynamodb.getItem({
        TableName: "Users",
        Key: {
            email: {
                S: email
            }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else {
            if ('Item' in data) {
                var plan = data.Item.plan.S;
                console.log("User plan is " + plan)
                fn(plan);
            } else {
                fn(null); // User not found
            }
        }
    });
}