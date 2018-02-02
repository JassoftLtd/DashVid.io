#!/usr/bin/env bash

echo "Input Bucket $INPUT_BUCKET"
echo "Input File $INPUT_FILE"

echo "Output Bucket $OUTPUT_BUCKET"
echo "Output File $OUTPUT_FILE"

# Download the Input File
aws s3 cp s3://$INPUT_BUCKET/$INPUT_FILE inputFile.mp4

# Convert the video
convert-video inputFile.mp4

# Transcode the video
transcode-video --target small --output outputFile.mkv inputFile.mp4

# Upload the output to Output bucket
aws s3 cp outputFile.mkv s3://$OUTPUT_BUCKET/$OUTPUT_FILE