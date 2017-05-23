var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1"
});

var dynamodb = new AWS.DynamoDB();

exports.subscriptionCancelled  = function (user) {

    return getUser(user.email)
        .then(function (data) {
            let userRecord = data.Item;
            let stripeCustomer = userRecord.stripeCustomer.S;

            var config = {
                invokeUrl: process.env.DASHVID_API_ADDRESS
            }

            var apigClient = apigClientFactory.newClient(config);

            var params = {
                //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
            };
            // Template syntax follows url-template https://www.npmjs.com/package/url-template
            var pathTemplate = '/v1/stripe/webhook';
            var method = 'POST';
            var additionalParams = {};
            var body = {
                "created": 1326853478,
                "livemode": false,
                "id": "evt_00000000000000",
                "type": "customer.subscription.deleted",
                "object": "event",
                "request": null,
                "pending_webhooks": 1,
                "api_version": "2017-04-06",
                "data": {
                    "object": {
                        "id": "sub_00000000000000",
                        "object": "subscription",
                        "application_fee_percent": null,
                        "cancel_at_period_end": false,
                        "canceled_at": null,
                        "created": 1495439011,
                        "current_period_end": 1498117411,
                        "current_period_start": 1495439011,
                        "customer": stripeCustomer,
                        "discount": null,
                        "ended_at": 1495462412,
                        "items": {
                            "object": "list",
                            "data": [
                                {
                                    "id": "si_1AMBCRC5nu49EA9JFCBDEMCI",
                                    "object": "subscription_item",
                                    "created": 1495439011,
                                    "plan": {
                                        "id": "standard",
                                        "object": "plan",
                                        "amount": 1000,
                                        "created": 1489606851,
                                        "currency": "gbp",
                                        "interval": "month",
                                        "interval_count": 1,
                                        "livemode": false,
                                        "metadata": {
                                        },
                                        "name": "Standard",
                                        "statement_descriptor": null,
                                        "trial_period_days": null
                                    },
                                    "quantity": 1
                                }
                            ],
                            "has_more": false,
                            "total_count": 1,
                            "url": "/v1/subscription_items?subscription=sub_AhaNmMFzLMqbF4"
                        },
                        "livemode": false,
                        "metadata": {
                        },
                        "plan": {
                            "id": "standard_00000000000000",
                            "object": "plan",
                            "amount": 1000,
                            "created": 1489606851,
                            "currency": "gbp",
                            "interval": "month",
                            "interval_count": 1,
                            "livemode": false,
                            "metadata": {
                            },
                            "name": "Standard",
                            "statement_descriptor": null,
                            "trial_period_days": null
                        },
                        "quantity": 1,
                        "start": 1495439011,
                        "status": "canceled",
                        "tax_percent": null,
                        "trial_end": null,
                        "trial_start": null
                    }
                }
            };

            return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
        });

}


function getUser(email) {
    return dynamodb.getItem({
        TableName: "Users",
        Key: {
            email: {
                S: email
            }
        }
    }).promise();
}