// IAM
# iam-data/Cognito_LambdAuthAuth_Role.json

resource "aws_iam_role" "IamForVideoLambda" {
  name = "iam_for_video_lambda"
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

resource "aws_iam_role" "Cognito_LambdAuthAuth" {
  name = "Cognito_LambdAuthAuth"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "Cognito_LambdAuthAuth" {
  name = "Cognito_LambdAuthAuth-policy"
  description = "Cognito_LambdAuthAuth policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement" : [
        {
            "Effect" : "Allow",
            "Action" : [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            "Resource" : [
                "*"
            ]
        },
        {
            "Effect" : "Allow",
            "Action" : [
                "lambda:InvokeFunction"
            ],
            "Resource" : [
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthCreateUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthVerifyUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthChangePassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthResetPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLogin"
            ]
        }
    ]
}

EOF
}

resource "aws_iam_role" "Cognito_LambdAuthUnauth" {
  name = "Cognito_LambdAuthUnauth"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "Cognito_LambdAuthUnauth" {
  name = "Cognito_LambdAuthUnauth-policy"
  description = "Cognito_LambdAuthUnauth policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "mobileanalytics:PutEvents",
                "cognito-sync:*"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthCreateUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthVerifyUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthResetPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLogin"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthChangePassword" {
  name = "LambdAuthChangePassword"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthChangePassword" {
  name = "LambdAuthChangePassword-policy"
  description = "LambdAuthChangePassword policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:UpdateItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthCreateUser" {
  name = "LambdAuthCreateUser"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthCreateUser" {
  name = "LambdAuthCreateUser-policy"
  description = "LambdAuthCreateUser policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:PutItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthLogin" {
  name = "LambdAuthLogin"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthLogin" {
  name = "LambdAuthLogin-policy"
  description = "LambdAuthLogin policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:GetItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-identity:GetOpenIdTokenForDeveloperIdentity"
            ],
            "Resource": "arn:aws:cognito-identity:${var.aws_region}:${var.aws_account_id}:identitypool/IDENTITY_POOL_ID"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthLostPassword" {
  name = "LambdAuthLostPassword"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthLostPassword" {
  name = "LambdAuthLostPassword-policy"
  description = "LambdAuthLostPassword policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
	      {
	          "Action": [
								"dynamodb:GetItem",
	              "dynamodb:UpdateItem"
	           ],
	          "Effect": "Allow",
	          "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
	      },
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthResetPassword" {
  name = "LambdAuthResetPassword"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthResetPassword" {
  name = "LambdAuthResetPassword-policy"
  description = "LambdAuthResetPassword policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:UpdateItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "LambdAuthVerifyUser" {
  name = "LambdAuthVerifyUser"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "LambdAuthVerifyUser" {
  name = "LambdAuthVerifyUser-policy"
  description = "LambdAuthVerifyUser policy"
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:UpdateItem"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.users-table.name}"
        },
        {
            "Sid": "",
            "Resource": "*",
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role" "trust_policy_cognito_auth" {
  name = "trust_policy_cognito_auth-policy"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "IDENTITY_POOL_ID"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role" "trust_policy_cognito_unauth" {
  name = "trust_policy_cognito_unauth-policy"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "IDENTITY_POOL_ID"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF
}

resource "aws_iam_role" "trust_policy_lambda" {
  name = "trust_policy_lambda-policy"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}
