// DynamoDB

resource "aws_dynamodb_table" "users-table" {
  name           = "Users"
  read_capacity  = 1
  write_capacity = 1
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
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "videos-table" {
  name           = "Videos"
  read_capacity  = 1
  write_capacity = 1
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
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["Id", "VideoStatus", "RecordedDay", "RecordedDate", "VideoDuration"]
  }
}

resource "aws_dynamodb_table" "subscriptions-table" {
  name           = "Subscriptions"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "User"

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
  read_capacity  = 1
  write_capacity = 1
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
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "CameraKey"
    hash_key        = "CameraKey"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "KEYS_ONLY"
  }
}
