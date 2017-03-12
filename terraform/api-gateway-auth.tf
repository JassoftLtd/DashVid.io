// API Gateway

// /auth
resource "aws_api_gateway_resource" "Auth" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.v1"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.v1.id}"
  path_part = "auth"
}

// /signup
resource "aws_api_gateway_resource" "Signup" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "signup"
}

// /login
resource "aws_api_gateway_resource" "Login" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "login"
}

// /changePassword
resource "aws_api_gateway_resource" "ChangePassword" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "changePassword"
}

// /lostPassword
resource "aws_api_gateway_resource" "LostPassword" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "lostPassword"
}

// /resetPassword
resource "aws_api_gateway_resource" "ResetPassword" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "resetPassword"
}

// /verifyUser
resource "aws_api_gateway_resource" "VerifyUser" {
  depends_on = ["aws_api_gateway_rest_api.DashCamAPI", "aws_api_gateway_resource.Auth"]
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  parent_id = "${aws_api_gateway_resource.Auth.id}"
  path_part = "verifyUser"
}

// /Signup OPTIONS
module "signupOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Signup.path}"
  resource_id = "${aws_api_gateway_resource.Signup.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /signup POST
module "ApiGatewayLambda-createUser" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.Signup.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.Signup.path}"
  aws_lambda_function_arn = "${aws_lambda_function.createUser.arn}"
  aws_lambda_function_name = "${aws_lambda_function.createUser.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}

// /login OPTIONS
module "loginOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.Login.path}"
  resource_id = "${aws_api_gateway_resource.Login.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /login POST
module "ApiGatewayLambda-login" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.Login.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.Login.path}"
  aws_lambda_function_arn = "${aws_lambda_function.login.arn}"
  aws_lambda_function_name = "${aws_lambda_function.login.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}

// /changePassword OPTIONS
module "changePasswordOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.ChangePassword.path}"
  resource_id = "${aws_api_gateway_resource.ChangePassword.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /changePassword POST
module "ApiGatewayLambda-changePassword" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.ChangePassword.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.ChangePassword.path}"
  aws_lambda_function_arn = "${aws_lambda_function.changePassword.arn}"
  aws_lambda_function_name = "${aws_lambda_function.changePassword.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "AWS_IAM"
}

// /lostPassword OPTIONS
module "lostPasswordOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.LostPassword.path}"
  resource_id = "${aws_api_gateway_resource.LostPassword.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /lostPassword POST
module "ApiGatewayLambda-lostPassword" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.LostPassword.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.LostPassword.path}"
  aws_lambda_function_arn = "${aws_lambda_function.lostPassword.arn}"
  aws_lambda_function_name = "${aws_lambda_function.lostPassword.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}

// /resetPassword OPTIONS
module "resetPasswordOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.ResetPassword.path}"
  resource_id = "${aws_api_gateway_resource.ResetPassword.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /resetPassword POST
module "ApiGatewayLambda-resetPassword" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.ResetPassword.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.ResetPassword.path}"
  aws_lambda_function_arn = "${aws_lambda_function.resetPassword.arn}"
  aws_lambda_function_name = "${aws_lambda_function.resetPassword.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}

// /verifyUser OPTIONS
module "verifyUserOptionsCORS" {
  source = "github.com/jonnyshaw89/terraform-api-gateway-cors-module"
  resource_name = "${aws_api_gateway_resource.VerifyUser.path}"
  resource_id = "${aws_api_gateway_resource.VerifyUser.id}"
  rest_api_id = "${aws_api_gateway_rest_api.DashCamAPI.id}"
}

// /verifyUser POST
module "ApiGatewayLambda-verifyUser" {
  source = "github.com/jonnyshaw89/api-gateway-lambda-method"
  aws_api_gateway_method_http_method = "POST"
  aws_api_gateway_rest_api = "${aws_api_gateway_rest_api.DashCamAPI.id}"
  aws_api_gateway_resource_id = "${aws_api_gateway_resource.VerifyUser.id}"
  aws_api_gateway_resource_path = "${aws_api_gateway_resource.VerifyUser.path}"
  aws_lambda_function_arn = "${aws_lambda_function.verifyUser.arn}"
  aws_lambda_function_name = "${aws_lambda_function.verifyUser.function_name}"
  aws_region = "${var.aws_region}"
  aws_account_id = "${var.aws_account_id}"
  environment_name = "${var.environment_name}"
  aws_api_gateway_method_authorization = "NONE"
}
