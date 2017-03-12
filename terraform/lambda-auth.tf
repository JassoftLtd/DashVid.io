// Auth
resource "aws_lambda_function" "createUser" {
  filename = "${path.module}/Lambda/AuthLambdas/CreateUser.zip"
  function_name = "LambdAuthCreateUser"
  role = "${aws_iam_role.LambdAuthCreateUser.arn}"
  handler = "CreateUser.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/CreateUser.zip"))}"
  environment {
    variables = {
      email_disabled = "${var.email_disabled}"
      token_override = "${var.token_override}"
    }
  }
}

resource "aws_lambda_function" "changePassword" {
  filename = "${path.module}/Lambda/AuthLambdas/ChangePassword.zip"
  function_name = "LambdAuthChangePassword"
  role = "${aws_iam_role.LambdAuthChangePassword.arn}"
  handler = "ChangePassword.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/ChangePassword.zip"))}"
}

resource "aws_lambda_function" "login" {
  filename = "${path.module}/Lambda/AuthLambdas/Login.zip"
  function_name = "LambdAuthLogin"
  role = "${aws_iam_role.LambdAuthLogin.arn}"
  handler = "Login.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/Login.zip"))}"
}

resource "aws_lambda_function" "lostPassword" {
  filename = "${path.module}/Lambda/AuthLambdas/LostPassword.zip"
  function_name = "LambdAuthLostPassword"
  role = "${aws_iam_role.LambdAuthLostPassword.arn}"
  handler = "LostPassword.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/LostPassword.zip"))}"
  environment {
    variables = {
      email_disabled = "${var.email_disabled}"
      token_override = "${var.token_override}"
    }
  }
}

resource "aws_lambda_function" "resetPassword" {
  filename = "${path.module}/Lambda/AuthLambdas/ResetPassword.zip"
  function_name = "LambdAuthResetPassword"
  role = "${aws_iam_role.LambdAuthResetPassword.arn}"
  handler = "ResetPassword.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/ResetPassword.zip"))}"
}

resource "aws_lambda_function" "verifyUser" {
  filename = "${path.module}/Lambda/AuthLambdas/VerifyUser.zip"
  function_name = "LambdAuthVerifyUser"
  role = "${aws_iam_role.LambdAuthVerifyUser.arn}"
  handler = "VerifyUser.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("${path.module}/Lambda/AuthLambdas/VerifyUser.zip"))}"
}
