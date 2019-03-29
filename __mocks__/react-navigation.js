import React from 'react'

jest.mock('react-navigation', () => {
	return {
		createAppContainer: () => {
			return ''
		},
		createStackNavigator: () => {
			return ''
		},
		createDrawerNavigator: () => {
			return ''
		},
		createBottomTabNavigator: () => '',
		Header: {
			HEIGHT: 100
		},
		withNavigation: () => {},
		SafeAreaView: props => <mock-component {...props} />
	}
})
