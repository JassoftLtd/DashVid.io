// Lambda

// getPlan
resource "aws_lambda_function" "getPlan" {
  filename = "Lambda/PlanLambdas/getPlan.zip"
  function_name = "getPlan"
  role = "${aws_iam_role.IamForGetPlanLambda.arn}"
  handler = "getPlan.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/PlanLambdas/getPlan.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-getPlan" {
  function_name = "${aws_lambda_function.getPlan.function_name}"
  statement_id = "AllowGetPlanExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_method.Plan-GET.http_method}${aws_api_gateway_resource.Plan.path}"
}