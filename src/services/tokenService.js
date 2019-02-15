import * as Keychain from 'react-native-keychain'

export const setToken = async token => {
	try {
		await Keychain.resetGenericPassword()
		await Keychain.setGenericPassword('user', token)
		return { success: true }
	} catch (err) {
		return { success: false, error: err.toString() }
	}
}

export const getToken = async () => {
	try {
		const credentials = await Keychain.getGenericPassword()
		return credentials ? credentials.password : ''
	} catch (err) {
		return ''
	}
}

export const removeToken = async () => {
	await Keychain.resetGenericPassword()
}
