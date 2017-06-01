// Lambda

// Share Video
resource "aws_lambda_function" "shareVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForShareVideoLambda",
  ]

  filename         = "Lambda/ShareLambdas/shareVideo.zip"
  function_name    = "shareVideo"
  role             = "${aws_iam_role.IamForShareVideoLambda.arn}"
  handler          = "shareVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/ShareLambdas/shareVideo.zip"))}"

  tracing_config {
    mode = "Active"
  }
}

// Get Shared Video
resource "aws_lambda_function" "getSharedVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForGetSharedVideoLambda",
  ]

  filename         = "Lambda/ShareLambdas/getSharedVideo.zip"
  function_name    = "getSharedVideo"
  role             = "${aws_iam_role.IamForGetSharedVideoLambda.arn}"
  handler          = "getSharedVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/ShareLambdas/getSharedVideo.zip"))}"

  tracing_config {
    mode = "Active"
  }
}
