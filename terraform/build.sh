#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn

#terraform get -update

for directory in $(find ./Lambda/* -maxdepth 2 -name package.json); do
echo "Testing: " ${directory/package.json/}
 pushd ${directory/package.json/}
 npm install
 npm run lint
 npm test
 popd
done

cd Lambda/AuthLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/VideoLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/SubscriptionLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/PlanLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done

cd ../../Lambda/StripeLambdas/

rm *.zip || true

for f in $(ls -d */ | cut -f1 -d'/'); do
    echo "Zipping $f"
    zip -q -9 -r $f.zip $f/*
done