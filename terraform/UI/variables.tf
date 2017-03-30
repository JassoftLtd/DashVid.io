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

variable "environment_subdomain" {
  description = "A subdomain to prepend to the urls"
  default     = ""
}

variable "cloudfront_default_ttl" {
  description = "The default TTL for the cloudfront distribution"
  default     = "60"
}

# DNS
variable "dns_zone_id" {
  description = "Amazon Route53 DNS zone identifier"
}

variable "dns_zone_name" {
  description = "Amazon Route53 DNS zone name"
}

# Certificate
variable "acm_certificate_arn" {
  description = "The ARN of the certificate to be used by cloudfront"
}