import _ from 'lodash'
import moment from 'moment'
import { Answers } from 'react-native-fabric'
import I18n from '../../../../locales/i18n'
import api from '../../../api/api'
import { navigationService, toastService } from '../../../services'
import {
	addNewMessageToChat,
	addNewMessageToChatFromPushNotificationClearUnread,
	addNewMessageToChatFromPushNotificationIncrementUnread,
	fetchChatDetailsFailure,
	fetchChatDetailsLatestMessagesWithCleanHistorySuccess,
	fetchChatDetailsMissingMessagesSuccess,
	fetchChatDetailsPreviousMessagesSuccess,
	fetchChatDetailsStarted,
	sendChatTextMessageFailure,
	sendChatTextMessageStarted,
	sendChatTextMessageSuccess,
	switchChat
} from '../../../store/messages/actions'
import { getErrorDataFromNetworkException } from '../../../common/utils'
import { PAGES_NAMES } from '../../../navigation/pages'

export const switchChatInstance = chatId => dispatch =>
	dispatch(switchChat(chatId))

export const fetchChatDetailsLatestCleanHistory = chatId => async (
	dispatch,
	getState
) => {
	try {
		const currentLoggedUserId = getState().profile.id
		dispatch(fetchChatDetailsStarted())
		const chatDetails = await api.getChatMessages(chatId)
		const remappedChatDetails = remapChatDetails(
			chatDetails,
			currentLoggedUserId
		)
		dispatch(
			fetchChatDetailsLatestMessagesWithCleanHistorySuccess(remappedChatDetails)
		)
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_fetch_messages`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage)
		dispatch(fetchChatDetailsFailure(errorMessage))
	}
}

export const fetchChatDetailsPreviousMessages = chatId => async (
	dispatch,
	getState
) => {
	try {
		const currentLoggedUserId = getState().profile.id
		const currentMessagesInChat = getState().messages.chatsHistory[chatId]
			.messages
		const lastMessageId =
			currentMessagesInChat.length > 0
				? currentMessagesInChat[currentMessagesInChat.length - 1].id
				: null
		dispatch(fetchChatDetailsStarted())
		const chatDetails = await api.getChatMessages(chatId, { lastMessageId })
		const remappedChatDetails = remapChatDetails(
			chatDetails,
			currentLoggedUserId
		)
		dispatch(fetchChatDetailsPreviousMessagesSuccess(remappedChatDetails))
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_fetch_messages`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage)
		dispatch(fetchChatDetailsFailure(errorMessage))
	}
}

export const fetchChatDetailsMissingMessages = chatId => async (
	dispatch,
	getState
) => {
	try {
		const currentLoggedUserId = getState().profile.id
		const currentMessagesInChat = getState().messages.chatsHistory[chatId]
			.messages
		const mostRecentMessageId =
			currentMessagesInChat.length > 0 ? currentMessagesInChat[0].id : null
		dispatch(fetchChatDetailsStarted())
		const chatDetails = await api.getChatMessages(chatId, {
			untilMessageId: mostRecentMessageId
		})
		const remappedChatDetails = remapChatDetails(
			chatDetails,
			currentLoggedUserId
		)
		dispatch(fetchChatDetailsMissingMessagesSuccess(remappedChatDetails))
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_fetch_messages`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage)
		dispatch(fetchChatDetailsFailure(errorMessage))
	}
}

export const addNewMessageToChatFromSender = (chatId, messageDetails) => async (
	dispatch,
	getState
) => {
	try {
		const currentPage = navigationService.getCurrentPage()
		const currentChatId = getState().messages.currentChatId
		const isChatWithSenderOpened =
			currentPage === PAGES_NAMES.CHAT_MESSAGES_PAGE && currentChatId === chatId
		let currentChatMessages = []
		const chatHistoryExists = getState().messages.chatsHistory[chatId]
		if (chatHistoryExists) {
			currentChatMessages = getState().messages.chatsHistory[chatId].messages
		}
		const currentLoggedUserId = getState().profile.id
		const remappedNewMessage = remapNewMessageToChat(
			messageDetails.message,
			currentChatMessages,
			currentLoggedUserId
		)
		const chatDetailsFromNewMessage = messageDetails.chat
		if (isChatWithSenderOpened) {
			dispatch(
				addNewMessageToChatFromPushNotificationClearUnread(
					remappedNewMessage,
					chatDetailsFromNewMessage,
					chatId
				)
			)
			await api.getChatMessages(chatId, { limit: 1 })
		} else {
			dispatch(
				addNewMessageToChatFromPushNotificationIncrementUnread(
					remappedNewMessage,
					chatDetailsFromNewMessage,
					chatId
				)
			)
		}
	} catch (err) {
		Answers.logCustom(
			'PUSH-NOTIFICATION-ADDING-TO-CHAT-MARK-CHAT-AS-READ-ERROR',
			{
				error: err.toString()
			}
		)
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
		const currentChatMessages = getState().messages.chatsHistory[chatId]
			.messages
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
			? _.cloneDeep(currentMessagesInChat[0])
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
	const messagesTempMomentObject = chatDetails.messages.map(message => ({
		...message,
		tempMoment: moment(message.timestamp)
	}))
	const remappedChatMessages = messagesTempMomentObject.map(
		(message, index) => {
			// those are inverted because the order of returned messages is inverted!
			// !please keep it in mind!
			// this is why nextMessage is actually -1 and not +1
			// and prevMessage is actually +1 and not -1
			const nextMess =
				index - 1 >= 0 ? messagesTempMomentObject[index - 1] : null
			const prevMess =
				index + 1 < messagesTempMomentObject.length
					? messagesTempMomentObject[index + 1]
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
