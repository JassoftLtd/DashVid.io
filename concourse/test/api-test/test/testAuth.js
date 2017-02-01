var assert = require('assert');

describe('Auth', function() {

  describe('Signup', function() {

    it('Should allow me to signup with a new user', function() {

        fetch('https://0qomu2q3rb.execute-api.eu-west-1.amazonaws.com/Dev/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                plan: this.state.plan,
            })
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log('parsed json', json)

            if(json.created) {
                _this.setState({
                    message: "User " + _this.state.email + " created. Please check your email to validate the user and enable login.",
                    email: "",
                    password: "",
                    verifyPassword: "",
                });
            }
            else {
                _this.setState({
                    message: "Failed to create User " + _this.state.email + "."
                });
            }

        }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

      assert.equal(-1, [1,2,3].indexOf(4));
    });

  });

});
