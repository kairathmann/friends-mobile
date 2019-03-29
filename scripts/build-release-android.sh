#!/usr/bin/env bash

set -ex

export ENVFILE=.env.production
pushd android
./gradlew --info assembleRelease
popd
mkdir -p ./dist
rm -f ./dist/luminos-android-arm64-v8a-release.apk
rm -f ./dist/luminos-android-armeabi-v7a-release.apk
rm -f ./dist/luminos-android-x86-release.apk
rm -f ./dist/luminos-android-x86_64-release.apk
cp ./android/app/build/outputs/apk/release/app-arm64-v8a-release.apk ./dist/luminos-android-arm64-v8a-release.apk
cp ./android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk ./dist/luminos-android-armeabi-v7a-release.apk
cp ./android/app/build/outputs/apk/release/app-x86-release.apk ./dist/luminos-android-x86-release.apk
cp ./android/app/build/outputs/apk/release/app-x86_64-release.apk ./dist/luminos-android-x86_64-release.apk