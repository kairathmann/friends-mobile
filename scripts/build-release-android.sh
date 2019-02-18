#!/usr/bin/env bash

set -ex

export ENVFILE=.env.production
pushd android
./gradlew --info assembleRelease
popd
mkdir -p ./dist
rm -f ./dist/luminos-android-release.apk
cp ./android/app/build/outputs/apk/release/app-release.apk ./dist/luminos-android-release.apk
