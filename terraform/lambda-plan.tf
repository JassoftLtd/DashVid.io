// Lambda

// getPlan
resource "aws_lambda_function" "getPlan" {
  filename = "Lambda/PlanLambdas/getPlan.zip"
  function_name = "getPlan"
  role = "${aws_iam_role.IamForGetPlanLambda.arn}"
  handler = "getPlan.handler"
  runtime = "nodejs6.10"
  timeout = "30"
  memory_size = "256"
  source_code_hash = "${base64sha256(file("Lambda/PlanLambdas/getPlan.zip"))}"
}