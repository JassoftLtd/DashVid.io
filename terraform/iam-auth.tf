resource "aws_iam_role" "Cognito_LambdAuthAuth_Role" {
  name = "${var.environment_name}Cognito_LambdAuthAuth_Role"

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
  name = "${var.environment_name}Cognito_LambdAuthUnauth_Role"

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
  name = "${var.environment_name}LambdAuthChangePassword"

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
  name = "${var.environment_name}LambdAuthCreateUser"

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
  name = "${var.environment_name}LambdAuthLogin"

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

resource "aws_iam_role" "LambdAuthLoginCameraKey" {
  name = "${var.environment_name}LambdAuthLoginCameraKey"

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
  name = "${var.environment_name}LambdAuthLostPassword"

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
  name = "${var.environment_name}LambdAuthResetPassword"

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
  name = "${var.environment_name}LambdAuthVerifyUser"

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

data "aws_iam_policy_document" "Cognito_LambdAuthAuth_Role" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "execute-api:Invoke",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "Cognito_LambdAuthAuth_Role" {
  name = "${var.environment_name}Cognito_LambdAuthAuth_Role"
  role = "${aws_iam_role.Cognito_LambdAuthAuth_Role.name}"
  policy = "${data.aws_iam_policy_document.Cognito_LambdAuthAuth_Role.json}"
}

data "aws_iam_policy_document" "Cognito_LambdAuthUnauth_Role" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "cognito-identity:getCredentialsForIdentity",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "Cognito_LambdAuthUnauth_Role" {
  name = "${var.environment_name}Cognito_LambdAuthUnauth_Role"
  role = "${aws_iam_role.Cognito_LambdAuthUnauth_Role.name}"
  policy = "${data.aws_iam_policy_document.Cognito_LambdAuthUnauth_Role.json}"
}

data "aws_iam_policy_document" "LambdAuthChangePassword" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthChangePassword" {
  name = "${var.environment_name}LambdAuthChangePassword"
  role = "${aws_iam_role.LambdAuthChangePassword.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthChangePassword.json}"
}


data "aws_iam_policy_document" "LambdAuthCreateUser" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:PutItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
      "${aws_dynamodb_table.subscriptions-table.arn}",
      "${aws_dynamodb_table.cameras-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthCreateUser" {
  name   = "${var.environment_name}LambdAuthCreateUser"
  role   = "${aws_iam_role.LambdAuthCreateUser.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthCreateUser.json}"
}

data "aws_iam_policy_document" "LambdAuthLogin" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "cognito-identity:GetOpenIdTokenForDeveloperIdentity",
    ]

    "resources" = [
      "arn:aws:cognito-identity:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identitypool/${var.aws_identity_pool}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthLogin" {
  name = "${var.environment_name}LambdAuthLogin"
  role = "${aws_iam_role.LambdAuthLogin.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthLogin.json}"
}

data "aws_iam_policy_document" "LambdAuthLoginCameraKey" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:Query",
    ]

    "resources" = [
      "${aws_dynamodb_table.cameras-table.arn}/index/CameraKey",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "cognito-identity:GetOpenIdTokenForDeveloperIdentity",
    ]

    "resources" = [
      "arn:aws:cognito-identity:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identitypool/${var.aws_identity_pool}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthLoginCameraKey" {
  name = "${var.environment_name}LambdAuthLoginCameraKey"
  role = "${aws_iam_role.LambdAuthLoginCameraKey.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthLoginCameraKey.json}"
}

data "aws_iam_policy_document" "LambdAuthLostPassword" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthLostPassword" {
  name = "${var.environment_name}LambdAuthLostPassword"
  role = "${aws_iam_role.LambdAuthLostPassword.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthLostPassword.json}"
}

data "aws_iam_policy_document" "LambdAuthResetPassword" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthResetPassword" {
  name = "${var.environment_name}LambdAuthResetPassword"
  role = "${aws_iam_role.LambdAuthResetPassword.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthResetPassword.json}"
}

data "aws_iam_policy_document" "LambdAuthVerifyUser" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
    ]

    "resources" = [
      "${aws_dynamodb_table.users-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "dynamodb:Query",
    ]

    "resources" = [
      "${aws_dynamodb_table.subscriptions-table.arn}",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    "resources" = [
      "*",
    ]
  }

  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "LambdAuthVerifyUser" {
  name = "${var.environment_name}LambdAuthVerifyUser"
  role = "${aws_iam_role.LambdAuthVerifyUser.name}"
  policy = "${data.aws_iam_policy_document.LambdAuthVerifyUser.json}"
}
