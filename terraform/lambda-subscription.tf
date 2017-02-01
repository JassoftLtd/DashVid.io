// Lambda

// PlanSignup
resource "aws_lambda_function" "addCard" {
  filename = "Lambda/SubscriptionLambdas/addCard.zip"
  function_name = "addCard"
  role = "${aws_iam_role.IamForAddCardLambda.arn}"
  handler = "addCard.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/SubscriptionLambdas/addCard.zip"))}"
  environment {
    variables = {
      stripe_api_key = "${var.stripe_api_key}"
    }
  }
}

resource "aws_lambda_permission" "allow_api_gateway-addCard" {
  function_name = "${aws_lambda_function.addCard.function_name}"
  statement_id = "AllowAddCardExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.AddCard-integration.integration_http_method}${aws_api_gateway_resource.AddCard.path}"
}