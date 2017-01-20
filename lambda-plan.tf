// Lambda

// PlanSignup
resource "aws_lambda_function" "planSignup" {
  filename = "Lambda/PlanLambdas/planSignup.zip"
  function_name = "planSignup"
  role = "${aws_iam_role.IamForPlanSignupLambda.arn}"
  handler = "planSignup.handler"
  runtime = "nodejs4.3"
  timeout = "30"
  source_code_hash = "${base64sha256(file("Lambda/PlanLambdas/planSignup.zip"))}"
  environment {
    variables = {
      go_cardless_api = "${var.go_cardless_api}"
      go_cardless_access_token = "${var.go_cardless_api_key}"
    }
  }
}