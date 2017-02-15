#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn

#terraform get -update

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