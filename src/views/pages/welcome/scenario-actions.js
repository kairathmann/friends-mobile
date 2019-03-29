import SplashScreen from 'react-native-splash-screen'
import _ from 'lodash'
import { selfRequest, colorsRequest } from '../../../api'
import { navigationService, tokenService } from '../../../services'
import { PAGES_NAMES } from '../../../navigation/pages'
import { setProfileInfo } from '../../../store/profile/actions'
import { setAvailableColors } from '../../../store/colors/actions'
import { updateOnboardingConfig } from '../../../store/onboarding/actions'

export const startup = () => async dispatch => {
	try {
		const userToken = await tokenService.getToken()
		if (userToken !== '') {
			const profileResponse = await selfRequest.fetchSelf()
			const availableColors = await colorsRequest.getAvailableColors()
			const userInfoWithoutToken = _.omit(profileResponse, 'authToken')
			dispatch(setAvailableColors(availableColors))
			dispatch(setProfileInfo(userInfoWithoutToken))
			const destinationPageForUser = navigationService.getUserLandingPageBasedOnUserInfo(
				userInfoWithoutToken
			)
			let onboardingMaxSteps = 0
			let onboardingSteps = {}
			if (destinationPageForUser !== PAGES_NAMES.HOME_PAGE) {
				const onboardingStepsConfig = navigationService.calculateOnboardingSteps(
					destinationPageForUser,
					false
				)
				onboardingMaxSteps = onboardingStepsConfig.maxSteps
				onboardingSteps = onboardingStepsConfig.configurationPerPage
				dispatch(updateOnboardingConfig(onboardingMaxSteps, onboardingSteps))
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
