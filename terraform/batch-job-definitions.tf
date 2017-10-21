resource "aws_batch_job_definition" "Transcode" {
  name = "video-transcode"
  type = "container"
  container_properties = <<CONTAINER_PROPERTIES
{
    "image": "jassoftltd/video-transcode",
    "memory": 1024,
    "vcpus": 2,
    "environment": [
        {
          "name": "INPUT_BUCKET",
          "value": "$${INPUT_BUCKET}"
        },
        {
          "name": "INPUT_FILE",
          "value": "${INPUT_FILE}"
        },
        {
          "name": "OUTPUT_BUCKET",
          "value": "$${OUTPUT_BUCKET}"
        },
        {
          "name": "OUTPUT_FILE",
          "value": "${OUTPUT_FILE}"
        },
    ],
    "ulimits": [
      {
        "hardLimit": 1024,
        "name": "nofile",
        "softLimit": 1024
      }
    ]
}
CONTAINER_PROPERTIES
  parameters {
    INPUT_BUCKET = "${aws_s3_bucket.dash-cam-videos-bucket.bucket}"
    OUTPUT_BUCKET = "${aws_s3_bucket.dash-cam-videos-transcoded.bucket}"
  }
}