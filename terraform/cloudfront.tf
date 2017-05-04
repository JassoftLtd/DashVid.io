// CloudFront
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
    comment = "Origin Access Identity for Website"
}

resource "aws_cloudfront_distribution" "website_s3_distribution" {
  depends_on = [
    "aws_s3_bucket.dashvid-io-bucket",
    "aws_cloudfront_origin_access_identity.origin_access_identity"
  ]
    origin {
        domain_name = "${aws_s3_bucket.dashvid-io-bucket.bucket}.s3.amazonaws.com"
        origin_id   = "S3Origin"
    }

    enabled             = true
    is_ipv6_enabled     = true
    comment             = "DashVid.io Website"
    default_root_object = "index.html"
    retain_on_delete = true

    aliases = ["${var.environment_subdomain}${var.domain_name}"]

    viewer_certificate {
      acm_certificate_arn = "${var.acm_certificate_arn}"
      ssl_support_method = "sni-only"
      minimum_protocol_version = "TLSv1"
    }

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = "myS3Origin"
        compress = true

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 86400
        default_ttl            = 86400
        max_ttl                = 86400
    }

    restrictions {
      geo_restriction {
        restriction_type = "none"
      }
    }

    custom_error_response {
      error_caching_min_ttl = 0
      error_code = 404
      response_code = 200
      response_page_path = "/index.html"
    }
}

resource "aws_cloudfront_distribution" "www-website_s3_distribution" {
  depends_on = [
    "aws_s3_bucket.www-dashvid-io-bucket",
    "aws_cloudfront_origin_access_identity.origin_access_identity"
  ]
  origin {
    domain_name = "${aws_s3_bucket.www-dashvid-io-bucket.bucket}.s3.amazonaws.com"
    origin_id   = "wwwS3Origin"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "DashVid.io Website"
  default_root_object = "index.html"
  retain_on_delete = true

  aliases = ["www.${var.environment_subdomain}${var.domain_name}"]

  viewer_certificate {
    acm_certificate_arn = "${var.acm_certificate_arn}"
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "myS3Origin"
    compress = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400
    default_ttl            = 86400
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}