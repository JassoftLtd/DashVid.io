// IAM

// addCard
data "aws_iam_policy_document" "IamForAddCardLambda" {
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
