// DynamoDB

resource "aws_dynamodb_table" "users-table" {
  name           = "Users"
  read_capacity  = "${var.users_table_read_capacity}"
  write_capacity = "${var.users_table_write_capacity}"
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "stripeCustomer"
    type = "S"
  }

  global_secondary_index {
    name            = "StripeCustomer"
    hash_key        = "stripeCustomer"
    read_capacity   = "${var.users_table_index_StripeCustomer_read_capacity}"
    write_capacity  = "${var.users_table_index_StripeCustomer_write_capacity}"
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "videos-table" {
  name           = "Videos"
  read_capacity  = "${var.videos_table_read_capacity}"
  write_capacity = "${var.videos_table_write_capacity}"
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "User"
    type = "S"
  }

  attribute {
    name = "RecordedDay"
    type = "N"
  }

  global_secondary_index {
    name               = "UserVideosByDay"
    hash_key           = "User"
    range_key          = "RecordedDay"
    read_capacity      = "${var.videos_table_index_UserVideosByDay_read_capacity}"
    write_capacity     = "${var.videos_table_index_UserVideosByDay_write_capacity}"
    projection_type    = "INCLUDE"
    non_key_attributes = ["Id", "RecordedDay", "RecordedDate", "VideoDuration"]
  }
}

resource "aws_dynamodb_table" "subscriptions-table" {
  name           = "Subscriptions"
  read_capacity  = "${var.subscriptions_table_read_capacity}"
  write_capacity = "${var.subscriptions_table_write_capacity}"
  hash_key       = "User"
  range_key      = "SubscriptionTime"

  attribute {
    name = "User"
    type = "S"
  }

  attribute {
    name = "SubscriptionTime"
    type = "N"
  }
}

resource "aws_dynamodb_table" "cameras-table" {
  name           = "Cameras"
  read_capacity  = "${var.cameras_table_read_capacity}"
  write_capacity = "${var.cameras_table_write_capacity}"
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "CameraKey"
    type = "S"
  }

  attribute {
    name = "User"
    type = "S"
  }

  global_secondary_index {
    name            = "UserCameras"
    hash_key        = "User"
    read_capacity   = "${var.cameras_table_index_UserCameras_read_capacity}"
    write_capacity  = "${var.cameras_table_index_UserCameras_write_capacity}"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "CameraKey"
    hash_key        = "CameraKey"
    read_capacity   = "${var.cameras_table_index_CameraKey_read_capacity}"
    write_capacity  = "${var.cameras_table_index_CameraKey_write_capacity}"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "shares-table" {
  name           = "Shares"
  read_capacity  = "${var.shares_table_read_capacity}"
  write_capacity = "${var.shares_table_write_capacity}"
  hash_key       = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "User"
    type = "S"
  }

  global_secondary_index {
    name               = "UserShared"
    hash_key           = "User"
    read_capacity      = "${var.shares_table_index_UserShared_read_capacity}"
    write_capacity     = "${var.shares_table_index_UserShared_write_capacity}"
    projection_type    = "INCLUDE"
    non_key_attributes = ["Id", "User", "Video"]
  }
}
