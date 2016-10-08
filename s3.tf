// S3

resource "aws_s3_bucket" "b" {
    bucket = "dash-cam-videos"
    acl = "private"
}