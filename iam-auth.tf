// IAM for Authed User

resource "aws_iam_role_policy" "Cognito_LambdAuthAuth_Role_Cognito_LambdAuthAuth_Role" {
    name   = "Cognito_LambdAuthAuth_Role"
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
        "lambda:InvokeFunction"
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
        "Action": "s3:PutObject",
        "Resource": "arn:aws:s3:::${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
    }
  ]
}
POLICY
}