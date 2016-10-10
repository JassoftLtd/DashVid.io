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
    website {
        index_document = "index.html"
    }
}

resource "aws_s3_bucket_object" "dash-cam-ui-content" {
    bucket = "${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
    key = "/"
    source = "UI"
}