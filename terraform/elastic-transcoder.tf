resource "aws_elastictranscoder_pipeline" "videos" {
  input_bucket = "${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
  name         = "DashVid.io"
  role         = "${aws_iam_role.IamForVideoTranscoder.arn}"

  content_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-transcoded.bucket}"
    storage_class = "Standard"
  }

  thumbnail_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-thumbnails.bucket}"
    storage_class = "Standard"
  }

  notifications = {
    completed = "${aws_sns_topic.video_transcoded.arn}"
  }
}
