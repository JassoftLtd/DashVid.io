// API Gateway

// /video
resource "aws_api_gateway_resource" "Video" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "video"
}

// /video OPTIONS
module "Video-OptionsCORS" {
  source = "github.com/carrot/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Video.path}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /video GET
resource "aws_api_gateway_method" "Video-GET" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "GET"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "Video-getVideos-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.getVideos.arn}/invocations"
  integration_http_method = "POST"
}

resource "aws_api_gateway_method_response" "Video-GET-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  status_code = "200"
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = "*" }
}

resource "aws_api_gateway_integration_response" "Video-GET-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-GET.http_method}"
  status_code = "${aws_api_gateway_method_response.Video-GET-200.status_code}"
}

// /video POST
resource "aws_api_gateway_method" "Video-POST" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "POST"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "Video-createVideo-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-POST.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.createVideo.arn}/invocations"
  integration_http_method = "POST"
}

resource "aws_api_gateway_method_response" "Video-POST-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-POST.http_method}"
  status_code = "200"
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = "*" }
}

resource "aws_api_gateway_integration_response" "Video-POST-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Video.id}"
  http_method = "${aws_api_gateway_method.Video-POST.http_method}"
  status_code = "${aws_api_gateway_method_response.Video-POST-200.status_code}"
}

// /video
resource "aws_api_gateway_resource" "VideoDetail" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Video.id}"
  path_part = "{id}"
}

module "VideoDetail-OptionsCORS" {
  source = "github.com/carrot/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.VideoDetail.path}"
  resource_id = "${aws_api_gateway_resource.VideoDetail.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /video GET
resource "aws_api_gateway_method" "VideoDetail-GET" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.VideoDetail.id}"
  http_method = "GET"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "VideoDetail-getVideo-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.VideoDetail.id}"
  http_method = "${aws_api_gateway_method.VideoDetail-GET.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.getVideo.arn}/invocations"
  integration_http_method = "POST"
}

resource "aws_api_gateway_method_response" "VideoDetail-GET-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.VideoDetail.id}"
  http_method = "${aws_api_gateway_method.VideoDetail-GET.http_method}"
  status_code = "200"
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = "*" }
}

resource "aws_api_gateway_integration_response" "VideoDetail-GET-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.VideoDetail.id}"
  http_method = "${aws_api_gateway_method.VideoDetail-GET.http_method}"
  status_code = "${aws_api_gateway_method_response.VideoDetail-GET-200.status_code}"
}