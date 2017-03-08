// API Gateway

// /subscription
resource "aws_api_gateway_resource" "Subscription" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "subscription"
}

// /subscription/addCard
resource "aws_api_gateway_resource" "AddCard" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Subscription"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Subscription.id}"
  path_part = "addCard"
}

// /addCard OPTIONS
module "addCard-OptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.AddCard.path}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /addCard POST
module "ApiGatewayLambda-addCard" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.AddCard.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.AddCard.path}"
  aws_lambda_function_arn = "${aws_lambda_function.addCard.arn}"
  aws_lambda_function_name = "${aws_lambda_function.addCard.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
}