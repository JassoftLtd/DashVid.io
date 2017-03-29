resource "aws_route53_record" "DashCamWeb" {
  zone_id = "${var.dns_zone_id}"
  name    = "${var.environment_subdomain}${var.dns_zone_name}"
  type    = "A"
  alias {
    name                   = "${aws_cloudfront_distribution.website_s3_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.website_s3_distribution.hosted_zone_id}"
    evaluate_target_health = true
  }
}