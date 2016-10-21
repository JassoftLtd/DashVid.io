// Lambda

// Videos GET
resource "aws_lambda_function" "getVideos" {
  filename = "Lambda/VideoLambdas/getVideos.zip"
  function_name = "getVideos"
  role = "${aws_iam_role.IamForGetVideosLambda.arn}"
  handler = "getVideos.handler"
  runtime = "nodejs4.3"
  timeout = "3"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/getVideos.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-getVideos" {
  function_name = "${aws_lambda_function.getVideos.function_name}"
  statement_id = "AllowGetVideosExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/*/"
}

// Video Create
resource "aws_lambda_function" "createVideo" {
  filename = "Lambda/VideoLambdas/createVideo.zip"
  function_name = "createVideo"
  role = "${aws_iam_role.IamForCreateVideoLambda.arn}"
  handler = "createVideo.handler"
  runtime = "nodejs4.3"
  timeout = "3"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/createVideo.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-createVideo" {
  function_name = "${aws_lambda_function.createVideo.function_name}"
  statement_id = "AllowCreateVideoExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Video-createVideo-integration.integration_http_method}${aws_api_gateway_resource.v1.path}${aws_api_gateway_resource.Video.path}"
}

// Video Upload
resource "aws_lambda_function" "uploadVideo" {
  filename = "Lambda/VideoLambdas/uploadVideo.zip"
  function_name = "uploadVideo"
  role = "${aws_iam_role.IamForUploadVideoLambda.arn}"
  handler = "uploadVideo.handler"
  runtime = "nodejs4.3"
  timeout = "3"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/uploadVideo.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-uploadVideo" {
  function_name = "${aws_lambda_function.uploadVideo.function_name}"
  statement_id = "AllowUploadVideoExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/*/"
}

// Video GET
resource "aws_lambda_function" "getVideo" {
  filename = "Lambda/VideoLambdas/getVideo.zip"
  function_name = "getVideo"
  role = "${aws_iam_role.IamForGetVideoLambda.arn}"
  handler = "getVideo.handler"
  runtime = "nodejs4.3"
  timeout = "3"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/getVideo.zip"))}"
}

resource "aws_lambda_permission" "allow_api_gateway-getVideo" {
  function_name = "${aws_lambda_function.getVideo.function_name}"
  statement_id = "AllowGetVideoExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  principal = "apigateway.amazonaws.com"
//  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/*/"
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Video-uploadVideo-integration.integration_http_method}${aws_api_gateway_resource.v1.path}${aws_api_gateway_resource.Video.path}${aws_api_gateway_resource.VideoDetail.path}"
}