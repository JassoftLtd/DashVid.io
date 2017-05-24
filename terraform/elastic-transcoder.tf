resource "aws_elastictranscoder_pipeline" "free" {
  input_bucket = "${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}"
  name         = "DashVid.io_Free_Plan"
  role         = "${aws_iam_role.IamForVideoTranscoder.arn}"

  content_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-free-bucket-transcoded.bucket}"
    storage_class = "Standard"
  }

  thumbnail_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-free-bucket-thumbnails.bucket}"
    storage_class = "Standard"
  }

  notifications = {
    completed = "${aws_sns_topic.video_transcoded.arn}"
  }
}
