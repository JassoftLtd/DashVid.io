// IAM

// getVideo
resource "aws_iam_role" "IamForGetVideoLambda" {
  name = "iam_for_get_video_lambda"
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


resource "aws_iam_role_policy" "IamForGetVideoLambda" {
  name = "IamForGetVideoLambda"
  role = "${aws_iam_role.IamForGetVideoLambda.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:Describe*",
        "cloudwatch:Get*",
        "cloudwatch:List*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

// createVideo
resource "aws_iam_role" "IamForCreateVideoLambda" {
  name = "iam_for_create_video_lambda"
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

data "aws_iam_policy_document" "IamForCreateVideoLambda" {
  "statement" = {
      "effect" = "Allow",
      "actions" = [
        "dynamodb:PutItem",
      ],
      "resources" = [
        "${aws_dynamodb_table.videos-table.arn}"
        ]
    }

  "statement" = {
      "effect" = "Allow",
      "actions" = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "resources" = [
          "*"
        ]
    }

  "statement" = {
      "effect" = "Allow",
      "actions" = [
        "lambda:InvokeFunction"
      ],
      "resources" = [
        "*"
        ]
    }
  "statement" = {
      "effect" = "Allow",
      "actions" = [
        "cloudwatch:Describe*",
        "cloudwatch:Get*",
        "cloudwatch:List*"
      ],
      "resources" = [
        "*"
        ]
    }
}

resource "aws_iam_role_policy" "IamForCreateVideoLambda" {
  name = "IamForCreateVideoLambda"
  role = "${aws_iam_role.IamForCreateVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForCreateVideoLambda.json}"
}

// uploadVideo
resource "aws_iam_role" "IamForUploadVideoLambda" {
  name = "iam_for_upload_video_lambda"
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


resource "aws_iam_role_policy" "IamForUploadVideoLambda" {
  name = "IamForUploadVideoLambda"
  role = "${aws_iam_role.IamForUploadVideoLambda.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:Describe*",
        "cloudwatch:Get*",
        "cloudwatch:List*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}