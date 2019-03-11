import api from '../../../api/api'
import { getErrorDataFromNetworkException } from '../../../common/utils'
import { PAGES_NAMES } from '../../../navigation/pages'
import { navigate } from '../../../services/navigationService'
import { showErrorToast } from '../../../services/toastService'
import {
	uploadInfoFailure,
	uploadInfoStart,
	uploadInfoSuccess
} from '../../../store/onboarding/actions'
import { setProfileInfo } from '../../../store/profile/actions'
import { hideSpinner, showSpinner } from '../../../store/global/actions'

export const updateUserProfile = ({
	name,
	location,
	color,
	emoji
}) => async dispatch => {
	try {
		dispatch(showSpinner())
		dispatch(uploadInfoStart())
		await api.uploadBaseInfo({
			name,
			location,
			color: color.id,
			emoji
		})
		dispatch(
			setProfileInfo({
				latestLocation: location,
				firstName: name,
				color,
				emoji
			})
		)
		dispatch(uploadInfoSuccess())
		navigate(PAGES_NAMES.HOME_PAGE)
	} catch (err) {
		const error = getErrorDataFromNetworkException(err)
		dispatch(uploadInfoFailure(error))
		showErrorToast(error)
	} finally {
		dispatch(hideSpinner())
	}
}
