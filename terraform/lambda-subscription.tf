// Lambda

// PlanSignup
resource "aws_lambda_function" "addCard" {
  filename = "Lambda/SubscriptionLambdas/addCard.zip"
  function_name = "addCard"
  role = "${aws_iam_role.IamForAddCardLambda.arn}"
  handler = "addCard.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  memory_size = "256"
  source_code_hash = "${base64sha256(file("Lambda/SubscriptionLambdas/addCard.zip"))}"
  environment {
    variables = {
      stripe_api_key = "${var.stripe_api_key}"
    }
  }
}