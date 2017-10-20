// S3

// Video Store
resource "aws_s3_bucket" "dash-cam-videos-bucket" {
  bucket              = "${var.environment_name}dash-cam-videos"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = ""
    enabled = true

    tags {
      "plan" = "free"
    }

    expiration {
      days = 7
    }
  }

  lifecycle_rule {
    prefix  = ""
    enabled = true

    tags {
      "plan" = "standard"
    }

    expiration {
      days = 30
    }
  }
}

// Trigger Lambda when events
resource "aws_s3_bucket_notification" "videos_bucket_created_notification" {
  depends_on = ["aws_s3_bucket.dash-cam-videos-bucket"]
  bucket     = "${aws_s3_bucket.dash-cam-videos-bucket.id}"

  lambda_function {
    lambda_function_arn = "${aws_lambda_function.uploadedVideo.arn}"
    events              = ["s3:ObjectCreated:*"]
  }

  lambda_function {
    lambda_function_arn = "${aws_lambda_function.expiredVideo.arn}"
    events              = ["s3:ObjectRemoved:*"]
  }
}

// UI
resource "aws_s3_bucket" "dashvid-io-bucket" {
  bucket = "${var.environment_name}dashvid.io"
  acl    = "public-read"

  policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.environment_name}dashvid.io/*",
      "Principal": "*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
  }
}
