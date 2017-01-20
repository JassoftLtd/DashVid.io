# Specify the provider and access details
provider "aws" {
    region = "${var.aws_region}",
    access_key = "${var.aws_access_key}",
    secret_key = "${var.aws_secret_key}"
}

data "terraform_remote_state" "remote-state" {
    backend = "s3"
    config {
        bucket = "dashvid-terraform-state"
        key = "terraform.tfstate"
        region = "eu-west-1"
    }
}

//variable "aws_region" {}
//variable "aws_access_key" {}
//variable "aws_secret_key" {}
//variable "aws_account_id" {}
//variable "aws_identity_pool" {}
//variable "auth_email_from_address" {}

module "auth" {
//    source  = "github.com/jonnyshaw89/LambdaCognitoTerraform"
    source  = "../LambdaCognitoTerraform"
    aws_region = "${var.aws_region}"
    aws_account_id = "${var.aws_account_id}"
    aws_cognito_identity_pool_id = "${var.aws_identity_pool}"
    aws_api_gateway_rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
    aws_api_gateway_resource_parent = "${aws_api_gateway_resource.v1.id}"
    aws_api_gateway_resource_parent_path = "${aws_api_gateway_resource.v1.path}"
    user_verified_sns_arn = "${aws_sns_topic.user_verified.arn}"
}

output "UI Url" {
    value = "${aws_s3_bucket.dashvid-io-bucket.website_endpoint}"
}