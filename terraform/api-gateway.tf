// API Gateway

resource "aws_api_gateway_rest_api" "DashCamAPI" {
    name = "DashCamAPI"
    description = "This is my API for DashCam UI"
}

resource "aws_api_gateway_deployment" "DevDeployment" {
  depends_on = [
    "aws_api_gateway_rest_api.DashCamAPI",
    "aws_api_gateway_integration_response.resetPassword-POST-Integration-Response",
    "aws_api_gateway_integration_response.AddCard-POST-Integration-Response",
    "aws_api_gateway_integration_response.Video-POST-Integration-Response"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  stage_name = "Dev"
  variables = {
    "auth_email_from_address" = "${var.auth_email_from_address}"
    "auth_db_table" = "Users"
    "auth_application_name" = "Dashvid.io"
    "auth_verification_page" = "http://${aws_s3_bucket.dashvid-io-bucket.website_endpoint}/#/verify"
    "auth_reset_page" = "http://${aws_s3_bucket.dashvid-io-bucket.website_endpoint}/#/reset"
    "auth_identity_pool" = "${var.aws_identity_pool}"
    "auth_developer_provider_name" = "${var.auth_developer_provider_name}"
    "user_verified_sns_arn" = ""
//    "user_verified_sns_arn" = "${aws_sns_topic.user_verified.arn}"
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
