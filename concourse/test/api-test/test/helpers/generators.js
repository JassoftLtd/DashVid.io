var randomstring = require("randomstring");

exports.email = function() {

    prefix = randomstring.generate({
        length: 12,
        charset: 'alphabetic',
        capitalization: 'lowercase'
    });

    return prefix + '@dashvid.io'
}

exports.password = function() {
    return randomstring.generate();
}