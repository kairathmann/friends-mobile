jest.mock('react-moment-proptypes', () => {
	return {
		momentString: {
			isRequired: true
		}
	}
})
