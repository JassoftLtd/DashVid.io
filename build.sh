#!/usr/bin/env bash

terraform get -update

export GOPATH=$(pwd)/gopath

go get github.com/saymedia/terraform-s3-dir
go install github.com/saymedia/terraform-s3-dir

$GOPATH/bin/terraform-s3-dir ./UI/www/ dash-cam-ui > s3_dash-cam-ui.tf

cd Lambda/VideoLambdas/

rm *.zip

for f in $(ls); do
    zip -9 $f.zip $f/*
done