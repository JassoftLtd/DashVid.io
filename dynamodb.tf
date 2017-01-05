// DynamoDB

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
        name = "Key"
        type = "S"
    }
    global_secondary_index {
        name = "UserVideosByDate"
        hash_key = "User"
        range_key = "Uploaded"
        write_capacity = 1
        read_capacity = 1
        projection_type = "ALL"
    }
}
