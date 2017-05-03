resource "aws_route53_record" "DashCamAPI" {
  zone_id = "${var.dns_zone_id}"

  name = "${aws_api_gateway_domain_name.DashCamAPI.domain_name}"
  type = "A"

  alias {
    name                   = "${aws_api_gateway_domain_name.DashCamAPI.cloudfront_domain_name}"
    zone_id                = "${aws_api_gateway_domain_name.DashCamAPI.cloudfront_zone_id}"
    evaluate_target_health = true
  }
}