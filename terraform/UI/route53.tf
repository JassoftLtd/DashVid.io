resource "aws_route53_record" "DashCamWeb" {
  zone_id = "${var.dns_zone_id}"
  name    = "${var.environment_subdomain}${var.dns_zone_name}"
  type    = "CNAME"
  ttl     = "60"
  records = ["${aws_s3_bucket.dashvid-io-bucket.website_endpoint}"]
}