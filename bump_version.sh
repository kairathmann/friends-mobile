#!/bin/bash
if [ -z "$1" ]
then echo "Version argument required."; exit 1;
fi

ANDROID_FILE='./android/app/build.gradle'
IOS_FILE='./ios/luminosmobile/Info.plist'
IOS_ONESIGNAL_FILE='./ios/OneSignalNotificationServiceExtension/Info.plist'

LINE_VERSION_CODE_ANDROID=$(egrep -n 'versionCode \d+' $ANDROID_FILE | cut -d : -f 1)
LINE_VERSION_NAME_ANDROID=$(egrep -n 'versionName \"\d(\.\d+)*\"' $ANDROID_FILE | cut -d : -f 1)
LINE_VERSION_CODE_IOS=$(($(egrep -n '<key>CFBundleVersion</key>' $IOS_FILE | cut -d : -f 1) + 1))
LINE_VERSION_NAME_IOS=$(($(egrep -n '<key>CFBundleShortVersionString</key>' $IOS_FILE | cut -d : -f 1) + 1))
LINE_VERSION_CODE_IOS_ONESIGNAL=$(($(egrep -n '<key>CFBundleVersion</key>' $IOS_ONESIGNAL_FILE | cut -d : -f 1) + 1))
LINE_VERSION_NAME_IOS_ONESIGNAL=$(($(egrep -n '<key>CFBundleShortVersionString</key>' $IOS_ONESIGNAL_FILE | cut -d : -f 1) + 1))
VERSION_CODE_ANDROID=$(sed $LINE_VERSION_CODE_ANDROID!d $ANDROID_FILE | egrep -o '\d+')
VERSION_CODE_IOS=$(sed $LINE_VERSION_CODE_IOS!d $IOS_FILE | egrep -o '\d+')
VERSION_CODE_IOS_ONESIGNAL=$(sed $LINE_VERSION_CODE_IOS_ONESIGNAL!d $IOS_ONESIGNAL_FILE | egrep -o '\d+')
MAX_VERSION_CODE_1=$((VERSION_CODE_ANDROID > VERSION_CODE_IOS ? VERSION_CODE_ANDROID : VERSION_CODE_IOS))
MAX_VERSION_CODE_2=$((VERSION_CODE_IOS_ONESIGNAL > MAX_VERSION_CODE_1 ? VERSION_CODE_IOS_ONESIGNAL : MAX_VERSION_CODE_1))
BUMPED_VERSION_CODE=$((MAX_VERSION_CODE_2 + 1))
sed -i '' "${LINE_VERSION_CODE_ANDROID}s/[0-9][0-9]*/$BUMPED_VERSION_CODE/" $ANDROID_FILE
sed -i '' "${LINE_VERSION_NAME_ANDROID}s/[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*/$1/" $ANDROID_FILE
sed -i '' "${LINE_VERSION_CODE_IOS}s/[0-9][0-9]*/$BUMPED_VERSION_CODE/" $IOS_FILE
sed -i '' "${LINE_VERSION_NAME_IOS}s/[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*/$1/" $IOS_FILE
sed -i '' "${LINE_VERSION_CODE_IOS_ONESIGNAL}s/[0-9][0-9]*/$BUMPED_VERSION_CODE/" $IOS_ONESIGNAL_FILE
sed -i '' "${LINE_VERSION_NAME_IOS_ONESIGNAL}s/[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*/$1/" $IOS_ONESIGNAL_FILE
