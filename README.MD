# Luminos mobile

This Git repository hosts mobile application codebase for Luminos ([backend repository](https://github.com/lunalabs/friends-backend)).

## Requirements:  
1. `node >=8.15.0`
2. `npm >=6.4.1` 
3. Account at `Mapbox` with Geocoding service enabled
4. `Java JDK 1.8`
5. `Android Studio` for building and launching app on your Android device / emulator
6. `XCode 10+` for building and launching app on your IOS device / emulator

## Optional Requirements ( necessary to run `startupy.py` helper ):

1. `python >= 3.7`
2. `pip3`

## Setup Android device for development purposes

1. Navigate to:
  1. Settings
  2. System
  3. About phone
2. Tap seven times on `Build number`/`Kernel version`
3. Navigate back, to go `Developer options`
4. Turn on `USB Debugging` under `Debugging` section
5. ( Optonal for convenience ) Turn on `Stay awake` option ( Screen will never sleep while charging)
6. ( Optonal for convenience ) Turn on Default USB Configuration - File Transfer

For more information, please visit [Android developers' user guide site](https://developer.android.com/studio/debug/dev-options)

## Launching dev build on Android (steps for Mac and Linux) with setup script: 

We highly suggest using `startup.py` helper script that establishes workplace ( type `python3 startup.py -h` to check available arguments passed to script)

On local machine:

1. Run `npm ci`
2. Set `JAVA_HOME` enviromental variable to be equal to path of JDK installation folder on your machine
3. Set `ANDROID_HOME` enviromental variable to be equal to path of Android SDK installation folder on your machine
4. Append `$ANDROID_HOME/tools` and `$ANDROID_HOME/platform-tools` to your `PATH` enviromental variable
5. Now you should be able to run `adb` commands. Try `adb devices` to see if any output comes out
6. Connect your device via USB, enable `USB debugging` and check if `adb devices` shows your device
7. Change `APP_ONESIGNAL_TOKEN` in `.env.development` to ID of your application in One Signal
8. Change `APP_MAPBOX_KEY` in `.env.development` to API Key used to communicate with MapBox
9. Run `pip3 install -r requirements-development.txt`
10. Run `python3 startup.py <path_to_terminal_executable>` while device is connected to your machine

## Launching dev build on Android (steps for Mac and Linux) without setup script:

1. Run `npm ci`
2. Set `JAVA_HOME` enviromental variable to be equal to path of JDK installation folder on your machine
3. Set `ANDROID_HOME` enviromental variable to be equal to path of Android SDK installation folder on your machine
4. Append `$ANDROID_HOME/tools` and `$ANDROID_HOME/platform-tools` to your `PATH` enviromental variable
5. Now you should be able to run `adb` commands. Try `adb devices` to see if any output comes out
6. Connect your device via USB, enable `USB debugging` and check if `adb devices` shows your device
7. Change `APP_AXIOS_BASE_URL=` in `.env.development` to IP address of your machine running the backend, for example: `APP_AXIOS_BASE_URL=http://192.168.0.1:8000/api/v1/`
8. Change `APP_ONESIGNAL_TOKEN` in `.env.development` to ID of your application in One Signal
9. Change `APP_MAPBOX_KEY` in `.env.development` to API Key used to communicate with MapBox
10. Execute `npm run android-dev` while device is connected to your machine

If you want to enable live reload ( reload application when making changes on source files ), do following steps ( on Android ):

1. Launch dev build on mobile device
2. Enter `adb shell input keyevent 82` at your local machine console, it will trigger developer options modal
3. Select `Enable Live Reload`

## Launching dev build on IOS (steps for Mac):

1. Run `npm ci`
2. Change `APP_AXIOS_BASE_URL=` in `.env.development` to IP address of your machine running the backend, for example: `APP_AXIOS_BASE_URL=http://192.168.0.1:8000/api/v1/`
3. Change `APP_ONESIGNAL_TOKEN` in `.env.development` to ID of your application in One Signal
4. Change `APP_MAPBOX_KEY` in `.env.development` to API Key used to communicate with MapBox
5. Launch XCode project (`ios/luminosmobile.xcodeproj`)
6. Setup `Signing configuration` in XCode project settings
7. Connect your device / use emulator
8. Select `Dev` scheme in XCode and Run it

If you want to enable live reload ( reload application when making changes on source files ), do following steps ( on IOS ):

1. Launch dev build on mobile device
2. Shake your device or in case of emulator use `Hardware` -> `Shake gesture`, it will trigger developer options modal
3. Select `Enable Live Reload`

## Debugging

Tool worth installing is [react-native-debugger](https://github.com/jhen0409/react-native-debugger) to simplify debugging process

In order to enable debugging:

1. Luanch dev version of application on your device of choice
2. Launch `React Native Debugger`, separate window with chrome-like dev tools should pop up 
3. Bring `developer options modal` on your device / emulator
4. Tap on `Debug JS Remotely`
5. `React Native debugger` will start handling the Java Script.

## Upgrading React-Native version

Due to fact that react native is in state of constant flux, we suggest monitoring changes at [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) and manually applying them based on diff comparsion between react native versions.

## Building prod version for Android
1. Change `APP_AXIOS_BASE_URL=` in `.env.production` to IP address of your production server running the backend, for example: `APP_AXIOS_BASE_URL=https//www.production.com/api/v1/`
2. Change `APP_ONESIGNAL_TOKEN` in `.env.production` to ID of your production application in One Signal
3. Change `APP_MAPBOX_KEY` in `.env.production` to production API Key used to communicate with MapBox
4. Generate keystore file containing your singing key, more at https://facebook.github.io/react-native/docs/signed-apk-android
5. Copy your keystore file to `android/app` directory
6. Edit `android/app/build.gradle` following section:  
```
    signingConfigs {
        release {
            storeFile file("android.jks")
            storePassword System.getenv("LUNA_KEYSTORE_PASSWORD")
            keyAlias "lunaconferenceandroidkey"
            keyPassword System.getenv("LUNA_KEYSTORE_KEY_PASSWORD")
        }
    }
```
7. `storeFile` is a path to your keystore file, relative to location of `build.gradle`
8. `storePassword` is a password for accessing your key store file (you will need to enter it during keystore generation)
9. `keyAlias` is a alias to your private key inside keystore (you will need to enter it during keystore generation)
10. `keyPassword` is a password to key specified by `keyAlias` (you will need to enter it during keystore generation)
11. Change bundle ids and package names to your own custom ones.
12. Run `npm run build-release-android`
13. Production APK files are located in `dist` directory
14. There are 4 APK files, each per CPU architecture in order to reduce download size. You need to upload all of them to Google Store

## Building prod version for IOS
1. Change `APP_AXIOS_BASE_URL=` in `.env.production` to IP address of your production server running the backend, for example: `APP_AXIOS_BASE_URL=https//www.production.com/api/v1/`
2. Change `APP_ONESIGNAL_TOKEN` in `.env.production` to ID of your production application in One Signal
3. Change `APP_MAPBOX_KEY` in `.env.production` to production API Key used to communicate with MapBox
4. Launch XCode project (`ios/luminosmobile.xcodeproj`)
5. Setup `Signing configuration` in XCode project settings
6. Change bundle identifier to your own custom one
7. Select `Production` scheme for `Generic IOS Device`
8. `Product` -> `Archive`

## Push notifications not working on Android devices
Some Android devices manufacturers are force killing the apps when they are closed by user, ultimately blocking any notifications from being delivered. More info can be found below with steps how to disable that optimization:  
https://onesignal.com/blog/manufacturers-interfere-with-reliable-notifications/