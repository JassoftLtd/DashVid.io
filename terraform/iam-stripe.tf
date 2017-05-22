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
      "dynamodb:Query",
    ],
    "resources" = [
      "${aws_dynamodb_table.users-table.arn}/index/StripeCustomer"
    ]
  }

  "statement" = {
    "effect" = "Allow",
    "actions" = [
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
}

resource "aws_iam_role_policy" "IamForStripeWebhookLambda" {
  name = "${var.environment_name}IamForStripeWebhookLambda"
  role = "${aws_iam_role.IamForStripeWebhookLambda.id}"
  policy = "${data.aws_iam_policy_document.IamForStripeWebhookLambda.json}"
}
