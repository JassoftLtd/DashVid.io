#!/usr/bin/env bash

terraform get

export GOPATH=$(pwd)/gopath

go get github.com/saymedia/terraform-s3-dir
go install github.com/saymedia/terraform-s3-dir

cd UI/www/
npm run build
cd ../../

$GOPATH/bin/terraform-s3-dir ./UI/www/build/ dashvid.io > s3_dashvid-io.tf

find ./Lambda/* -maxdepth 2 -name package.json -execdir npm install \;

cd Lambda/VideoLambdas/

rm *.zip

for f in $(ls); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done