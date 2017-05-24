// Lambda

// Camera GET
resource "aws_lambda_function" "getCameras" {
  filename         = "Lambda/CameraLambdas/getCameras.zip"
  function_name    = "getCameras"
  role             = "${aws_iam_role.IamForGetCamerasLambda.arn}"
  handler          = "getCameras.handler"
  runtime          = "nodejs6.10"
  timeout          = "30"
  memory_size      = "256"
  source_code_hash = "${base64sha256(file("Lambda/CameraLambdas/getCameras.zip"))}"
}
