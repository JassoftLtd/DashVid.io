var expect = require( 'chai' ).expect;

var LambdaTester = require( 'lambda-tester' );

var myLambda = require( '../index' );

describe('Create User', function () {

    describe('Signup', function () {

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

                    expect( result.created ).to.be.true;
                })
                .verify( done );
        })
    });

});
