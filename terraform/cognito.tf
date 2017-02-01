// Cognito
//
//resource "null_resource" "create-identitypool" {
//  provisioner "local-exec" {
//    command = "aws cognito-identity create-identity-pool --identity-pool-name DashCam --allow-unauthenticated-identities --developer-provider-name login.terraform.dashcam"
//  }
//}
//
//resource "null_resource" "create-identitypool-roles" {
//  provisioner "local-exec" {
//    command = "aws cognito-identity set-identity-pool-roles --identity-pool-id $IDENTITY_POOL_ID --roles unauthenticated=arn:aws:iam::${var.aws_account_id}:role/${aws_iam_role.Cognito_LambdAuthUnauth_Role},authenticated=arn:aws:iam::${var.aws_account_id}:role/${aws_iam_role.Cognito_LambdAuthAuth_Role} --region ${var.aws_region}"
//  }
//}