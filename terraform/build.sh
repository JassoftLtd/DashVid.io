#!/usr/bin/env bash
set -e

export GOPATH=$(pwd)/gopath

go get -u github.com/jonnyshaw89/terraform-s3-dir
go install github.com/jonnyshaw89/terraform-s3-dir

echo "Creating terraform s3 for website"

pushd ../../gh-release-ui

echo "Building UI"
npm install
npm run build

popd

websiteBucket=dashvid.io
$GOPATH/bin/terraform-s3-dir ../../gh-release-ui/build/ $TF_VAR_environment_name$websiteBucket aws_s3_bucket.dashvid-io-bucket > s3_dashvid-io.tf
