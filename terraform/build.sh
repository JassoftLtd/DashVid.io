#!/usr/bin/env bash
set -e

#terraform get -update

export GOPATH=$(pwd)/gopath

go get -u github.com/jonnyshaw89/terraform-s3-dir
go install github.com/jonnyshaw89/terraform-s3-dir

#go get -u github.com/saymedia/terraform-s3-dir
#go install github.com/saymedia/terraform-s3-dir

cd UI/www/
echo "Building UI"
npm install
npm run build
cd ../../

websiteBucket=dashvid.io

$GOPATH/bin/terraform-s3-dir ./UI/www/build/ $TF_VAR_environment_name$websiteBucket aws_s3_bucket.dashvid-io-bucket > s3_dashvid-io.tf

find ./Lambda/* -maxdepth 2 -name package.json -execdir npm install \;

cd Lambda/AuthLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done

cd ../../Lambda/VideoLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done

cd ../../Lambda/SubscriptionLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done