# Specify the provider and access details
provider "aws" {
  region     = "${var.aws_region}"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  version    = "1.7"
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

//output "ui-address" {
//    value = "${aws_cloudfront_distribution.website_s3_distribution.domain_name}"
//}

output "api-address" {
  value = "https://${aws_api_gateway_deployment.DevDeployment.rest_api_id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.DevDeployment.stage_name}"
}

output "ui-address" {
  value = "${aws_route53_record.DashCamWeb.fqdn}"
}
