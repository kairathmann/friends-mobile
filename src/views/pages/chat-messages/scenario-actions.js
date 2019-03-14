import _ from 'lodash'
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
			currentMessagesInChat.length > 0 ? currentMessagesInChat[0].id : null
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
			currentMessagesInChat.length > 0
				? currentMessagesInChat[currentMessagesInChat.length - 1].id
				: null
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

const isChatWithNotificationSenderOpened = (
	currentChatId,
	notificationChatId
) => {
	const currentPage = navigationService.getCurrentPage()
	return (
		currentPage === PAGES_NAMES.CHAT_MESSAGES_PAGE &&
		currentChatId === notificationChatId
	)
}

const isChatWithPersonNotBeingSenderOpened = (
	currentChatId,
	notificationChatId
) => {
	const currentPage = navigationService.getCurrentPage()
	return (
		currentPage === PAGES_NAMES.CHAT_MESSAGES_PAGE &&
		currentChatId !== notificationChatId
	)
}

const getCurrentChatMessagesHistory = (chatId, chatsHistory) => {
	return chatsHistory[chatId] ? chatsHistory[chatId].messages : []
}

// Worth mentioning:
// On Android devices when app is in background
// onNotificationReceived is called and then user can click on notification and also call
// onNotificationOpened so we need to guard againt executing the same logic mulitple times
// for the same push notification to save some requests and performance
const getOnlyUnprocessedMessagesFromNotification = (
	currentMessagesInChat,
	incomingMessages
) => {
	return _.differenceBy(incomingMessages, currentMessagesInChat, 'id')
}

export const openChatPageFromNotification = (
	chatId,
	chatType,
	messagesDetails
) => async (dispatch, getState) => {
	try {
		const currentChatId = getState().messages.currentChatId
		const chatsHistory = getState().messages.chatsHistory
		const currentChatMessages = getCurrentChatMessagesHistory(
			chatId,
			chatsHistory
		)
		const unprocessedMessages = getOnlyUnprocessedMessagesFromNotification(
			currentChatMessages,
			messagesDetails.messages
		)
		const isChatWithSenderOpen = isChatWithNotificationSenderOpened(
			currentChatId,
			chatId
		)
		const isChatWithNoSenderOpen = isChatWithPersonNotBeingSenderOpened(
			currentChatId,
			chatId
		)
		const currentLoggedUserId = getState().profile.id
		const remappedNewMessages = remapNewMessagesToChat(
			unprocessedMessages,
			currentLoggedUserId
		)
		const chatDetailsFromNewMessage = messagesDetails.chat
		const partnerInfo = {
			firstName: chatDetailsFromNewMessage.partnerName,
			emoji: chatDetailsFromNewMessage.partnerEmoji,
			color: `#${chatDetailsFromNewMessage.partnerColor.hexValue}`
		}
		if (isChatWithSenderOpen && unprocessedMessages.length > 0) {
			dispatch(
				addNewMessageToChatFromPushNotificationClearUnread(
					remappedNewMessages,
					chatDetailsFromNewMessage,
					chatId
				)
			)
			await api.getChatMessages(chatId, { limit: 1 })
			return
		}
		if (isChatWithNoSenderOpen) {
			navigationService.replace(PAGES_NAMES.CHAT_MESSAGES_PAGE, {
				chatId,
				chatType,
				partnerInfo
			})
			if (unprocessedMessages.length > 0) {
				await api.getChatMessages(chatId, { limit: 1 })
			}
			return
		}
		navigationService.navigate(PAGES_NAMES.CHAT_MESSAGES_PAGE, {
			chatId,
			chatType,
			partnerInfo
		})
	} catch (err) {
		/* */
	}
}

export const addNewMessagesToChatFromSender = (
	chatId,
	messagesDetails
) => async (dispatch, getState) => {
	try {
		const currentChatId = getState().messages.currentChatId
		const chatsHistory = getState().messages.chatsHistory
		const currentChatMessages = getCurrentChatMessagesHistory(
			chatId,
			chatsHistory
		)
		const unprocessedMessages = getOnlyUnprocessedMessagesFromNotification(
			currentChatMessages,
			messagesDetails.messages
		)
		const isChatWithSenderOpened = isChatWithNotificationSenderOpened(
			currentChatId,
			chatId
		)
		const currentLoggedUserId = getState().profile.id
		const remappedNewMessages = remapNewMessagesToChat(
			unprocessedMessages,
			currentLoggedUserId
		)
		const chatDetailsFromNewMessage = messagesDetails.chat
		if (unprocessedMessages.length > 0) {
			if (isChatWithSenderOpened) {
				dispatch(
					addNewMessageToChatFromPushNotificationClearUnread(
						remappedNewMessages,
						chatDetailsFromNewMessage,
						chatId
					)
				)
				await api.getChatMessages(chatId, { limit: 1 })
				return
			} else {
				dispatch(
					addNewMessageToChatFromPushNotificationIncrementUnread(
						remappedNewMessages,
						chatDetailsFromNewMessage,
						chatId
					)
				)
			}
		}
	} catch (err) {
		/* */
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
		const remappedNewMessages = remapNewMessagesToChat(
			[sentMessage],
			currentLoggedUserId
		)
		const newMessage = remappedNewMessages[0]
		dispatch(addNewMessageToChat(newMessage, chatId))
		dispatch(sendChatTextMessageSuccess())
		successCallback()
	} catch (err) {
		dispatch(sendChatTextMessageFailure())
		const errorMessage = I18n.t('errors.chat_message_send_fail')
		toastService.showErrorToast(errorMessage, 'top')
	}
}

const remapNewMessagesToChat = (newMessages, currentLoggedUserId) =>
	newMessages.map(singleMessage => {
		return remapSingleMessage(singleMessage, currentLoggedUserId)
	})

const remapSingleMessage = (message, currentLoggedUserId) => {
	return {
		id: message.id,
		senderId: message.sender,
		ownedByLoggedUser: message.sender === currentLoggedUserId,
		text: message.text,
		timestamp: message.timestamp
	}
}

const remapChatDetails = (chatDetails, currentLoggedUserId) => ({
	id: chatDetails.id,
	roundId: chatDetails.round,
	type: chatDetails.type,
	lastReadMessageId:
		chatDetails.chatusersSet.find(u => u.user.id === currentLoggedUserId)
			.lastRead || 0,
	users: chatDetails.chatusersSet.filter(
		u => u.user.id !== currentLoggedUserId
	),
	feedback:
		chatDetails.chatusersSet.find(u => u.user.id === currentLoggedUserId)
			.feedbackRequested || false,
	messages: chatDetails.messages.map(message =>
		remapSingleMessage(message, currentLoggedUserId)
	)
})
