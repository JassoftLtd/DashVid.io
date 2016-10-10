// Lambda

// Videos GET
resource "aws_lambda_function" "getVideos" {
  filename = "Lambda/VideoLambdas/getVideos.zip"
  function_name = "getVideos"
  role = "${aws_iam_role.IamForVideoLambda.arn}"
  handler = "getVideos.lambda_handler"
  runtime = "python2.7"
  timeout = "3"
}

resource "aws_lambda_permission" "allow_api_gateway" {
  function_name = "${aws_lambda_function.getVideos.function_name}"
  statement_id = "AllowExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Video-getVideos-integration.integration_http_method}${aws_api_gateway_resource.Video.path}"
}

// Auth
resource "aws_lambda_function" "createUser" {
  filename = "Lambda/CreateUser.zip"
  function_name = "CreateUser"
  role = "${aws_iam_role.LambdAuthCreateUser.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}

resource "aws_lambda_function" "changePassword" {
  filename = "Lambda/ChangePassword.zip"
  function_name = "ChangePassword"
  role = "${aws_iam_role.LambdAuthChangePassword.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}

resource "aws_lambda_function" "login" {
  filename = "Lambda/Login.zip"
  function_name = "Login"
  role = "${aws_iam_role.LambdAuthLogin.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}

resource "aws_lambda_function" "lostPassword" {
  filename = "Lambda/LostPassword.zip"
  function_name = "LostPassword"
  role = "${aws_iam_role.LambdAuthLostPassword.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}

resource "aws_lambda_function" "resetPassword" {
  filename = "Lambda/ResetPassword.zip"
  function_name = "ResetPassword"
  role = "${aws_iam_role.LambdAuthResetPassword.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}

resource "aws_lambda_function" "verifyUser" {
  filename = "Lambda/VerifyUser.zip"
  function_name = "VerifyUser"
  role = "${aws_iam_role.LambdAuthVerifyUser.arn}"
  handler = "index.handler"
  runtime = "nodejs4.3"
}