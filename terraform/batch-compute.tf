resource "aws_batch_compute_environment" "batch_compute" {
  compute_environment_name = "Dashvid"

  compute_resources {
    bid_percentage = "30"
    instance_role  = "${aws_iam_instance_profile.batch_compute_ecs_instance_role.arn}"

    instance_type = [
      "c4.xlarge",
    ]

    max_vcpus = 256
    min_vcpus = 0

    security_group_ids = [
      "${aws_security_group.batch_compute.id}",
    ]

    subnets = [
      "${aws_subnet.batch_compute.id}",
    ]

    type                = "SPOT"
    spot_iam_fleet_role = "${aws_iam_role.spot_iam_fleet_role.arn}"
  }

  service_role = "${aws_iam_role.aws_batch_service_role.arn}"
  type         = "MANAGED"
  depends_on   = ["aws_iam_role_policy_attachment.ecs_instance_role"]
}

resource "aws_iam_role" "spot_iam_fleet_role" {
  name = "${var.environment_name}spot_iam_fleet_role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "batch.amazonaws.com"
        }
    }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "spot_iam_fleet_role" {
  role       = "${aws_iam_role.spot_iam_fleet_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2SpotFleetTaggingRole"
}


resource "aws_iam_instance_profile" "batch_compute_ecs_instance_role" {
  name = "${var.environment_name}batch_compute_ecs_instance_role"
  role = "${aws_iam_role.batch_compute_ecs_instance_role.name}"
}

resource "aws_iam_role" "batch_compute_ecs_instance_role" {
  name = "${var.environment_name}batch_compute_ecs_instance_role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "ec2.amazonaws.com"
        }
    }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role" {
  role       = "${aws_iam_role.batch_compute_ecs_instance_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_security_group" "batch_compute" {
  name = "aws_batch_compute_environment_security_group"
  vpc_id = "${aws_vpc.batch_compute.id}"
}

resource "aws_vpc" "batch_compute" {
  cidr_block = "10.1.0.0/16"
  tags {
    Name  = "DashVid Batch VPC"
  }
}

resource "aws_subnet" "batch_compute" {
  vpc_id     = "${aws_vpc.batch_compute.id}"
  cidr_block = "10.1.1.0/24"
}

resource "aws_iam_role" "aws_batch_service_role" {
  name = "${var.environment_name}aws_batch_service_role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
        "Service": "batch.amazonaws.com"
        }
    }
    ]
}
EOF
}

data "aws_iam_policy_document" "aws_batch_service" {
  "statement" = {
    "effect" = "Allow"

    "actions" = [
      "logs:*",
      "ecs:*",
      "ec2:*",
      "iam:GetInstanceProfile",
    ]

    "resources" = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "IamFor_aws_batch_service_role" {
  name   = "${var.environment_name}IamFor_aws_batch_service_role"
  role   = "${aws_iam_role.aws_batch_service_role.id}"
  policy = "${data.aws_iam_policy_document.aws_batch_service.json}"
}
