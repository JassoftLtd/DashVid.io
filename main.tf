# Specify the provider and access details
provider "aws" {
    region = "${var.aws_region}",
    access_key = "${var.aws_access_key}",
    secret_key = "${var.aws_secret_key}"
}

module "auth" {
    source  = "github.com/jonnyshaw89/LambdaCognitoTerraform"
    aws_region = "${var.aws_region}"
    aws_account_id = "${var.aws_account_id}"
    aws_cognito_identity_pool_id = "${var.aws_identity_pool}"
}