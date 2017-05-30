// API Gateway

// /share
resource "aws_api_gateway_resource" "Share" {
  depends_on  = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "share"
}

// /video
resource "aws_api_gateway_resource" "ShareVideo" {
  depends_on  = ["aws_api_gateway_resource.Share", "aws_api_gateway_rest_api.DashCamAPI"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.Share.id}"
  path_part   = "{shareId}"
}

// /share OPTIONS
module "share-OptionsCORS" {
  source        = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Share.path}"
  resource_id   = "${aws_api_gateway_resource.Share.id}"
  rest_api_id   = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /share POST
module "ApiGatewayLambda-shareVideo" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "POST"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.Share.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.Share.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.shareVideo.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.shareVideo.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}

// /share GET
module "ApiGatewayLambda-getSharedVideo" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "GET"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.ShareVideo.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.ShareVideo.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.getSharedVideo.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.getSharedVideo.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}
