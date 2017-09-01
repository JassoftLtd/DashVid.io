resource "aws_lambda_function" "slack_alert" {
  depends_on = [
    "aws_iam_role_policy.iam_for_slack_alert",
  ]

  filename         = "PackagedLambdas/SlackLambdas/slack-alert.zip"
  function_name    = "${var.environment_name}slack-alert"
  role             = "${aws_iam_role.iam_for_slack_alert.arn}"
  handler          = "slack-alert.handler"
  runtime          = "nodejs6.10"
  timeout          = "10"
  source_code_hash = "${base64sha256(file("PackagedLambdas/SlackLambdas/slack-alert.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      slack_webhook_url = "${var.slack_webhook_url}"
      slack_channel     = "${var.environment_name}${var.slack_channel}"
    }
  }
}

resource "aws_lambda_permission" "slack_alert_from_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.slack_alert.arn}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.slack_alert.arn}"
}
