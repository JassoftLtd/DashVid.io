resource "aws_kms_key" "lambda_variables" {
  description = "KMS for Lambda Variables"
}

resource "aws_kms_alias" "lambda_variables" {
  name          = "alias/dashvid/lambda"
  target_key_id = "${aws_kms_key.lambda_variables.key_id}"
}
