import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
let reduxStore

export function register(store) {
	reduxStore = store
	OneSignal.init(Config.APP_ONESIGNAL_TOKEN)
	OneSignal.logoutEmail(() => {})
	OneSignal.inFocusDisplaying(2)
	OneSignal.configure()
}

export function loginForNotifications(id) {
	OneSignal.setExternalUserId(id)
	OneSignal.logoutEmail(() => {})
}

export function logoutFromNotifications() {
	OneSignal.removeExternalUserId()
	OneSignal.logoutEmail(() => {})
}
