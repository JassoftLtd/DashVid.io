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
  default     = ""
}

variable "auth_email_from_address" {
  description = "The Identity Pool ID."
  default     = ""
}