import _ from 'lodash'
import moment from 'moment'
import I18n from '../../../../locales/i18n'
import api from '../../../api/api'
import { toastService } from '../../../services'
import {
	fetchChatDetailsFailure,
	fetchChatDetailsStarted,
	fetchChatDetailsSuccess,
	markRoundChatAsRed
} from '../../../store/messages/actions'
import { getErrorDataFromNetworkException } from '../../../common/utils'

export const fetchChatDetails = chatId => async (dispatch, getState) => {
	try {
		const currentLoggedUserId = getState().profile.id
		dispatch(fetchChatDetailsStarted())
		const chatDetails = await api.getChatMessages(chatId)
		const remappedChatDetails = remapChatDetails(
			chatDetails,
			currentLoggedUserId
		)
		dispatch(fetchChatDetailsSuccess(remappedChatDetails))
		dispatch(markRoundChatAsRed(chatId))
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_fetch_messages`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage)
		dispatch(fetchChatDetailsFailure(errorMessage))
	}
}

const remapChatDetails = (chatDetails, currentLoggedUserId) => {
	const remappedChatDetails = {
		id: chatDetails.id,
		roundId: chatDetails.round,
		type: chatDetails.type,
		lastReadMessageId:
			chatDetails.chatusersSet.find(u => u.user.id === currentLoggedUserId)
				.lastRead || 0,
		users: chatDetails.chatusersSet.filter(
			u => u.user.id !== currentLoggedUserId
		),
		messages: []
	}
	const messagesSortedAscedingByDateTime = _.orderBy(
		chatDetails.messages,
		'timestamp',
		'asc'
	)
	const messagesSortedAscedingByDateTimeMomentObject = messagesSortedAscedingByDateTime.map(
		message => ({
			...message,
			tempMoment: moment(message.timestamp)
		})
	)
	const remappedChatMessages = messagesSortedAscedingByDateTimeMomentObject.map(
		(message, index) => {
			const prevMess =
				index - 1 >= 0
					? messagesSortedAscedingByDateTimeMomentObject[index - 1]
					: null
			const nextMess =
				index + 1 < messagesSortedAscedingByDateTimeMomentObject.length
					? messagesSortedAscedingByDateTimeMomentObject[index + 1]
					: null
			return {
				id: message.id,
				senderId: message.sender,
				ownedByLoggedUser: message.sender === currentLoggedUserId,
				text: message.text,
				timestamp: message.timestamp,
				isTheSameDayAsPrevious: prevMess
					? prevMess.tempMoment.dayOfYear() === message.tempMoment.dayOfYear()
					: true,
				nextMessageBelongsToTheSameUser: nextMess
					? nextMess.sender === message.sender
					: false
			}
		}
	)
	remappedChatDetails.messages = remappedChatMessages
	return remappedChatDetails
}
