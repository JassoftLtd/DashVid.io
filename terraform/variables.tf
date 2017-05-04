variable "aws_terraform_state_bucket" {
  description = "The S3 bucket that holds state"
  default     = "dashvid-terraform-state"
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

variable "stripe_api_key" {
  description = "API key for Stripe"
}

variable "aws_identity_pool" {
  description = "The Identity Pool ID."
}

variable "application_name" {
  description = "The Application name."
  default     = "DashVid.io"
}

variable "domain_name" {
  description = "The Domain name."
  default     = "dashvid.io"
}

variable "auth_developer_provider_name" {
  description = "The Developer Provider name."
  default     = "login.terraform.dashcam"
}

variable "auth_email_from_address" {
  description = "The Identity Pool ID."
  default     = "no-reply@dashvid.io"
}

variable "environment_name" {
  description = "A name to prepend to the environment"
  default     = ""
}

variable "environment_subdomain" {
  description = "A subdomain to prepend to the urls"
  default     = ""
}

variable "email_disabled" {
  description = "Should emails from the system be disabled"
  default     = "false"
}

variable "token_override" {
  description = "If supplied, the token to use for all user verifications"
  default     = ""
}

variable "bucket_force_destroy" {
  description = "force destruction of S3 buckets even if they have content"
  default     = false
}

# Certificate
variable "acm_certificate_arn" {
  description = "The ARN of the certificate to be used by cloudfront"
}

variable "api_certificate_arn" {
  description = "The ARN of the certificate to be used by api gateway"
}

# DNS
variable "dns_zone_id" {
  description = "Amazon Route53 DNS zone identifier"
}

variable "dns_zone_name" {
  description = "Amazon Route53 DNS zone name"
}

# Slack
variable "slack_webhook_url" {
  description = "Slack Webhook path for the alert. Obtained via, https://api.slack.com/incoming-webhooks"
}

variable "slack_channel" {
  description = "Slack Channel to post alerts to"
  default = "application-alerts"
}