// IAM

// getCameras
resource "aws_iam_role" "IamForGetCamerasLambda" {
  name = "${var.environment_name}iam_for_get_cameras_lambda"
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

data "aws_iam_policy_document" "IamForGetCamerasLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:Query",
    ],
    "resources" = [
      "${aws_dynamodb_table.cameras-table.arn}/index/UserCameras"
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
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords"
    ],
    "resources" = [
      "*"
    ]
  }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords"
    ],
    "resources" = [
      "*"
    ]
  }
}

resource "aws_iam_role_policy" "IamForGetCamerasLambda" {
  name = "${var.environment_name}IamForGetCamerasLambda"
  role = "${aws_iam_role.IamForGetCamerasLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetCamerasLambda.json}"
}
