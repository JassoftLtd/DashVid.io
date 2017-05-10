var expect = require( 'chai' ).expect;

var AWS = require('aws-sdk-mock');

var LambdaTester = require( 'lambda-tester' );

var myLambda = require( '../index' );

describe('Create User', function () {

    process.env['auth_db_table'] = 'Users';
    process.env['auth_email_from_address'] = 'from@email-address.com';

    before(function() {
        AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
            callback(null, 'success');
        });

        AWS.mock('SES', 'sendEmail', function(params, callback) {
            callback(null, 'success');
        });
    });

    after(function() {
        // runs after all tests in this block
    });


    it('Given I am a new User, When i signup for an account, Then it should be created', function (done) {

        LambdaTester( myLambda.handler )
            .event({
                body: JSON.stringify({
                    email: "test@email.com",
                    password: "testPassword",
                    plan: "free"
                })
            })
            .expectSucceed( function( result ) {
                expect( JSON.parse(result.body).created ).to.be.true;
            })
            .verify( done );
    })

});
