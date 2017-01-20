// SNS

// User Verified
resource "aws_sns_topic" "user_verified" {
    name = "user-verified-topic"
    display_name = "User Verified"
}

resource "aws_sns_topic_subscription" "user_verified_lambda_target" {
    topic_arn = "${aws_sns_topic.user_verified.arn}"
    protocol  = "lambda"
    endpoint  = "${aws_lambda_function.planSignup.arn}"
}