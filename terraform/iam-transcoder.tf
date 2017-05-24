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
  //  "statement" = {  //    "effect" = "Allow",  //    "actions" = [  //      "s3:GetObject"  //    ],  //    "resources" = [  //      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",  //      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*"  //    ]  //  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "SNS:Publish",
    ]

    "resources" = [
      "${aws_sns_topic.video_transcoded.arn}",
    ]
  }

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

resource "aws_iam_role_policy" "IamForVideoTranscoder" {
  name   = "${var.environment_name}IamForVideoTranscoder"
  role   = "${aws_iam_role.IamForVideoTranscoder.id}"
  policy = "${data.aws_iam_policy_document.IamForVideoTranscoder.json}"
}

// transcodeVideo
resource "aws_iam_role" "IamForTranscodeVideoLambda" {
  name = "${var.environment_name}iam_for_video_transcoder_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "IamForTranscodeVideoLambda" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.videos-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "elastictranscoder:CreateJob",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "IamForTranscodeVideoLambda" {
  name   = "${var.environment_name}IamForTranscodeVideoLambda"
  role   = "${aws_iam_role.IamForTranscodeVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForTranscodeVideoLambda.json}"
}

// videoTranscoded
resource "aws_iam_role" "IamForVideoTranscodedLambda" {
  name = "${var.environment_name}iam_for_video_transcoded_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "IamForVideoTranscodedLambda" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.videos-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "IamForVideoTranscodedLambda" {
  name   = "${var.environment_name}IamForVideoTranscodedLambda"
  role   = "${aws_iam_role.IamForVideoTranscodedLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForVideoTranscodedLambda.json}"
}
