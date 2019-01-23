/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { COLORS } from '../styles'
import WelcomePage from '../views/pages/welcome/welcome-page'
import PolicyPage from '../views/pages/policy/policy-page'
import TermsPage from '../views/pages/terms/terms-page'

const PAGES_NAMES = {
	WELCOME_PAGE: 'WELCOME_PAGE',
	POLICY: 'POLICY',
	TERMS: 'TERMS'
}

const AppStackNavigator = createStackNavigator({
	WELCOME_PAGE: {
		screen: WelcomePage,
		navigationOptions: () => ({
			header: null
		})
	},
	POLICY: {
		screen: PolicyPage,
		navigationOptions: () => ({
			headerTintColor: 'white',
			headerStyle: { backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR }
		})
	},
	TERMS: {
		screen: TermsPage,
		navigationOptions: () => ({
			headerTintColor: 'white',
			headerStyle: { backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR }
		})
	}
})

const AppNavigator = createAppContainer(AppStackNavigator)

const AppStackNavigatorWithGlobalSupport = () => <AppNavigator />

export { AppStackNavigatorWithGlobalSupport, PAGES_NAMES }
