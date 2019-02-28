import SplashScreen from 'react-native-splash-screen'
import * as _ from 'lodash'
import api from '../../../api/api'
import { navigationService, pushService, tokenService } from '../../../services'
import { PAGES_NAMES } from '../../../navigation/pages'
import { setProfileInfo } from '../../../store/profile/actions'
import { setAvailableColors } from '../../../store/colors/actions'
import {
	fetchQuestionsSuccess,
	updateOnboardingConfig
} from '../../../store/onboarding/actions'
import configuredStore from '../../../store'

export const startup = () => async dispatch => {
	try {
		const userToken = await tokenService.getToken()
		if (userToken !== '') {
			const profileResponse = await api.fetchSelf()
			const availableColors = await api.getAvailableColors()
			const userInfoWithoutToken = _.omit(profileResponse, 'authToken')
			dispatch(setAvailableColors(availableColors))
			dispatch(setProfileInfo(userInfoWithoutToken))
			const destinationPageForUser = navigationService.getUserLandingPageBasedOnUserInfo(
				userInfoWithoutToken
			)
			let onboardingMaxSteps = 0
			let onboardingSteps = {}
			// fetch questions only if we are not suppose to be redirected to Home Page aka we need to stay in onboarding
			if (destinationPageForUser !== PAGES_NAMES.HOME_PAGE) {
				const availableQuestions = await api.fetchQuestions()
				const onboardingStepsConfig = navigationService.calculateOnboardingSteps(
					destinationPageForUser,
					availableQuestions
				)
				onboardingMaxSteps = onboardingStepsConfig.maxSteps
				onboardingSteps = onboardingStepsConfig.configurationPerPage
				dispatch(fetchQuestionsSuccess(availableQuestions))
				dispatch(updateOnboardingConfig(onboardingMaxSteps, onboardingSteps))
			}
			if (destinationPageForUser === PAGES_NAMES.HOME_PAGE) {
				pushService.initialize(
					configuredStore,
					userInfoWithoutToken.id.toString()
				)
			}
			navigationService.navigateAndResetNavigation(destinationPageForUser, {
				goBackArrowDisabled: true
			})
		}
	} catch (error) {
		navigationService.navigate(PAGES_NAMES.WELCOME_PAGE)
	} finally {
		SplashScreen.hide()
	}
}
