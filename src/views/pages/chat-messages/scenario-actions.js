import _ from 'lodash'
import moment from 'moment'
import I18n from '../../../../locales/i18n'
import api from '../../../api/api'
import { toastService } from '../../../services'
import {
	addNewMessageToChat,
	fetchChatDetailsFailure,
	fetchChatDetailsStarted,
	fetchChatDetailsSuccess,
	sendChatTextMessageFailure,
	sendChatTextMessageStarted,
	sendChatTextMessageSuccess
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
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_fetch_messages`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage)
		dispatch(fetchChatDetailsFailure(errorMessage))
	}
}

export const sendTextMessage = (chatId, text, successCallback) => async (
	dispatch,
	getState
) => {
	try {
		dispatch(sendChatTextMessageStarted())
		const sentMessage = await api.sendChatTextMessage(chatId, text)
		const currentLoggedUserId = getState().profile.id
		const currentChatMessages = getState().messages.currentChatDetails.messages
		const remappedNewMessage = remapNewMessageToChat(
			sentMessage,
			currentChatMessages,
			currentLoggedUserId
		)
		dispatch(addNewMessageToChat(remappedNewMessage, chatId))
		dispatch(sendChatTextMessageSuccess())
		successCallback()
	} catch (err) {
		dispatch(sendChatTextMessageFailure())
		const errorMessage = I18n.t('errors.chat_message_send_fail')
		toastService.showErrorToast(errorMessage, 'top')
	}
}

const remapNewMessageToChat = (
	newMessage,
	currentMessagesInChat,
	currentLoggedUserId
) => {
	const newMessageTemp = newMessage
	const previousMessageInChat =
		currentMessagesInChat.length > 0
			? _.cloneDeep(currentMessagesInChat[currentMessagesInChat.length - 1])
			: null
	if (previousMessageInChat) {
		previousMessageInChat.tempMoment = moment(previousMessageInChat.timestamp)
	}
	newMessageTemp.tempMoment = moment(newMessageTemp.timestamp)
	return remapSingleMessage(
		newMessageTemp,
		previousMessageInChat,
		null,
		currentLoggedUserId
	)
}

const remapSingleMessage = (
	message,
	prevMessage,
	nextMessage,
	currentLoggedUserId
) => {
	return {
		id: message.id,
		senderId: message.sender,
		ownedByLoggedUser: message.sender === currentLoggedUserId,
		text: message.text,
		timestamp: message.timestamp,
		isTheSameDayAsPrevious: prevMessage
			? prevMessage.tempMoment.dayOfYear() === message.tempMoment.dayOfYear()
			: true,
		nextMessageBelongsToTheSameUser: nextMessage
			? nextMessage.sender === message.sender
			: true
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
			return remapSingleMessage(
				message,
				prevMess,
				nextMess,
				currentLoggedUserId
			)
		}
	)
	remappedChatDetails.messages = remappedChatMessages
	return remappedChatDetails
}
