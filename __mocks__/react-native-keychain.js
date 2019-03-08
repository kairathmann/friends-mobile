jest.mock('react-native-keychain', () => {
	return {
		SECURITY_LEVEL_ANY: true
	}
})
