AWS.config.region = '${aws_region}';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '${identity_pool_id}'
});
var lambda = new AWS.Lambda();