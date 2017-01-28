# Specify the provider and access details
provider "aws" {
    region = "${var.aws_region}",
    access_key = "${var.aws_access_key}",
    secret_key = "${var.aws_secret_key}"
}

data "terraform_remote_state" "remote-state" {
    backend = "s3"
    config {
        bucket = "${var.aws_terraform_state_bucket}"
        key = "terraform.tfstate"
        region = "eu-west-1"
    }
}

output "UI Url" {
    value = "${aws_s3_bucket.dashvid-io-bucket.website_endpoint}"
}