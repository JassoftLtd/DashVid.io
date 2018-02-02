resource "aws_batch_job_definition" "Transcode" {
  name = "video_transcode"
  type = "container"

  container_properties = <<CONTAINER_PROPERTIES
{
    "image": "jassoftltd/video-transcode",
    "memory": 4096,
    "vcpus": 2,
    "jobRoleArn": "${aws_iam_role.IamForBatchTranscode.arn}",
    "environment": [
        {
          "name": "INPUT_BUCKET",
          "value": "${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
        },
        {
          "name": "OUTPUT_BUCKET",
          "value": "${aws_s3_bucket.dash-cam-videos-transcoded.bucket}"
        }
    ]
}
CONTAINER_PROPERTIES
}

resource "aws_iam_role" "IamForBatchTranscode" {
  name = "${var.environment_name}iam_for_batch_transcode"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "IamForBatchTranscode" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "s3:*",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "IamForBatchTranscode" {
  name   = "${var.environment_name}IamForBatchTranscode"
  role   = "${aws_iam_role.IamForBatchTranscode.id}"
  policy = "${data.aws_iam_policy_document.IamForBatchTranscode.json}"
}
