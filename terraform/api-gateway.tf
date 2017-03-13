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
    "module.ApiGatewayLambda-changePassword",
    "module.ApiGatewayLambda-lostPassword",
    "module.ApiGatewayLambda-resetPassword",
    "module.ApiGatewayLambda-verifyUser",
    "module.ApiGatewayLambda-getPlan",
    "module.ApiGatewayLambda-addCard",
    "module.ApiGatewayLambda-getVideos",
    "module.ApiGatewayLambda-createVideo",
    "module.ApiGatewayLambda-getVideo"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  stage_name = "Dev"
  variables = {
    "auth_email_from_address" = "${var.auth_email_from_address}"
    "auth_db_table" = "Users"
    "auth_application_name" = "Dashvid.io"
    "auth_verification_page" = "http://DashVid.io/#/verify"
    "auth_reset_page" = "http://DashVid.io/#/reset"
    "auth_identity_pool" = "${var.aws_identity_pool}"
    "auth_developer_provider_name" = "${var.auth_developer_provider_name}"
    "user_verified_sns_arn" = "${aws_sns_topic.user_verified.arn}"
  }
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
