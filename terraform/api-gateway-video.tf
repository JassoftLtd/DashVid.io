// API Gateway

// /video
resource "aws_api_gateway_resource" "Video" {
  depends_on  = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "video"
}

// /video OPTIONS
module "Video-OptionsCORS" {
  source        = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Video.path}"
  resource_id   = "${aws_api_gateway_resource.Video.id}"
  rest_api_id   = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /video GET
module "ApiGatewayLambda-getVideos" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "GET"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.Video.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.Video.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.getVideos.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.getVideos.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}

// /video POST
module "ApiGatewayLambda-createVideo" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "POST"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.Video.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.Video.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.createVideo.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.createVideo.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}

// /video
resource "aws_api_gateway_resource" "VideoDetail" {
  depends_on  = ["aws_api_gateway_resource.Video", "aws_api_gateway_rest_api.DashCamAPI"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id   = "${aws_api_gateway_resource.Video.id}"
  path_part   = "{id}"
}

module "VideoDetail-OptionsCORS" {
  source        = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.VideoDetail.path}"
  resource_id   = "${aws_api_gateway_resource.VideoDetail.id}"
  rest_api_id   = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /video GET
module "ApiGatewayLambda-getVideo" {
  source                               = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method   = "GET"
  aws_api_gateway_rest_api             = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id          = "${aws_api_gateway_resource.VideoDetail.id}"
  aws_api_gateway_resource_path        = "${aws_api_gateway_resource.VideoDetail.path}"
  aws_lambda_function_arn              = "${aws_lambda_function.getVideo.arn}"
  aws_lambda_function_name             = "${aws_lambda_function.getVideo.function_name}"
  aws_region                           = "${var.aws_region}"
  aws_account_id                       = "${data.aws_caller_identity.current.account_id}"
  environment_name                     = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}
