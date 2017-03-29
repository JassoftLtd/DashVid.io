variable "aws_terraform_state_bucket" {
    description = "The S3 bucket that holds state"
    default     = "dashvid-terraform-state"
}

variable "environment_name" {
    description = "A name to prepend to the environment"
    default     = ""
}

variable "aws_region" {
    description = "The AWS region to create things in."
}

variable "aws_access_key" {
    description = "The AWS access key."
}

variable "aws_secret_key" {
    description = "The AWS secret key."
}

variable "route53_type" {
    description = "The type of Route53 record"
    default     = "A"
}

variable "environment_subdomain" {
    description = "A subdomain to prepend to the urls"
    default     = ""
}

# DNS
variable "dns_zone_id" {
    description = "Amazon Route53 DNS zone identifier"
}

variable "dns_zone_name" {
    description = "Amazon Route53 DNS zone name"
}

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

// UI
resource "aws_s3_bucket" "dashvid-io-bucket" {
    bucket = "${var.environment_name}dashvid.io"
    acl = "public-read"
    policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.environment_name}dashvid.io/*",
      "Principal": "*"
    }
  ]
}
EOF
    website {
        index_document = "index.html"

    }
}

output "ui-address" {
    value = "${aws_route53_record.DashCamWeb.fqdn}"
}