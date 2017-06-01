// S3

// Transcoded Video Store
resource "aws_s3_bucket" "dash-cam-videos-transcoded" {
  bucket              = "${var.environment_name}dash-cam-videos-transcoded"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = ""
    enabled = true

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}

resource "aws_s3_bucket" "dash-cam-videos-thumbnails" {
  bucket              = "${var.environment_name}dash-cam-videos-thumbnails"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = ""
    enabled = true

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}
