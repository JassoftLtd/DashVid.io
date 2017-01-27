// IAM

// getVideos
resource "aws_iam_role" "IamForGetVideosLambda" {
  name = "${var.environment_name}iam_for_get_videos_lambda"
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

data "aws_iam_policy_document" "IamForGetVideosLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:Query",
    ],
    "resources" = [
      "${aws_dynamodb_table.videos-table.arn}/index/UserVideosByDate"
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

resource "aws_iam_role_policy" "IamForGetVideosLambda" {
  name = "${var.environment_name}IamForGetVideosLambda"
  role = "${aws_iam_role.IamForGetVideosLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetVideosLambda.json}"
}

// createVideo
resource "aws_iam_role" "IamForCreateVideoLambda" {
  name = "${var.environment_name}iam_for_create_video_lambda"
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
        "s3:PutObject"
      ],
      "resources" = [
        "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",
        "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*"
        ]
    }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:GetItem"
    ],
    "resources" = [
      "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.subscriptions-table.name}"
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
  name = "${var.environment_name}IamForCreateVideoLambda"
  role = "${aws_iam_role.IamForCreateVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForCreateVideoLambda.json}"
}

// uploadedVideo
resource "aws_iam_role" "IamForUploadedVideoLambda" {
  name = "${var.environment_name}iam_for_uploaded_video_lambda"
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


data "aws_iam_policy_document" "IamForUploadedVideoLambda" {
  "statement" = {
      "effect" = "Allow",
      "actions" = [
        "dynamodb:PutItem"
      ],
      "resources" = [
        "${aws_dynamodb_table.videos-table.arn}"
        ]
    }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "s3:GetObject",
      "s3:DeleteObject"
    ],
    "resources" = [
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*"
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

resource "aws_iam_role_policy" "IamForUploadedVideoLambda" {
  name = "${var.environment_name}IamForUploadedVideoLambda"
  role = "${aws_iam_role.IamForUploadedVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForUploadedVideoLambda.json}"
}


// getVideo
resource "aws_iam_role" "IamForGetVideoLambda" {
  name = "${var.environment_name}iam_for_get_video_lambda"
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

data "aws_iam_policy_document" "IamForGetVideoLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:GetItem",
    ],
    "resources" = [
      "${aws_dynamodb_table.videos-table.arn}"
    ]
  }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "s3:GetObject"
    ],
    "resources" = [
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}/*",
      "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-standard-bucket.bucket}/*"
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

resource "aws_iam_role_policy" "IamForGetVideoLambda" {
  name = "${var.environment_name}IamForGetVideoLambda"
  role = "${aws_iam_role.IamForGetVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetVideoLambda.json}"
}


// expiredVideo
resource "aws_iam_role" "IamForExpiredVideoLambda" {
  name = "${var.environment_name}iam_for_expired_video_lambda"
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


data "aws_iam_policy_document" "IamForExpiredVideoLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:UpdateItem"
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

resource "aws_iam_role_policy" "IamForExpiredVideoLambda" {
  name = "${var.environment_name}IamForExpiredVideoLambda"
  role = "${aws_iam_role.IamForExpiredVideoLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForExpiredVideoLambda.json}"
}