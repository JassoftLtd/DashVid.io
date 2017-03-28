#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn
npm install -g marked

#terraform get -update

export GOPATH=$(pwd)/gopath

go get -u github.com/jonnyshaw89/terraform-s3-dir
go install github.com/jonnyshaw89/terraform-s3-dir

#go get -u github.com/saymedia/terraform-s3-dir
#go install github.com/saymedia/terraform-s3-dir

cd www/
echo "Building UI"
npm install
npm run build
cd ../

websiteBucket=dashvid.io

$GOPATH/bin/terraform-s3-dir ./www/build/ $TF_VAR_environment_name$websiteBucket aws_s3_bucket.dashvid-io-bucket > s3_dashvid-io.tf
