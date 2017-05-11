resource "aws_cloudwatch_log_metric_filter" "unhandled_stripe_webhook_event" {
  name           = "unhandled_stripe_webhook_event"
  pattern        = "Unhandled event type"
  log_group_name = "/aws/lambda/${aws_lambda_function.webhook.function_name}"

  metric_transformation {
    name      = "unhandled_stripe_webhook_event"
    namespace = "DashVid"
    value     = "1"
  }
}