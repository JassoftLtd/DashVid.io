// SNS

// User Verified
resource "aws_sns_topic" "user_verified" {
    name = "user-verified-topic"
    display_name = "User Verified"
}

// New Video
resource "aws_sns_topic" "new_video" {
    name = "new-video-topic"
    display_name = "New Video"
}

resource "aws_sns_topic_subscription" "new_video_lambda_transcode_video" {
    topic_arn = "${aws_sns_topic.new_video.arn}"
    protocol  = "lambda"
    endpoint  = "${aws_lambda_function.transcodeVideo.arn}"
}

// Video Transcoded
resource "aws_sns_topic" "video_transcoded" {
    name = "video-transcoded-topic"
    display_name = "Video Transcoded"
}

resource "aws_sns_topic_subscription" "video_transcoded_lambda_video_transcoded" {
    topic_arn = "${aws_sns_topic.video_transcoded.arn}"
    protocol  = "lambda"
    endpoint  = "${aws_lambda_function.videoTranscoded.arn}"
}