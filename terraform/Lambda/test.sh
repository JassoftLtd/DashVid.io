#!/usr/bin/env bash
set -e

# Reduce npm logging
npm config set loglevel warn
npm install -g marked

for directory in $(find ./* -maxdepth 2 -name package.json); do
echo "Testing: " ${directory/package.json/}
 pushd ${directory/package.json/}
 npm install
 npm run lint
 npm test
 popd
done
