import { logOutUserAndClearData } from '../store/global/actions'
import { navigationService, tokenService } from '../services'
import { PAGES_NAMES } from '../navigation/pages'

export const logOutUser = () => async dispatch => {
	await tokenService.removeToken()
	navigationService.navigateAndResetNavigation(PAGES_NAMES.WELCOME_PAGE)
	dispatch(logOutUserAndClearData())
}
