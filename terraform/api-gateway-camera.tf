// API Gateway

// /camera
resource "aws_api_gateway_resource" "Camera" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "camera"
}

// /camera OPTIONS
module "Camera-OptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Camera.path}"
  resource_id = "${aws_api_gateway_resource.Camera.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /camera GET
module "ApiGatewayLambda-getVideos" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "GET"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.Camera.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.Camera.path}"
  aws_lambda_function_arn = "${aws_lambda_function.getCameras.arn}"
  aws_lambda_function_name = "${aws_lambda_function.getCameras.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${data.aws_caller_identity.current.account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}
