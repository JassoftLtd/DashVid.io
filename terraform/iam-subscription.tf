// IAM

// addCard
resource "aws_iam_role" "IamForAddCardLambda" {
  name = "${var.environment_name}iam_for_addCard_lambda"
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

data "aws_iam_policy_document" "IamForAddCardLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem"
    ],
    "resources" = [
      "${aws_dynamodb_table.users-table.arn}"
    ]
  }
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:Query",
      "dynamodb:UpdateItem"
    ],
    "resources" = [
      "${aws_dynamodb_table.subscriptions-table.arn}"
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
}

resource "aws_iam_role_policy" "IamForAddCardLambda" {
  name = "${var.environment_name}IamForAddCardLambda"
  role = "${aws_iam_role.IamForAddCardLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForAddCardLambda.json}"
}
