// API Gateway

// /stripe
resource "aws_api_gateway_resource" "Stripe" {
  depends_on  = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "stripe"
}

// /stripe/webhook
resource "aws_api_gateway_resource" "Webhook" {
  depends_on  = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Stripe"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.Stripe.id}"
  path_part   = "webhook"
}

// /webhook OPTIONS
module "webhook-OptionsCORS" {
  source        = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Webhook.path}"
  resource_id   = "${aws_api_gateway_resource.Webhook.id}"
  rest_api_id   = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /webhook POST
module "ApiGatewayLambda-webhook" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "POST"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.Webhook.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.Webhook.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.webhook.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.webhook.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}
