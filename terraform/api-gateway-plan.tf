// API Gateway

// /subscription
resource "aws_api_gateway_resource" "Plan" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "plan"
}

// /addCard OPTIONS
module "plan-OptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Plan.path}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}


// /addCard POST
resource "aws_api_gateway_method" "Plan-GET" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Plan"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  http_method = "GET"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "Plan-integration" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Plan", "aws_api_gateway_method.Plan-GET", "aws_lambda_function.getPlan"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  http_method = "${aws_api_gateway_method.Plan-GET.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.getPlan.arn}/invocations"
  integration_http_method = "POST"
}

resource "aws_api_gateway_method_response" "Plan-GET-200" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Plan", "aws_api_gateway_method.Plan-GET"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  http_method = "${aws_api_gateway_method.Plan-GET.http_method}"
  status_code = "200"
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = "*" }
}

resource "aws_api_gateway_integration_response" "Plan-GET-Integration-Response" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Plan", "aws_api_gateway_method.Plan-GET", "aws_api_gateway_method_response.Plan-GET-200", "aws_api_gateway_integration.Plan-integration"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.Plan.id}"
  http_method = "${aws_api_gateway_method.Plan-GET.http_method}"
  status_code = "${aws_api_gateway_method_response.Plan-GET-200.status_code}"
}
