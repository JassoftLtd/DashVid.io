// Lambda

// getPlan
resource "aws_lambda_function" "getPlan" {
  filename         = "Lambda/PlanLambdas/getPlan.zip"
  function_name    = "getPlan"
  role             = "${aws_iam_role.IamForGetPlanLambda.arn}"
  handler          = "getPlan.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/PlanLambdas/getPlan.zip"))}"

  tracing_config {
    mode = "Active"
  }
}

// switchPlan
resource "aws_lambda_function" "switchPlan" {
  filename         = "Lambda/PlanLambdas/switchPlan.zip"
  function_name    = "switchPlan"
  role             = "${aws_iam_role.IamForSwitchPlanLambda.arn}"
  handler          = "switchPlan.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/PlanLambdas/switchPlan.zip"))}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      auth_db_table          = "${aws_dynamodb_table.users-table.name}"
      subscriptions_db_table = "${aws_dynamodb_table.subscriptions-table.name}"
    }
  }
}
