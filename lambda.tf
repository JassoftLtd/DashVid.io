// Lambda

resource "aws_iam_role" "IamForVideoLambda" {
  name = "iam_for_video_lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "getVideos" {
  filename = "VideoLambdas/getVideos.zip"
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