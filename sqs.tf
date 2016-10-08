// SQS

resource "aws_sqs_queue" "video-loaded_queue" {
    name = "video-loaded-queue"
    message_retention_seconds = 86400 // 24 Hours
    receive_wait_time_seconds = 10
}