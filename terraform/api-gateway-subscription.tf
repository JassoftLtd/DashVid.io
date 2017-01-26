// API Gateway

// /subscription
resource "aws_api_gateway_resource" "Subscription" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "subscription"
}

// /subscription/addCard
resource "aws_api_gateway_resource" "AddCard" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Subscription.id}"
  path_part = "addCard"
}

// /addCard OPTIONS
module "addCard-OptionsCORS" {
  source = "github.com/carrot/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.AddCard.path}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}


// /addCard POST
resource "aws_api_gateway_method" "AddCard-POST" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  http_method = "POST"
  authorization = "AWS_IAM"
}

resource "aws_api_gateway_integration" "AddCard-integration" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  http_method = "${aws_api_gateway_method.AddCard-POST.http_method}"
  type = "AWS_PROXY"
  uri = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.addCard.arn}/invocations"
  integration_http_method = "POST"
}

resource "aws_api_gateway_method_response" "AddCard-POST-200" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  http_method = "${aws_api_gateway_method.AddCard-POST.http_method}"
  status_code = "200"
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = "*" }
}

resource "aws_api_gateway_integration_response" "AddCard-POST-Integration-Response" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  resource_id = "${aws_api_gateway_resource.AddCard.id}"
  http_method = "${aws_api_gateway_method.AddCard-POST.http_method}"
  status_code = "${aws_api_gateway_method_response.AddCard-POST-200.status_code}"
}
