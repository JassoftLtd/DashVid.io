// Lambda

// Videos GET
resource "aws_lambda_function" "getVideos" {
  depends_on = [
    "aws_iam_role_policy.IamForGetVideosLambda",
  ]

  filename         = "PackagedLambdas/getVideos.zip"
  function_name    = "getVideos"
  role             = "${aws_iam_role.IamForGetVideosLambda.arn}"
  handler          = "getVideos.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/getVideos.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }
}

// Video Create
resource "aws_lambda_function" "createVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForCreateVideoLambda",
  ]

  filename         = "PackagedLambdas/createVideo.zip"
  function_name    = "createVideo"
  role             = "${aws_iam_role.IamForCreateVideoLambda.arn}"
  handler          = "createVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/createVideo.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      plan_bucket     = "${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
    }
  }
}

// Video Uploaded
resource "aws_lambda_function" "uploadedVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForUploadedVideoLambda",
  ]

  filename         = "PackagedLambdas/uploadedVideo.zip"
  function_name    = "uploadedVideo"
  role             = "${aws_iam_role.IamForUploadedVideoLambda.arn}"
  handler          = "uploadedVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "300"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/uploadedVideo.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment = {
    variables = {
      snsNewVideoArn = "${aws_sns_topic.new_video.arn}"
    }
  }
}

resource "aws_lambda_permission" "uploadedVideo_allow_bucket" {
  statement_id  = "AllowExecutionFromFreeS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.uploadedVideo.arn}"
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.dash-cam-videos-bucket.arn}"
}

// Video GET
resource "aws_lambda_function" "getVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForGetVideoLambda",
  ]

  filename         = "PackagedLambdas/getVideo.zip"
  function_name    = "getVideo"
  role             = "${aws_iam_role.IamForGetVideoLambda.arn}"
  handler          = "getVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/getVideo.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }
}

// Video Expired
resource "aws_lambda_function" "expiredVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForExpiredVideoLambda",
  ]

  filename         = "PackagedLambdas/expiredVideo.zip"
  function_name    = "expiredVideo"
  role             = "${aws_iam_role.IamForExpiredVideoLambda.arn}"
  handler          = "expiredVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "300"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/expiredVideo.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_permission" "expiredVideo_allow_bucket" {
  statement_id  = "AllowExecutionFromFreeS3BucketForExpiredVideo"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.expiredVideo.arn}"
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.dash-cam-videos-bucket.arn}"
}