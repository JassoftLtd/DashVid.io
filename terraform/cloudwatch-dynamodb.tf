// Videos
resource "aws_cloudwatch_metric_alarm" "dynamodb-videos-consumed-read" {
  alarm_name = "${var.environment_name}dynamodb-videos-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedReadCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.videos-table.read_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.videos-table.name} is consuming 80% of its provisioned read capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.videos-table.name}"
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb-videos-consumed-write" {
  alarm_name = "${var.environment_name}dynamodb-videos-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedWriteCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.videos-table.write_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.videos-table.name} is consuming 80% of its provisioned write capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.videos-table.name}"
  }
}

// Users
resource "aws_cloudwatch_metric_alarm" "dynamodb-users-consumed-read" {
  alarm_name = "${var.environment_name}dynamodb-users-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedReadCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.users-table.read_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.users-table.name} is consuming 80% of its provisioned read capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.users-table.name}"
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb-users-consumed-write" {
  alarm_name = "${var.environment_name}dynamodb-users-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedWriteCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.users-table.write_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.users-table.name} is consuming 80% of its provisioned write capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.users-table.name}"
  }
}

// Subscriptions
resource "aws_cloudwatch_metric_alarm" "dynamodb-subscriptions-consumed-read" {
  alarm_name = "${var.environment_name}dynamodb-subscriptions-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedReadCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.subscriptions-table.read_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.subscriptions-table.name} is consuming 80% of its provisioned read capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.subscriptions-table.name}"
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb-subscriptions-consumed-write" {
  alarm_name = "${var.environment_name}dynamodb-subscriptions-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedWriteCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.subscriptions-table.write_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.subscriptions-table.name} is consuming 80% of its provisioned write capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.subscriptions-table.name}"
  }
}

// Cameras
resource "aws_cloudwatch_metric_alarm" "dynamodb-cameras-consumed-read" {
  alarm_name = "${var.environment_name}dynamodb-cameras-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedReadCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.cameras-table.read_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.cameras-table.name} is consuming 80% of its provisioned read capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.cameras-table.name}"
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb-cameras-consumed-write" {
  alarm_name = "${var.environment_name}dynamodb-cameras-consumed-read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1"
  metric_name = "ConsumedWriteCapacityUnits"
  namespace = "AWS/DynamoDB"
  period = "60"
  statistic = "Maximum"
  threshold = "${aws_dynamodb_table.cameras-table.write_capacity * 0.8}"
  treat_missing_data = "notBreaching"
  alarm_description = "DynamoDB table ${aws_dynamodb_table.cameras-table.name} is consuming 80% of its provisioned write capacity"
  alarm_actions       = ["${aws_sns_topic.slack_alert.arn}"]
  dimensions {
    TableName = "${aws_dynamodb_table.cameras-table.name}"
  }
}
