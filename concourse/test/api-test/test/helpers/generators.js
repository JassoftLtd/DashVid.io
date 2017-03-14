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

exports.filename = function() {
    return randomstring.generate({
        length: 12,
        charset: 'alphabetic'
    });
}

exports.cardToken = function() {
    return randomstring.generate();
}