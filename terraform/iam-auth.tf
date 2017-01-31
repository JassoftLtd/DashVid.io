resource "aws_iam_role" "Cognito_LambdAuthAuth_Role" {
    name               = "${var.environment_name}Cognito_LambdAuthAuth_Role"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "Cognito_LambdAuthUnauth_Role" {
    name               = "${var.environment_name}Cognito_LambdAuthUnauth_Role"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthChangePassword" {
    name               = "${var.environment_name}LambdAuthChangePassword"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthCreateUser" {
    name               = "${var.environment_name}LambdAuthCreateUser"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthLogin" {
    name               = "${var.environment_name}LambdAuthLogin"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthLostPassword" {
    name               = "${var.environment_name}LambdAuthLostPassword"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthResetPassword" {
    name               = "${var.environment_name}LambdAuthResetPassword"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

resource "aws_iam_role" "LambdAuthVerifyUser" {
    name               = "${var.environment_name}LambdAuthVerifyUser"
    path               = "/"
    assume_role_policy = <<POLICY
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
POLICY
}

// Do i still need these as im now going through API Gateway
resource "aws_iam_role_policy" "Cognito_LambdAuthAuth_Role_Cognito_LambdAuthAuth_Role" {
    name   = "${var.environment_name}Cognito_LambdAuthAuth_Role"
    role   = "Cognito_LambdAuthAuth_Role"
    policy = <<POLICY
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
        "lambda:InvokeFunction",
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthCreateUser",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthVerifyUser",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthChangePassword",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostUser",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLostPassword",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthResetPassword",
        "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:LambdAuthLogin"
      ]
    },
    {
        "Effect": "Allow",
        "Action": [
            "execute-api:Invoke"
        ],
        "Resource": [
            "*"
        ]
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy" "Cognito_LambdAuthUnauth_Role_Cognito_LambdAuthUnauth_Role" {
    name   = "${var.environment_name}Cognito_LambdAuthUnauth_Role"
    role   = "Cognito_LambdAuthUnauth_Role"
    policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:getCredentialsForIdentity"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction",
        "iam:PassRole"
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthChangePassword_LambdAuthChangePassword" {
    name   = "${var.environment_name}LambdAuthChangePassword"
    role   = "LambdAuthChangePassword"
    policy = <<POLICY
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthCreateUser_LambdAuthCreateUser" {
    name   = "${var.environment_name}LambdAuthCreateUser"
    role   = "LambdAuthCreateUser"
    policy = <<POLICY
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
      "Action": [
        "dynamodb:PutItem"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/${aws_dynamodb_table.subscriptions-table.name}"
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthLogin_LambdAuthLogin" {
    name   = "${var.environment_name}LambdAuthLogin"
    role   = "LambdAuthLogin"
    policy = <<POLICY
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthLostPassword_LambdAuthLostPassword" {
    name   = "${var.environment_name}LambdAuthLostPassword"
    role   = "LambdAuthLostPassword"
    policy = <<POLICY
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthResetPassword_LambdAuthResetPassword" {
    name   = "${var.environment_name}LambdAuthResetPassword"
    role   = "LambdAuthResetPassword"
    policy = <<POLICY
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
POLICY
}

resource "aws_iam_role_policy" "LambdAuthVerifyUser_LambdAuthVerifyUser" {
    name   = "${var.environment_name}LambdAuthVerifyUser"
    role   = "LambdAuthVerifyUser"
    policy = <<POLICY
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
POLICY
}

