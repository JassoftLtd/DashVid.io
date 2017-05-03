// API Gateway

resource "aws_api_gateway_rest_api" "DashCamAPI" {
    name = "DashCamAPI"
    description = "This is my API for DashCam UI"
}

resource "aws_api_gateway_account" "DashCamAPIAccount" {
  cloudwatch_role_arn = "${aws_iam_role.IamForDashCamAPIAccount.arn}"
}

resource "aws_iam_role" "IamForDashCamAPIAccount" {
  name = "${var.environment_name}iam_for_DashCamAPIAccount"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "IamForDashCamAPIAccount" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents"
    ],
    "resources" = [
      "*"
    ]
  }
}

resource "aws_iam_role_policy" "IamForDashCamAPIAccount" {
  name = "${var.environment_name}IamForDashCamAPIAccount"
  role = "${aws_iam_role.IamForDashCamAPIAccount.id}"
  policy = "${data.aws_iam_policy_document.IamForDashCamAPIAccount.json}"
}

resource "aws_api_gateway_deployment" "DevDeployment" {
  depends_on = [
    "aws_api_gateway_rest_api.DashCamAPI",
    "module.ApiGatewayLambda-createUser",
    "module.ApiGatewayLambda-login",
    "module.ApiGatewayLambda-loginCameraKey",
    "module.ApiGatewayLambda-changePassword",
    "module.ApiGatewayLambda-lostPassword",
    "module.ApiGatewayLambda-resetPassword",
    "module.ApiGatewayLambda-verifyUser",
    "module.ApiGatewayLambda-getPlan",
    "module.ApiGatewayLambda-addCard",
    "module.ApiGatewayLambda-getVideos",
    "module.ApiGatewayLambda-createVideo",
    "module.ApiGatewayLambda-getVideo",
    "module.ApiGatewayLambda-getCameras"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  stage_name = "Dev"
}

// Auth
//resource "aws_api_gateway_authorizer" "Dashcam" {
//  name = "Dashcam"
//  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
//  authorizer_uri = "arn:aws:apigateway:region:lambda:path/2015-03-31/functions/${aws_lambda_function.authorizer.arn}/invocations"
//}

// /v1
resource "aws_api_gateway_resource" "v1" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_rest_api.DashCamAPI.root_resource_id}"
  path_part = "v1"
}

resource "aws_api_gateway_domain_name" "DashCamAPI" {
  domain_name = "${var.environment_name}api.${var.domain_name}"

  certificate_arn        = "${var.api_certificate_arn}"
}