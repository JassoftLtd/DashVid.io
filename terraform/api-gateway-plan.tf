// API Gateway

// /plan
resource "aws_api_gateway_resource" "Plan" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "plan"
}

// /plan OPTIONS
module "plan-OptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Plan.path}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /plan GET
module "ApiGatewayLambda-getPlan" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "GET"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.Plan.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.Plan.path}"
  aws_lambda_function_arn = "${aws_lambda_function.getPlan.arn}"
  aws_lambda_function_name = "${aws_lambda_function.getPlan.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${data.aws_caller_identity.current.account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}

// /plan POST
module "ApiGatewayLambda-switchPlan" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.Plan.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.Plan.path}"
  aws_lambda_function_arn = "${aws_lambda_function.switchPlan.arn}"
  aws_lambda_function_name = "${aws_lambda_function.switchPlan.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${data.aws_caller_identity.current.account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}