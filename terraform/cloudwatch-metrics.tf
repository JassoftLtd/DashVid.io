resource "aws_cloudwatch_log_metric_filter" "unhandled_stripe_webhook_event" {
  name           = "unhandled_stripe_webhook_event"
  pattern        = "Unhandled event type"
  log_group_name = "${aws_cloudwatch_log_group.lambda-webhook.name}"

  metric_transformation {
    name      = "unhandled_stripe_webhook_event"
    namespace = "DashVid"
    value     = "1"
  }
}
