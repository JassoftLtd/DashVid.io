// API Gateway

resource "aws_api_gateway_rest_api" "DashCamAPI" {
    name = "DashCamAPI"
    description = "This is my API for DashCam UI"
}

resource "aws_api_gateway_deployment" "DevDeployment" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  stage_name = "Dev"
  variables = {
    "auth_email_from_address" = "${var.auth_email_from_address}"
    "auth_db_table" = "Users"
    "auth_application_name" = "MyApplication"
    "auth_verification_page" = "http://${aws_s3_bucket.dash-cam-ui-bucket.website_endpoint}/verify.html"
    "auth_reset_page" = "http://${aws_s3_bucket.dash-cam-ui-bucket.website_endpoint}/reset.html"
    "auth_identity_pool" = "${var.aws_identity_pool}"
    "auth_developer_provider_name" = "login.mycompany.myapp"
  }
}

// /v1
resource "aws_api_gateway_resource" "v1" {
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_rest_api.DashCamAPI.root_resource_id}"
  path_part = "v1"
}
