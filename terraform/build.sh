#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn
npm install -g marked

pushd Lambda


for directory in $(ls -d */ | sed 's#/##'); do
  echo "Building: $directory"
  pushd $directory

  rm -f *.zip || true

  for f in $(ls -d */ | sed 's#/##'); do
    echo "Building $f"
    pushd $f
    npm install
    popd
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
  done

  popd
done

popd

export GOPATH=$(pwd)/gopath

go get -u github.com/jonnyshaw89/terraform-s3-dir
go install github.com/jonnyshaw89/terraform-s3-dir

echo "Creating terraform s3 for website"

websiteBucket=dashvid.io
$GOPATH/bin/terraform-s3-dir ../../build/ $TF_VAR_environment_name$websiteBucket aws_s3_bucket.dashvid-io-bucket > s3_dashvid-io.tf
