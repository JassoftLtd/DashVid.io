new webpack.DefinePlugin({
    'process.env.TF_VAR_aws_identity_pool': JSON.stringify(process.env.TF_VAR_aws_identity_pool)
})