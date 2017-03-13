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

resource "aws_iam_role_policy" "IamForGetPlanLambda" {
  name = "${var.environment_name}IamForGetPlanLambda"
  role = "${aws_iam_role.IamForGetPlanLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForGetPlanLambda.json}"
}
