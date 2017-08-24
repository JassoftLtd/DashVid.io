// Lambda

// Transcode Video
resource "aws_lambda_function" "transcodeVideo" {
  depends_on = [
    "aws_iam_role_policy.IamForTranscodeVideoLambda",
  ]

  filename         = "Lambda/TranscodingLambdas/transcodeVideo.zip"
  function_name    = "transcodeVideo"
  role             = "${aws_iam_role.IamForTranscodeVideoLambda.arn}"
  handler          = "transcodeVideo.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/TranscodingLambdas/transcodeVideo.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      PipelineId     = "${aws_elastictranscoder_pipeline.videos.id}"
    }
  }
}

resource "aws_lambda_permission" "transcodeVideo_allow_sns" {
  statement_id  = "AllowExecutionFromSNSForTranscodeVideo"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.transcodeVideo.arn}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.new_video.arn}"
}

// Video Transcoded
resource "aws_lambda_function" "videoTranscoded" {
  depends_on = [
    "aws_iam_role_policy.IamForVideoTranscodedLambda",
  ]

  filename         = "Lambda/TranscodingLambdas/videoTranscoded.zip"
  function_name    = "videoTranscoded"
  role             = "${aws_iam_role.IamForVideoTranscodedLambda.arn}"
  handler          = "videoTranscoded.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/TranscodingLambdas/videoTranscoded.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      TranscodedBucket = "${aws_s3_bucket.dash-cam-videos-transcoded.bucket}"
    }
  }
}

resource "aws_lambda_permission" "videoTranscoded_allow_sns" {
  statement_id  = "AllowExecutionFromSNSForVideoTranscoded"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.videoTranscoded.arn}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.video_transcoded.arn}"
}
