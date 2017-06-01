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

variable "bucket_force_destroy" {
  description = "force destruction of S3 buckets even if they have content"
  default     = false
}

# DynamoDB
variable "users_table_read_capacity" {
  description = "The Read Capacity of the Users DynamoDB Table"
  default     = 1
}

variable "users_table_write_capacity" {
  description = "The Write Capacity of the Users DynamoDB Table"
  default     = 1
}

variable "users_table_index_StripeCustomer_read_capacity" {
  description = "The Read Capacity of the Users DynamoDB Table StripeCustomer Index"
  default     = 1
}

variable "users_table_index_StripeCustomer_write_capacity" {
  description = "The Write Capacity of the Users DynamoDB Table StripeCustomer Index"
  default     = 1
}

variable "videos_table_read_capacity" {
  description = "The Read Capacity of the Videos DynamoDB Table"
  default     = 1
}

variable "videos_table_write_capacity" {
  description = "The Write Capacity of the Videos DynamoDB Table"
  default     = 1
}

variable "videos_table_index_UserVideosByDay_read_capacity" {
  description = "The Read Capacity of the Videos DynamoDB Table UserVideosByDay Index"
  default     = 1
}

variable "videos_table_index_UserVideosByDay_write_capacity" {
  description = "The Write Capacity of the Videos DynamoDB Table UserVideosByDay Index"
  default     = 1
}

variable "subscriptions_table_read_capacity" {
  description = "The Read Capacity of the Subscriptions DynamoDB Table"
  default     = 1
}

variable "subscriptions_table_write_capacity" {
  description = "The Write Capacity of the Subscriptions DynamoDB Table"
  default     = 1
}

variable "cameras_table_read_capacity" {
  description = "The Read Capacity of the Cameras DynamoDB Table"
  default     = 1
}

variable "cameras_table_write_capacity" {
  description = "The Write Capacity of the Cameras DynamoDB Table"
  default     = 1
}

variable "cameras_table_index_UserCameras_read_capacity" {
  description = "The Read Capacity of the Cameras DynamoDB Table UserCameras Index"
  default     = 1
}

variable "cameras_table_index_UserCameras_write_capacity" {
  description = "The Write Capacity of the Cameras DynamoDB Table UserCameras Index"
  default     = 1
}

variable "cameras_table_index_CameraKey_read_capacity" {
  description = "The Read Capacity of the Cameras DynamoDB Table CameraKey Index"
  default     = 1
}

variable "cameras_table_index_CameraKey_write_capacity" {
  description = "The Write Capacity of the Cameras DynamoDB Table CameraKey Index"
  default     = 1
}

variable "shares_table_read_capacity" {
  description = "The Read Capacity of the Shares DynamoDB Table"
  default     = 1
}

variable "shares_table_write_capacity" {
  description = "The Write Capacity of the Shares DynamoDB Table"
  default     = 1
}

variable "shares_table_index_UserShared_read_capacity" {
  description = "The Read Capacity of the Shares DynamoDB Table UserShared Index"
  default     = 1
}

variable "shares_table_index_UserShared_write_capacity" {
  description = "The Write Capacity of the Shares DynamoDB Table UserShared Index"
  default     = 1
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
  default     = "app-alerts"
}
