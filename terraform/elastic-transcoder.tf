resource "aws_elastictranscoder_pipeline" "free" {
  input_bucket = "${aws_s3_bucket.dash-cam-videos-free-bucket.bucket}"
  name         = "DashVid.io_Free_Plan"
  role         = "${aws_iam_role.IamForVideoTranscoder.arn}"

  content_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-free-bucket-transcoded.bucket}"
    storage_class = "Standard"
  }

  thumbnail_config = {
    bucket        = "${aws_s3_bucket.dash-cam-videos-free-bucket-thumbnails.bucket}"
    storage_class = "Standard"
  }
}

resource "aws_elastictranscoder_preset" "free" {
  container   = "fmp4"
  description = "Free Plan Transcoded Videos"
  name        = "Free_Plan_Preset"

  video = {
    bit_rate             = "1600"
    codec                = "H.264"
    display_aspect_ratio = "auto"
    fixed_gop            = "false"
    frame_rate           = "auto"
    max_frame_rate       = "30"
    keyframes_max_dist   = 240
    max_height           = "auto"
    max_width            = "auto"
    padding_policy       = "Pad"
    sizing_policy        = "Fit"
  }

  video_codec_options = {
    Profile                  = "main"
    Level                    = "2.2"
    MaxReferenceFrames       = 3
    InterlaceMode            = "Progressive"
    ColorSpaceConversionMode = "None"
  }

  video_watermarks = {
    id                = "${var.application_name}"
    max_width         = "20%"
    max_height        = "20%"
    sizing_policy     = "ShrinkToFit"
    horizontal_align  = "Right"
    horizontal_offset = "10px"
    vertical_align    = "Bottom"
    vertical_offset   = "10px"
    opacity           = "55.5"
    target            = "Content"
  }

  thumbnails = {
    format         = "png"
    interval       = 10
    max_width      = "auto"
    max_height     = "auto"
    padding_policy = "Pad"
    sizing_policy  = "Fit"
  }
}