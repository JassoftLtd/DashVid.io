// S3

// Transcoded Video Store
resource "aws_s3_bucket" "dash-cam-videos-free-bucket-transcoded" {
  bucket              = "${var.environment_name}dash-cam-videos-free-transcoded"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = "/"
    enabled = true

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 60
    }
  }
}

resource "aws_s3_bucket" "dash-cam-videos-free-bucket-thumbnails" {
  bucket              = "${var.environment_name}dash-cam-videos-free-thumbnails"
  acl                 = "private"
  force_destroy       = "${var.bucket_force_destroy}"
  acceleration_status = "Enabled"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
  }

  lifecycle_rule {
    prefix  = "/"
    enabled = true

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 60
    }
  }
}
