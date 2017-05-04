resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx_errors" {
  alarm_name = "${var.environment_name}api-gateway-5xx-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "5XXError"
  namespace = "AWS/ApiGateway"
  period = "60"
  statistic = "Sum"
  threshold = "1"
  treat_missing_data = "notBreaching"
  alarm_description = "There have been at least 1 5xx Error(s) in the past 60 seconds"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    ApiName = "${aws_api_gateway_rest_api.DashCamAPI.name}"
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name = "${var.environment_name}lambda-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "Errors"
  namespace = "AWS/Lambda"
  period = "60"
  statistic = "Sum"
  threshold = "1"
  treat_missing_data = "notBreaching"
  alarm_description = "There have been at least 1 Lambda Error(s) in the past 60 seconds"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
}