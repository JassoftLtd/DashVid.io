// IAM
# iam-data/Cognito_Auth_Role.json

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

resource "aws_iam_role" "Cognito_Auth" {
  name = "Cognito_Auth"
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

resource "aws_iam_policy" "Cognito_Auth" {
  name = "Cognito_Auth-policy"
  description = "Cognito_Auth policy"
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
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:CreateUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:VerifyUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:ChangePassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LostUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LostPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:ResetPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:Login"
            ]
        }
    ]
}

EOF
}

resource "aws_iam_role" "Cognito_Unauth" {
  name = "Cognito_Unauth"
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

resource "aws_iam_policy" "Cognito_Unauth" {
  name = "Cognito_Unauth-policy"
  description = "Cognito_Unauth policy"
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
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:CreateUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:VerifyUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LostUser",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LostPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:ResetPassword",
                "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:Login"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role" "ChangePassword" {
  name = "ChangePassword"
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

resource "aws_iam_policy" "ChangePassword" {
  name = "ChangePassword-policy"
  description = "ChangePassword policy"
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

resource "aws_iam_role" "CreateUser" {
  name = "CreateUser"
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

resource "aws_iam_policy" "CreateUser" {
  name = "CreateUser-policy"
  description = "CreateUser policy"
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

resource "aws_iam_role" "Login" {
  name = "Login"
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

resource "aws_iam_policy" "Login" {
  name = "Login-policy"
  description = "Login policy"
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
            "Resource": "arn:aws:cognito-identity:${var.aws_region}:${var.aws_account_id}:identitypool/${var.aws_identity_pool}"
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

resource "aws_iam_role" "LostPassword" {
  name = "LostPassword"
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

resource "aws_iam_policy" "LostPassword" {
  name = "LostPassword-policy"
  description = "LostPassword policy"
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

resource "aws_iam_role" "ResetPassword" {
  name = "ResetPassword"
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

resource "aws_iam_policy" "ResetPassword" {
  name = "ResetPassword-policy"
  description = "ResetPassword policy"
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

resource "aws_iam_role" "VerifyUser" {
  name = "VerifyUser"
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

resource "aws_iam_policy" "VerifyUser" {
  name = "VerifyUser-policy"
  description = "VerifyUser policy"
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
          "cognito-identity.amazonaws.com:aud": "${var.aws_identity_pool}"
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
          "cognito-identity.amazonaws.com:aud": "${var.aws_identity_pool}"
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
