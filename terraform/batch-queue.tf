resource "aws_batch_job_queue" "video_transcoding_queue" {
  name = "${var.environment_name}_video_transcoding_queue"
  state = "ENABLED"
  priority = 1
  compute_environments = ["${aws_batch_compute_environment.batch_compute.arn}"]
}

resource "aws_batch_job_queue" "registration_plate_extraction_queue" {
  name = "${var.environment_name}_video_transcoding_queue"
  state = "ENABLED"
  priority = 2
  compute_environments = ["${aws_batch_compute_environment.batch_compute.arn}"]
}