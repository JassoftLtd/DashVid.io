resource "aws_cloudwatch_log_group" "lambda-webhook" {
  name = "/aws/lambda/${aws_lambda_function.webhook.function_name}"
}
