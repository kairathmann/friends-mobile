import { Platform } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { PAGES_NAMES } from '../navigation/pages'
import { ONBOARDING_STEPS_PER_LANDING_PAGE_CONFIGURAION } from '../enums'

let _navigator

export const setTopLevelNavigator = navigatorRef => {
	_navigator = navigatorRef
}

export const dispatch = action => {
	_navigator.dispatch(action)
}

export const navigateAndResetNavigation = (routeName, params) => {
	const resetAction = StackActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName: routeName, params })]
	})
	_navigator.dispatch(resetAction)
}

export const navigate = (routeName, params) => {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	)
}

export const replace = (routeName, params) => {
	_navigator.dispatch(StackActions.replace({ routeName, params }))
}

export const goBack = () => {
	_navigator.dispatch(NavigationActions.back())
}

export const getUserLandingPageBasedOnUserInfo = userInfo => {
	if (!userInfo.color || userInfo.emoji === '') {
		return PAGES_NAMES.IDENTIFICATION_PAGE
	}
	if (userInfo.firstName === '' && userInfo.latestLocation.name === '') {
		return PAGES_NAMES.BASEINFO_PAGE
	}
	return PAGES_NAMES.HOME_PAGE
}

export const getCurrentPage = () => {
	const currentRoutes = _navigator.state.nav.routes
	return currentRoutes.length > 0
		? currentRoutes[currentRoutes.length - 1].routeName
		: ''
}

export const calculateOnboardingSteps = (
	desiredLandingPage,
	comingFromOnboarding
) => {
	if (desiredLandingPage !== PAGES_NAMES.HOME_PAGE) {
		// if there are no questions to answer then don't count `Questions Before Page` as we don't want to show it
		const remainingOnboardingPageCount = {
			[PAGES_NAMES.IDENTIFICATION_PAGE]: 3,
			[PAGES_NAMES.BASEINFO_PAGE]: 2
		}
		const reamingPages = remainingOnboardingPageCount[desiredLandingPage] || 4
		// On Android we are skipping request push notifications permissions page so decrease by 1
		const totalOnboardingSteps =
			reamingPages +
			(Platform.OS === 'android' ? -1 : 0) +
			(comingFromOnboarding ? 1 : 0)
		const configurationPerOS =
			ONBOARDING_STEPS_PER_LANDING_PAGE_CONFIGURAION[Platform.OS] ||
			ONBOARDING_STEPS_PER_LANDING_PAGE_CONFIGURAION['android']
		const configurationPerLandingPage =
			configurationPerOS[desiredLandingPage] ||
			configurationPerOS[PAGES_NAMES.IDENTIFICATION_PAGE]
		return {
			configurationPerPage: configurationPerLandingPage,
			maxSteps: totalOnboardingSteps
		}
	}
	return {
		configurationPerPage:
			ONBOARDING_STEPS_PER_LANDING_PAGE_CONFIGURAION['android'][
				PAGES_NAMES.IDENTIFICATION_PAGE
			],
		maxSteps: 0
	}
}
