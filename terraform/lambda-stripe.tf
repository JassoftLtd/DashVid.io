// Lambda

// Stripe Webhook
resource "aws_lambda_function" "webhook" {
  depends_on = [
    "aws_iam_role_policy.IamForStripeWebhookLambda",
  ]

  filename         = "PackagedLambdas/StripeLambdas/webhook.zip"
  function_name    = "webhook"
  role             = "${aws_iam_role.IamForStripeWebhookLambda.arn}"
  handler          = "webhook.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/StripeLambdas/webhook.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      stripe_api_key = "${var.stripe_api_key}"
    }
  }
}
