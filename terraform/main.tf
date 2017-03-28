# Specify the provider and access details
provider "aws" {
    region = "${var.aws_region}",
    access_key = "${var.aws_access_key}",
    secret_key = "${var.aws_secret_key}"
}

data "aws_caller_identity" "current" {}

data "terraform_remote_state" "remote-state" {
    backend = "s3"
    config {
        bucket = "${var.aws_terraform_state_bucket}"
        key = "terraform.tfstate"
        region = "eu-west-1"
    }
}

//output "ui-address" {
//    value = "${aws_cloudfront_distribution.website_s3_distribution.domain_name}"
//}

output "api-address" {
    value = "https://${aws_api_gateway_deployment.DevDeployment.rest_api_id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.DevDeployment.stage_name}"
}