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

// Video Uploaded
resource "aws_lambda_function" "uploadedVideo" {
  filename = "Lambda/VideoLambdas/uploadedVideo.zip"
  function_name = "uploadedVideo"
  role = "${aws_iam_role.IamForUploadedVideoLambda.arn}"
  handler = "uploadedVideo.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/uploadedVideo.zip"))}"
}

resource "aws_lambda_permission" "uploadedVideo_allow_free_bucket" {
  statement_id = "AllowExecutionFromFreeS3Bucket"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.uploadedVideo.arn}"
  principal = "s3.amazonaws.com"
  source_arn = "${aws_s3_bucket.dash-cam-videos-free-bucket.arn}"
}

resource "aws_lambda_permission" "uploadedVideo_allow_standard_bucket" {
  statement_id = "AllowExecutionFromStandardS3Bucket"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.uploadedVideo.arn}"
  principal = "s3.amazonaws.com"
  source_arn = "${aws_s3_bucket.dash-cam-videos-standard-bucket.arn}"
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
  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.DashCamAPI.id}/*/${aws_api_gateway_integration.Video-getVideos-integration.integration_http_method}${aws_api_gateway_resource.v1.path}${aws_api_gateway_resource.Video.path}${aws_api_gateway_resource.VideoDetail.path}"
}