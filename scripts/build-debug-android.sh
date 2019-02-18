#!/usr/bin/env bash

set -ex

react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/debug
pushd android
./gradlew assembleDebug
popd
mkdir -p ./dist
rm -f ./dist/luminos-android-debug.apk
cp ./android/app/build/outputs/apk/debug/app-debug.apk ./dist/luminos-android-debug.apk
