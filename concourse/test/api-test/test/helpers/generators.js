var randomstring = require("randomstring");

var email = function() {

    prefix = randomstring.generate({
        length: 12,
        charset: 'alphabetic',
        capitalization: 'lowercase'
    });

    return prefix + '@dashvid.io'
}

var password = function() {
    return randomstring.generate();
}

export {email, password};