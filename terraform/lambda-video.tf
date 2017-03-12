// Lambda

// Videos GET
resource "aws_lambda_function" "getVideos" {
  filename = "Lambda/VideoLambdas/getVideos.zip"
  function_name = "getVideos"
  role = "${aws_iam_role.IamForGetVideosLambda.arn}"
  handler = "getVideos.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/getVideos.zip"))}"
}

// Video Create
resource "aws_lambda_function" "createVideo" {
  filename = "Lambda/VideoLambdas/createVideo.zip"
  function_name = "createVideo"
  role = "${aws_iam_role.IamForCreateVideoLambda.arn}"
  handler = "createVideo.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/createVideo.zip"))}"
  environment {
    variables = {
      plan_bucket_free = "${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}"
      plan_bucket_standard = "${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}"
      plan_bucket_premium = "${aws_s3_bucket.dash-cam-videos-premium-bucket.bucket}"
    }
  }
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
  environment = {
    variables = {
      snsNewVideoArn = "${aws_sns_topic.new_video.arn}"
    }
  }
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
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/getVideo.zip"))}"
}

// Video Expired
resource "aws_lambda_function" "expiredVideo" {
  filename = "Lambda/VideoLambdas/expiredVideo.zip"
  function_name = "expiredVideo"
  role = "${aws_iam_role.IamForExpiredVideoLambda.arn}"
  handler = "expiredVideo.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/VideoLambdas/expiredVideo.zip"))}"
}

resource "aws_lambda_permission" "expiredVideo_allow_free_bucket" {
  statement_id = "AllowExecutionFromFreeS3BucketForExpiredVideo"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.expiredVideo.arn}"
  principal = "s3.amazonaws.com"
  source_arn = "${aws_s3_bucket.dash-cam-videos-free-bucket.arn}"
}

resource "aws_lambda_permission" "expiredVideo_allow_standard_bucket" {
  statement_id = "AllowExecutionFromStandardS3BucketForExpiredVideo"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.expiredVideo.arn}"
  principal = "s3.amazonaws.com"
  source_arn = "${aws_s3_bucket.dash-cam-videos-standard-bucket.arn}"
}