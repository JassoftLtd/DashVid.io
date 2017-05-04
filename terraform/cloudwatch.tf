resource "aws_cloudwatch_metric_alarm" "5xx_errors" {
  alarm_name = "${var.environment_name}api-gateway-5xx-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "5XXError"
  namespace = "AWS/ApiGateway"
  period = "60"
  statistic = "Sum"
  threshold = "1"
  alarm_description = "There have been at least 1 5xx errors in the past 60 seconds"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    ApiName = "${aws_api_gateway_rest_api.DashCamAPI.name}"
  }
}