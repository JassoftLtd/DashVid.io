var assert = require('assert');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var sleep = require('sleep');

var authHelper = require('./helpers/authHelper.js');
var planHelper = require('./helpers/planHelper.js');
var generator = require('./helpers/generators.js');

describe('Plan', function () {

    this.timeout(60000);

    describe('Get Plan', function () {

        it('Given I have a verified account on free plan, When I request my plan, Then I should be given name of my current Plan', function () {
           return authHelper.getLoggedInUser("free")
                .then(function (user) {

                    return planHelper.getPlan(user)
                        .then(function (result) {
                            assert(result.data.plan);
                            assert.equal(result.data.plan, "free");
                            assert.equal(result.data.status, "Active");
                        });

                });
        });

        it('Given I have a verified account on standard plan, When I request my plan, Then I should be given name of my current Plan', function () {
           return authHelper.getLoggedInUser("standard")
                .then(function (user) {

                    return planHelper.getPlan(user)
                        .then(function (result) {
                            assert(result.data.plan);
                            assert.equal(result.data.plan, "standard");
                            assert.equal(result.data.status, "Pending");
                        });

                });
        });
    });

});
