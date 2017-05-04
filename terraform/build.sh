#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn
npm install -g marked

for directory in $(find ./Lambda/* -maxdepth 2 -name package.json); do
echo "Testing: " ${directory/package.json/}
 pushd ${directory/package.json/}
 npm install
 npm run lint
 npm test
 popd
done

cd Lambda/AuthLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/VideoLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/SubscriptionLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/PlanLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/StripeLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/TranscodingLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/CameraLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/SlackLambdas/

rm -f *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../

export GOPATH=$(pwd)/gopath

go get -u github.com/jonnyshaw89/terraform-s3-dir
go install github.com/jonnyshaw89/terraform-s3-dir

cd UI/www/
echo "Building UI"
echo "Environment variables in use:"
env | grep REACT_APP
npm install
npm run build
cd ../../

echo "Creating terraform s3 for website"

websiteBucket=dashvid.io
$GOPATH/bin/terraform-s3-dir ./UI/www/build/ $TF_VAR_environment_name$websiteBucket aws_s3_bucket.dashvid-io-bucket > s3_dashvid-io.tf
