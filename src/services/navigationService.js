import { NavigationActions, StackActions } from 'react-navigation'
import { PAGES_NAMES } from '../navigation/pages'

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

export const getUserLandingPageBasedOnUserInfo = (
	userInfo,
	questionsLeftToAnswers
) => {
	if (!userInfo.color) {
		return PAGES_NAMES.IDENTIFICATION_PAGE
	}
	if (userInfo.firstName === '' && userInfo.city === '') {
		return PAGES_NAMES.BASEINFO_PAGE
	}
	if (questionsLeftToAnswers.length > 0) {
		return PAGES_NAMES.QUESTIONS_BEFORE_PAGE
	}
	if (questionsLeftToAnswers.length === 0) {
		return PAGES_NAMES.HOME_PAGE
	}
}
