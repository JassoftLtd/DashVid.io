// S3

// Transcoded Video Store
resource "aws_s3_bucket" "dash-cam-videos-transcoded" {
  bucket              = "${var.environment_name}dash-cam-videos-transcoded"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = ""
    enabled = true

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}

// Trigger Lambda when events
resource "aws_s3_bucket_notification" "videos_transcoded_bucket_created_notification" {
  depends_on = ["aws_s3_bucket.dash-cam-videos-transcoded"]
  bucket     = "${aws_s3_bucket.dash-cam-videos-transcoded.id}"

  lambda_function {
    lambda_function_arn = "${aws_lambda_function.videoTranscoded.arn}"
    events              = ["s3:ObjectCreated:*"]
  }
}
