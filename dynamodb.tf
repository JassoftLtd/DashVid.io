// DynamoDB

resource "aws_dynamodb_table" "users-table" {
  name = "Users"
  read_capacity = 1
  write_capacity = 1
  hash_key = "email"
  attribute {
    name = "email"
    type = "S"
  }
}

resource "aws_dynamodb_table" "videos-table" {
    name = "Videos"
    read_capacity = 1
    write_capacity = 1
    hash_key = "Id"
    attribute {
        name = "Id"
        type = "S"
    }
    attribute {
        name = "User"
        type = "S"
    }
    attribute {
        name = "Uploaded"
        type = "S"
    }
    attribute {
        name = "VideoStatus"
        type = "S"
    }
    attribute {
        name = "Bucket"
        type = "S"
    }
    attribute {
        name = "Key"
        type = "S"
    }
    attribute {
        name = "VideoStatus"
        type = "S"
    }
    attribute {
        name = "RecordedDate"
        type = "S"
    }
    attribute {
        name = "VideoDuration"
        type = "N"
    }
    attribute {
        name = "MediaInfo"
        type = "s"
    }
    global_secondary_index {
        name = "UserVideosByDate"
        hash_key = "User"
        range_key = "RecordedDate"
        write_capacity = 1
        read_capacity = 1
        projection_type = "ALL"
    }
}

resource "aws_dynamodb_table" "subscriptions-table" {
  name = "Subscriptions"
  read_capacity = 1
  write_capacity = 1
  hash_key = "User"
  attribute {
    name = "User"
    type = "S"
  }
  attribute {
    name = "Plan"
    type = "S"
  }
  attribute {
    name = "PlanStatus"
    type = "S"
  }
  attribute {
    name = "SubscriptionTime"
    type = "S"
  }
  global_secondary_index {
    name = "SubscriptionStatusByDate"
    hash_key = "PlanStatus"
    range_key = "SubscriptionTime"
    write_capacity = 1
    read_capacity = 1
    projection_type = "ALL"
  }
}