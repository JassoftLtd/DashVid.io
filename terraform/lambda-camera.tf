// Lambda

// Camera GET
resource "aws_lambda_function" "getCameras" {
  depends_on = [
    "aws_iam_role_policy.IamForGetCamerasLambda",
  ]

  filename         = "PackagedLambdas/getCameras.zip"
  function_name    = "getCameras"
  role             = "${aws_iam_role.IamForGetCamerasLambda.arn}"
  handler          = "getCameras.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("PackagedLambdas/getCameras.zip"))}"
  kms_key_arn      = "${aws_kms_key.lambda_variables.arn}"

  tracing_config {
    mode = "Active"
  }
}
