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
  default     = ""
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
  default     = "true"
}