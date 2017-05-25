// Lambda

// addCard
resource "aws_lambda_function" "addCard" {
  filename         = "Lambda/SubscriptionLambdas/addCard.zip"
  function_name    = "addCard"
  role             = "${aws_iam_role.IamForAddCardLambda.arn}"
  handler          = "addCard.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/SubscriptionLambdas/addCard.zip"))}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      stripe_api_key = "${var.stripe_api_key}"
      auth_db_table  = "${aws_dynamodb_table.users-table.name}"
    }
  }
}
