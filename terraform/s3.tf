// S3

// Video Store
resource "aws_s3_bucket" "dash-cam-videos-free-bucket" {
    bucket = "${var.environment_name}dash-cam-videos-free"
    acl = "private"
    force_destroy = "${var.bucket_force_destroy}"
    acceleration_status = "Enabled"


    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT","POST","GET","HEAD"]
        allowed_origins = ["*"]
    }

    lifecycle_rule {
        prefix = "/"
        enabled = true

        expiration {
            days = 7
        }
    }
}

// Video Store
resource "aws_s3_bucket" "dash-cam-videos-standard-bucket" {
    bucket = "${var.environment_name}dash-cam-videos-standard"
    acl = "private"
    force_destroy = "${var.bucket_force_destroy}"
    acceleration_status = "Enabled"

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT","POST","GET","HEAD"]
        allowed_origins = ["*"]
    }

    lifecycle_rule {
        prefix = "/"
        enabled = true

        expiration {
            days = 30
        }
    }
}

// Trigger Lambda when events
resource "aws_s3_bucket_notification" "free_bucket_created_notification" {
    depends_on = ["aws_s3_bucket.dash-cam-videos-free-bucket"]
    bucket = "${aws_s3_bucket.dash-cam-videos-free-bucket.id}"
    lambda_function {
        lambda_function_arn = "${aws_lambda_function.uploadedVideo.arn}"
        events = ["s3:ObjectCreated:*"]
    }
    lambda_function {
        lambda_function_arn = "${aws_lambda_function.expiredVideo.arn}"
        events = ["s3:ObjectRemoved:*"]
    }
}
resource "aws_s3_bucket_notification" "standard_bucket_created_notification" {
    depends_on = ["aws_s3_bucket.dash-cam-videos-standard-bucket"]
    bucket = "${aws_s3_bucket.dash-cam-videos-standard-bucket.id}"
    lambda_function {
        lambda_function_arn = "${aws_lambda_function.uploadedVideo.arn}"
        events = ["s3:ObjectCreated:*"]
    }
    lambda_function {
        lambda_function_arn = "${aws_lambda_function.expiredVideo.arn}"
        events = ["s3:ObjectRemoved:*"]
    }
}