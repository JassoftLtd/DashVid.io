// IAM

// getVideos
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
  role = "${aws_iam_role.RoleForLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetVideosLambda.json}"
}

// createVideo
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
      "dynamodb:Query"
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
  role = "${aws_iam_role.RoleForLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForCreateVideoLambda.json}"
}

// uploadedVideo
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
        "SNS:Publish"
      ],
      "resources" = [
        "${aws_sns_topic.new_video.arn}"
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
  role = "${aws_iam_role.RoleForLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForUploadedVideoLambda.json}"
}


// getVideo
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
  role = "${aws_iam_role.RoleForLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetVideoLambda.json}"
}


// expiredVideo
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
  role = "${aws_iam_role.RoleForLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForExpiredVideoLambda.json}"
}