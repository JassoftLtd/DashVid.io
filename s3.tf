// S3

// Video Store
resource "aws_s3_bucket" "dash-cam-videos-bucket" {
    bucket = "dash-cam-videos"
    acl = "private"

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT","POST","GET","HEAD"]
        allowed_origins = ["*"]
    }

    lifecycle_rule {
        prefix = "/"
        enabled = true

        transition {
            days = 30
            storage_class = "STANDARD_IA"
        }
        expiration {
            days = 60
        }
    }

}

// Trigger UploadedVideo Lambda when ObjectCreated
resource "aws_s3_bucket_notification" "bucket_notification" {
    bucket = "${aws_s3_bucket.dash-cam-videos-bucket.id}"
    lambda_function {
        lambda_function_arn = "${aws_lambda_function.uploadedVideo.arn}"
        events = ["s3:ObjectCreated:*"]
    }
}

// UI
resource "aws_s3_bucket" "dashvid-io-bucket" {
    bucket = "dashvid.io"
    acl = "public-read"
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
      "Resource": "arn:aws:s3:::dashvid.io/*",
      "Principal": "*"
    }
  ]
}
EOF
    website {
        index_document = "index.html"
        routing_rules = "[{\"Condition\":{\"HttpErrorCodeReturnedEquals\":\"404\"},\"Redirect\":{\"ReplaceKeyPrefixWith\":\"#/\"}}]"

    }
}
