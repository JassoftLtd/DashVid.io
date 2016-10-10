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


resource "aws_iam_role" "Cognito_LambdAuthAuth_Role" {
  name = "Cognito_LambdAuthAuth_Role"
  assume_role_policy = "${file("./iam-data/Cognito_LambdAuthAuth_Role.json")}"
}

resource "aws_iam_role" "Cognito_LambdAuthUnauth_Role" {
  name = "Cognito_LambdAuthUnauth_Role"
  assume_role_policy = "${file("./iam-data/Cognito_LambdAuthUnauth_Role.json")}"
}

resource "aws_iam_role" "LambdAuthChangePassword" {
  name = "LambdAuthChangePassword"
  assume_role_policy = "${file("./iam-data/LambdAuthChangePassword.json")}"
}

resource "aws_iam_role" "LambdAuthCreateUser" {
  name = "LambdAuthCreateUser"
  assume_role_policy = "${file("./iam-data/LambdAuthCreateUser.json")}"
}

resource "aws_iam_role" "LambdAuthLogin" {
  name = "LambdAuthLogin"
  assume_role_policy = "${file("./iam-data/LambdAuthLogin.json")}"
}

resource "aws_iam_role" "LambdAuthLostPassword" {
  name = "LambdAuthLostPassword"
  assume_role_policy = "${file("./iam-data/LambdAuthLostPassword.json")}"
}

resource "aws_iam_role" "LambdAuthResetPassword" {
  name = "LambdAuthResetPassword"
  assume_role_policy = "${file("./iam-data/LambdAuthResetPassword.json")}"
}

resource "aws_iam_role" "LambdAuthVerifyUser" {
  name = "LambdAuthVerifyUser"
  assume_role_policy = "${file("./iam-data/LambdAuthVerifyUser.json")}"
}

resource "aws_iam_role" "trust_policy_cognito_auth" {
  name = "trust_policy_cognito_auth"
  assume_role_policy = "${file("./iam-data/trust_policy_cognito_auth.json")}"
}

resource "aws_iam_role" "trust_policy_cognito_unauth" {
  name = "trust_policy_cognito_unauth"
  assume_role_policy = "${file("./iam-data/trust_policy_cognito_unauth.json")}"
}

resource "aws_iam_role" "trust_policy_lambda" {
  name = "trust_policy_lambda"
  assume_role_policy = "${file("./iam-data/trust_policy_lambda.json")}"
}