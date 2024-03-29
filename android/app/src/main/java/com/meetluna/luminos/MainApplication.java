package com.meetluna.luminos;

import android.app.Application;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import com.facebook.react.ReactApplication;
import com.oblador.keychain.KeychainPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.reactnative.camera.RNCameraPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new KeychainPackage(),
                new ReactVideoPackage(),
                new RNFetchBlobPackage(),
                new RNCameraPackage(),
                new SvgPackage(),
                new RNGestureHandlerPackage(),
                new ReactNativeOneSignalPackage(),
                new SplashScreenReactPackage(),
                new RNLanguagesPackage(),
                new RNI18nPackage(),
                new ReactNativeConfigPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
