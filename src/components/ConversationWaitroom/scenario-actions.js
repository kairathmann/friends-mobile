import api from '../../api/api'
import { chatsService, toastService } from '../../services'
import {
	fetchChatsFailure,
	fetchChatsStarted,
	fetchChatsSuccess
} from '../../store/messages/actions'
import I18n from '../../../locales/i18n'

export function fetchChats() {
	return async (dispatch, getState) => {
		try {
			const colors = getState().colors.colors
			const defaultColor = colors[0]
			const profile = getState().profile
			dispatch(fetchChatsStarted())
			const result = await api.fetchChats()
			const remappedChats = chatsService.remapChats(
				result,
				profile.id,
				defaultColor
			)
			dispatch(fetchChatsSuccess(remappedChats))
		} catch (err) {
			let errorMessage =
				err.response && err.response.status === 404
					? I18n.t(`errors.${err.response.data}`)
					: I18n.t('errors.cannot_fetch_chats')
			dispatch(fetchChatsFailure(err))
			toastService.showErrorToast(errorMessage)
		}
	}
}
