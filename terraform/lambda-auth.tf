// Auth
resource "aws_lambda_function" "createUser" {
  filename = "${path.module}/Lambda/AuthLambdas/CreateUser.zip"
  function_name = "LambdAuthCreateUser"
  role = "${aws_iam_role.LambdAuthCreateUser.arn}"
  handler = "CreateUser.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/CreateUser.zip"))}"
  environment {
    variables = {
      email_disabled = "${var.email_disabled}"
    }
  }
}

resource "aws_lambda_permission" "allow_api_gateway-createUser" {
  function_name = "${aws_lambda_function.createUser.function_name}"
  statement_id = "AllowCreateUserExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-createUser-integration.integration_http_method}${aws_api_gateway_resource.Signup.path}"
}

resource "aws_lambda_function" "changePassword" {
  filename = "${path.module}/Lambda/AuthLambdas/ChangePassword.zip"
  function_name = "LambdAuthChangePassword"
  role = "${aws_iam_role.LambdAuthChangePassword.arn}"
  handler = "ChangePassword.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/ChangePassword.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-changePassword" {
  function_name = "${aws_lambda_function.changePassword.function_name}"
  statement_id = "AllowChangePasswordExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-changePassword-integration.integration_http_method}${aws_api_gateway_resource.ChangePassword.path}"
}

resource "aws_lambda_function" "login" {
  filename = "${path.module}/Lambda/AuthLambdas/Login.zip"
  function_name = "LambdAuthLogin"
  role = "${aws_iam_role.LambdAuthLogin.arn}"
  handler = "Login.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/Login.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-login" {
  function_name = "${aws_lambda_function.login.function_name}"
  statement_id = "AllowLoginExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-login-integration.integration_http_method}${aws_api_gateway_resource.Login.path}"
}

resource "aws_lambda_function" "lostPassword" {
  filename = "${path.module}/Lambda/AuthLambdas/LostPassword.zip"
  function_name = "LambdAuthLostPassword"
  role = "${aws_iam_role.LambdAuthLostPassword.arn}"
  handler = "LostPassword.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/LostPassword.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-lostPassword" {
  function_name = "${aws_lambda_function.lostPassword.function_name}"
  statement_id = "AllowLostPasswordExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-lostPassword-integration.integration_http_method}${aws_api_gateway_resource.LostPassword.path}"
}

resource "aws_lambda_function" "resetPassword" {
  filename = "${path.module}/Lambda/AuthLambdas/ResetPassword.zip"
  function_name = "LambdAuthResetPassword"
  role = "${aws_iam_role.LambdAuthResetPassword.arn}"
  handler = "ResetPassword.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/ResetPassword.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-resetPassword" {
  function_name = "${aws_lambda_function.resetPassword.function_name}"
  statement_id = "AllowResetPasswordExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-resetPassword-integration.integration_http_method}${aws_api_gateway_resource.ResetPassword.path}"
}

resource "aws_lambda_function" "verifyUser" {
  filename = "${path.module}/Lambda/AuthLambdas/VerifyUser.zip"
  function_name = "LambdAuthVerifyUser"
  role = "${aws_iam_role.LambdAuthVerifyUser.arn}"
  handler = "VerifyUser.handler"
  runtime = "nodejs4.3"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/VerifyUser.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-verifyUser" {
  function_name = "${aws_lambda_function.verifyUser.function_name}"
  statement_id = "AllowVerifyUserExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Auth-verifyUser-integration.integration_http_method}${aws_api_gateway_resource.VerifyUser.path}"
}