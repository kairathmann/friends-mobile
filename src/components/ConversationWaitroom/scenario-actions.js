import moment from 'moment'
import api from '../../api/api'
import { showErrorToast } from '../../services/toastService'
import {
	fetchChatsFailure,
	fetchChatsStarted,
	fetchChatsSuccess
} from '../../store/messages/actions'
import I18n from '../../../locales/i18n'
import { DEFAULT_EMOJIS } from '../../enums'

export function fetchChats(round) {
	return async (dispatch, getState) => {
		try {
			const colors = getState().colors.colors
			const defaultColor = colors[0]
			const profile = getState().profile
			dispatch(fetchChatsStarted(round))
			const result =
				typeof round !== 'undefined'
					? await api.fetchRoundChats(round)
					: await api.fetchPastChats()
			dispatch(fetchChatsSuccess(remapChats(result, profile.id, defaultColor)))
		} catch (err) {
			let errorMessage =
				err.response && err.response.status === 404
					? I18n.t(`errors.${err.response.data}`)
					: I18n.t('errors.cannot_fetch_chats')
			dispatch(fetchChatsFailure(err))
			showErrorToast(errorMessage)
		}
	}
}

function remapChats(chats, profileId, defaultColor) {
	const chatsWithAtLeastTwoUsers = chats.filter(
		chat =>
			chat.chatusersSet.length >= 2 &&
			chat.chatusersSet.filter(member => member.user.id !== profileId).length >=
				1
	)
	const now = moment().toISOString()
	return chatsWithAtLeastTwoUsers.map(chat => {
		const partner = chat.chatusersSet.filter(u => u.user.id !== profileId)
		return {
			type: chat.type,
			id: chat.id,
			roundId: chat.round || '',
			partnerName: partner[0].user.firstName,
			partnerColor: partner[0].user.color || defaultColor,
			partnerEmoji: partner[0].user.emoji || DEFAULT_EMOJIS[0],
			lastMessage: chat.lastMessage.text || '',
			lastRead: chat.lastMessage.timestamp || now,
			unread: chat.unreadMessages[profileId],
			feedback: {
				show: false,
				given: false
			}
		}
	})
}
