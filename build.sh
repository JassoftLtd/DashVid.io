#!/usr/bin/env bash
set -e

terraform get -update

export GOPATH=$(pwd)/gopath

go get -u github.com/saymedia/terraform-s3-dir
go install github.com/saymedia/terraform-s3-dir

cd UI/www/
echo "Building UI"
npm run build
cd ../../

$GOPATH/bin/terraform-s3-dir ./UI/www/build/ dashvid.io > s3_dashvid-io.tf

for f in $(find ./Lambda/* -maxdepth 2 -name package.json -printf '%h\n'); do
    echo "Building $f"
    npm install $f
done

cd Lambda/AuthLambdas/

rm *.zip

for f in $(ls); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done

cd ../../Lambda/VideoLambdas/

rm *.zip

for f in $(ls); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done

cd ../../Lambda/SubscriptionLambdas/

rm *.zip

for f in $(ls); do
    echo "Zipping $f"
    zip -9 -r $f.zip $f/*
done