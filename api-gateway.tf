// API Gateway

resource "aws_api_gateway_rest_api" "DashCamAPI" {
    name = "DashCamAPI"
    description = "This is my API for DashCam UI"
}

// /video
resource "aws_api_gateway_resource" "Video" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_rest_api.DashCamAPI.root_resource_id}"
  path_part = "video"
}

// /video GET
resource "aws_api_gateway_method" "Video-GET" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "Video-getVideos-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  type = "AWS"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:${aws_lambda_function.getVideos.function_name}/invocations"
  integration_http_method = "${aws_api_gateway_method.Video-GET.http_method}"
}

resource "aws_api_gateway_method_response" "Video-GET-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "Video-OPTIONS-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  status_code = "${aws_api_gateway_method_response.Video-GET-200.status_code}"
}

// /video OPTIONS
resource "aws_api_gateway_method" "Video-OPTIONS" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "Video-OPTIONS-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-OPTIONS.http_method}"
  status_code = "200"
}

resource "aws_api_gateway_integration" "Video-OPTIONS-Integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-OPTIONS.http_method}"
  type = "MOCK"
}

resource "aws_api_gateway_integration_response" "Video-OPTIONS-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-OPTIONS.http_method}"
  status_code = "${aws_api_gateway_method_response.Video-OPTIONS-200.status_code}"
//  response_parameters = {
//    "method.response.header.Access-Control-Allow-Headers" = ""
//    "method.response.header.Access-Control-Allow-Methods" = "method.response.header.Access-Control-Allow-Methods",
//    "method.response.header.Access-Control-Allow-Origin" = "method.response.header.Access-Control-Allow-Origin"
//  }
}



resource "aws_api_gateway_deployment" "DevDeployment" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  stage_name = "Dev"
}