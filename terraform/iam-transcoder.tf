// IAM

// getPLan
resource "aws_iam_role" "IamForVideoTranscoder" {
  name = "${var.environment_name}iam_for_video_transcoder"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "elastictranscoder.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "IamForVideoTranscoder" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "s3:GetObject"
    ],
    "resources" = [
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-premium-bucket.bucket}/*"
    ]
  }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "s3:PutObject"
    ],
    "resources" = [
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket-transcoded.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket-thumbnails.bucket}/*",
    ]
  }

}

resource "aws_iam_role_policy" "IamForVideoTranscoder" {
  name = "${var.environment_name}IamForVideoTranscoder"
  role = "${aws_iam_role.IamForVideoTranscoder.id}"
  policy = "${data.aws_iam_policy_document.IamForVideoTranscoder.json}"
}
