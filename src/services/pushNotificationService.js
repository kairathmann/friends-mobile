import OneSignal from 'react-native-onesignal'
let reduxStore

export function register(store) {
	reduxStore = store
	// OneSignal.init('36289b9b-8fea-4e6c-a15b-d6052f144bfc')
	// OneSignal.setSubscription(true)
	// OneSignal.logoutEmail(() => {})
	// OneSignal.inFocusDisplaying(2)
	// OneSignal.addEventListener('received', onReceived)
	// OneSignal.addEventListener('opened', onOpened)
	// OneSignal.configure()
}

export function loginForNotifications(id) {
	OneSignal.setExternalUserId(id)
	OneSignal.logoutEmail(() => {})
}

export function logoutFromNotifications() {
	OneSignal.removeExternalUserId()
	OneSignal.logoutEmail(() => {})
}
