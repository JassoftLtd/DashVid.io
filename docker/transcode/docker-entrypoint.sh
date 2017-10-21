#!/usr/bin/env bash

# Download the Input File
aws s3 cp s3://$INPUT_BUCKET/$INPUT_FILE inputFile

# Transcode the video
transcode-video --target small --output outputFile inputFile

# Upload the output to Output bucket
aws s3 cp outputFile s3://$OUTPUT_BUCKET/$OUTPUT_FILE