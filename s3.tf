// S3

// Video Store
resource "aws_s3_bucket" "dash-cam-videos-bucket" {
    bucket = "dash-cam-videos"
    acl = "private"
}

// UI
resource "aws_s3_bucket" "dash-cam-ui-bucket" {
    bucket = "dash-cam-ui"
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
      "Resource": "arn:aws:s3:::dash-cam-ui/*",
      "Principal": "*"
    }
  ]
}
EOF
    website {
        index_document = "index.html"
    }
}