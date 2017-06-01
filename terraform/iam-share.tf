// IAM

// Share Video
resource "aws_iam_role" "IamForShareVideoLambda" {
  name = "${var.environment_name}iam_for_share_video_lambda"

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

data "aws_iam_policy_document" "IamForShareVideoLambda" {
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
      "dynamodb:PutItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.shares-table.arn}",
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

resource "aws_iam_role_policy" "IamForShareVideoLambda" {
  name   = "${var.environment_name}IamForShareVideoLambda"
  role   = "${aws_iam_role.IamForShareVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForShareVideoLambda.json}"
}

// Get Shared Video
resource "aws_iam_role" "IamForGetSharedVideoLambda" {
  name = "${var.environment_name}iam_for_get_shares_video_lambda"

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

data "aws_iam_policy_document" "IamForGetSharedVideoLambda" {
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
      "dynamodb:GetItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.shares-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "s3:GetObject",
    ]

    "resources" = [
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-transcoded.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*",
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

resource "aws_iam_role_policy" "IamForGetSharedVideoLambda" {
  name   = "${var.environment_name}IamForGetSharedVideoLambda"
  role   = "${aws_iam_role.IamForGetSharedVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetSharedVideoLambda.json}"
}
