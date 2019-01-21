jest.mock('react-native-languages', () => {
	return {
		language: 'en-US',
		addEventListener: jest.fn()
	}
})
