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

data "template_file" "init" {
    template = "${file("./UI/aws-config.tpl")}"

    vars {
        aws_region = "${var.aws_region}"
        identity_pool_id = "${var.aws_identity_pool}"
    }
}

resource "aws_s3_bucket_object" "object" {
    bucket = "dash-cam-ui"
    key = "aws-config.js"
    content = "${data.template_file.init.rendered}"
}