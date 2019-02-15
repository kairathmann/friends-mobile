import SplashScreen from 'react-native-splash-screen'
import * as _ from 'lodash'
import api from '../../../api/api'
import { navigationService, tokenService } from '../../../services'
import { PAGES_NAMES } from '../../../navigation/pages'
import { setProfileInfo } from '../../../store/profile/actions'
import { setAvailableColors } from '../../../store/colors/actions'

export const startup = () => async dispatch => {
	try {
		const userToken = await tokenService.getToken()
		if (userToken !== '') {
			const profileResponse = await api.fetchSelf()
			const availableColors = await api.getAvailableColors()
			const userInfoWithoutToken = _.omit(profileResponse, 'authToken')
			dispatch(setAvailableColors(availableColors))
			dispatch(setProfileInfo(userInfoWithoutToken))
			let questionsToAnswer = []
			// only send extra request for questions if user has filled basic info already
			if (
				userInfoWithoutToken.firstName !== '' &&
				userInfoWithoutToken.city !== ''
			) {
				questionsToAnswer = await api.fetchQuestions()
			}
			const destinationPageForUser = navigationService.getUserLandingPageBasedOnUserInfo(
				userInfoWithoutToken,
				questionsToAnswer
			)
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
