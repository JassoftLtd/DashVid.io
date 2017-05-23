// IAM

// getPLan
resource "aws_iam_role" "IamForGetPlanLambda" {
  name = "${var.environment_name}iam_for_getPlan_lambda"
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

data "aws_iam_policy_document" "IamForGetPlanLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:Query",
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

resource "aws_iam_role_policy" "IamForGetPlanLambda" {
  name = "${var.environment_name}IamForGetPlanLambda"
  role = "${aws_iam_role.IamForGetPlanLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetPlanLambda.json}"
}

// switchPlan
resource "aws_iam_role" "IamForSwitchPlanLambda" {
  name = "${var.environment_name}iam_for_switchPlan_lambda"
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

data "aws_iam_policy_document" "IamForSwitchPlanLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:Query",
      "dynamodb:PutItem"
    ],
    "resources" = [
      "${aws_dynamodb_table.subscriptions-table.arn}"
    ]
  }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:GetItem"
    ],
    "resources" = [
      "${aws_dynamodb_table.users-table.arn}"
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

resource "aws_iam_role_policy" "IamForSwitchPlanLambda" {
  name = "${var.environment_name}IamForSwitchPlanLambda"
  role = "${aws_iam_role.IamForSwitchPlanLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForSwitchPlanLambda.json}"
}
