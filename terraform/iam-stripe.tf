// IAM

// Stripe Webhook
resource "aws_iam_role" "IamForStripeWebhookLambda" {
  name = "${var.environment_name}iam_for_stripe_webhook_lambda"
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

data "aws_iam_policy_document" "IamForStripeWebhookLambda" {
  "statement" = {
    "effect" = "Allow",
    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem"
    ],
    "resources" = [
      "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
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

resource "aws_iam_role_policy" "IamForStripeWebhookLambda" {
  name = "${var.environment_name}IamForStripeWebhookLambda"
  role = "${aws_iam_role.IamForStripeWebhookLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForStripeWebhookLambda.json}"
}
