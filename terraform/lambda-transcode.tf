// Lambda

// Transcode Video On AWS Batch
resource "aws_lambda_function" "transcodeVideoOnBatch" {
  depends_on = [
    "aws_iam_role_policy.IamForTranscodeVideoOnBatchLambda",
  ]

  filename         = "PackagedLambdas/transcodeVideoOnBatch.zip"
  function_name    = "transcodeVideoOnBatch"
  role             = "${aws_iam_role.IamForTranscodeVideoOnBatchLambda.arn}"
  handler          = "transcodeVideoOnBatch.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/transcodeVideoOnBatch.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      jobDefinition = "${aws_batch_job_definition.Transcode.name}"
      jobName       = "Transcode"
      jobQueue      = "${aws_batch_job_queue.video_transcoding_queue.name}"
    }
  }
}

resource "aws_lambda_permission" "transcodeVideoOnBatch_allow_sns" {
  statement_id  = "AllowExecutionFromSNSForTranscodeVideoOnBatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.transcodeVideoOnBatch.arn}"
  principal     = "sns.amazonaws.com"
  source_arn    = "${aws_sns_topic.new_video.arn}"
}

// Video Transcoded
resource "aws_lambda_function" "videoTranscoded" {
  depends_on = [
    "aws_iam_role_policy.IamForVideoTranscodedLambda",
  ]

  filename         = "PackagedLambdas/videoTranscoded.zip"
  function_name    = "videoTranscoded"
  role             = "${aws_iam_role.IamForVideoTranscodedLambda.arn}"
  handler          = "videoTranscoded.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/videoTranscoded.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_permission" "videoTranscoded_allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.videoTranscoded.arn}"
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.dash-cam-videos-transcoded.arn}"
}
