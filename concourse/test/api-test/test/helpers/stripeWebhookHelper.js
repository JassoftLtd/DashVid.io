var AWS = require('aws-sdk');
var apigClientFactory = require('aws-api-gateway-client')

exports.subscriptionCancelled  = function (user) {
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
                "customer": "cus_00000000000000",
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
}

exports.invoicePaymentSucceeded  = function (user) {
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
        "id": "evt_1AIOjnC5nu49EA9Jg7M9Vcm6",
        "object": "event",
        "api_version": "2017-04-06",
        "created": 1494537739,
        "data": {
            "object": {
                "id": "in_1AINmpC5nu49EA9JaDJNxbTo",
                "object": "invoice",
                "amount_due": 1000,
                "application_fee": null,
                "attempt_count": 1,
                "attempted": true,
                "charge": "ch_1AIOjmC5nu49EA9JC74YmMKK",
                "closed": true,
                "currency": "gbp",
                "customer": "cus_ASQJQyvZMhFqcg",
                "date": 1494534083,
                "description": null,
                "discount": null,
                "ending_balance": 0,
                "forgiven": false,
                "lines": {
                    "object": "list",
                    "data": [
                        {
                            "id": "sub_ASQJ2dgCUhhOdR",
                            "object": "line_item",
                            "amount": 1000,
                            "currency": "gbp",
                            "description": null,
                            "discountable": true,
                            "livemode": false,
                            "metadata": {},
                            "period": {
                                "start": 1494534009,
                                "end": 1497212409
                            },
                            "plan": {
                                "id": "standard",
                                "object": "plan",
                                "amount": 1000,
                                "created": 1489606851,
                                "currency": "gbp",
                                "interval": "month",
                                "interval_count": 1,
                                "livemode": false,
                                "metadata": {},
                                "name": "Standard",
                                "statement_descriptor": null,
                                "trial_period_days": null
                            },
                            "proration": false,
                            "quantity": 1,
                            "subscription": null,
                            "subscription_item": "si_1A7VTBC5nu49EA9Juzrqo8NM",
                            "type": "subscription"
                        }
                    ],
                    "has_more": false,
                    "total_count": 1,
                    "url": "/v1/invoices/in_1AINmpC5nu49EA9JaDJNxbTo/lines"
                },
                "livemode": false,
                "metadata": {},
                "next_payment_attempt": null,
                "paid": true,
                "period_end": 1494534009,
                "period_start": 1491942009,
                "receipt_number": null,
                "starting_balance": 0,
                "statement_descriptor": null,
                "subscription": "sub_ASQJ2dgCUhhOdR",
                "subtotal": 1000,
                "tax": null,
                "tax_percent": null,
                "total": 1000,
                "webhooks_delivered_at": 1494534087
            }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": null,
        "type": "invoice.payment_succeeded"
    };

    return apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
}