// SNS

// User Verified
resource "aws_sns_topic" "user_verified" {
    name = "user-verified-topic"
    display_name = "User Verified"
}