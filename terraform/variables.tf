variable "aws_terraform_state_bucket" {
  description = "The S3 bucket that holds state"
  default     = "dashvid-terraform-state"
}

variable "aws_account_id" {
  description = "The AWS account Id."
  default     = ""
}

variable "aws_region" {
  description = "The AWS region to create things in."
  default     = ""
}

variable "aws_access_key" {
  description = "The AWS access key."
  default = ""
}

variable "aws_secret_key" {
  description = "The AWS secret key."
  default     = ""
}

variable "stripe_api_key" {
  description = "API key for Stripe"
  default     = ""
}

variable "aws_identity_pool" {
  description = "The Identity Pool ID."
  default     = "eu-west-1:ac18a09a-6c09-47f2-a297-f3ce8a40f1b4"
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