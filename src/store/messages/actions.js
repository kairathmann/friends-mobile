import {
	ADD_NEW_MESSAGE_TO_CHAT,
	ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_CLEAR_UNREAD_COUNTER,
	ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_INCREMENT_UNREAD_COUNTER,
	FETCH_CHATS_FAILURE,
	FETCH_CHATS_REQUEST,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_FAILURE,
	FETCH_CHAT_DETAILS_REQUEST,
	FETCH_CHAT_DETAILS_SUCCESS_MISSING_MESSAGES,
	FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY,
	FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES,
	SEND_TEXT_CHAT_MESSAGE_FAILURE,
	SEND_TEXT_CHAT_MESSAGE_REQUEST,
	SEND_TEXT_CHAT_MESSAGE_SUCCESS,
	SWITCH_CHAT
} from './action-types'

export function fetchChatsStarted() {
	return {
		type: FETCH_CHATS_REQUEST
	}
}

export function fetchChatsSuccess(result) {
	return {
		type: FETCH_CHATS_SUCCESS,
		payload: result
	}
}

export function fetchChatsFailure(err) {
	return {
		type: FETCH_CHATS_FAILURE,
		payload: err
	}
}

export const fetchChatDetailsStarted = () => ({
	type: FETCH_CHAT_DETAILS_REQUEST
})

export const fetchChatDetailsLatestMessagesWithCleanHistorySuccess = chatDetails => ({
	type: FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY,
	payload: chatDetails
})

export const fetchChatDetailsPreviousMessagesSuccess = chatDetails => ({
	type: FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES,
	payload: chatDetails
})

export const fetchChatDetailsMissingMessagesSuccess = chatDetails => ({
	type: FETCH_CHAT_DETAILS_SUCCESS_MISSING_MESSAGES,
	payload: chatDetails
})

export const fetchChatDetailsFailure = errorMessage => ({
	type: FETCH_CHAT_DETAILS_FAILURE,
	payload: errorMessage
})

export const sendChatTextMessageStarted = () => ({
	type: SEND_TEXT_CHAT_MESSAGE_REQUEST
})

export const sendChatTextMessageSuccess = () => ({
	type: SEND_TEXT_CHAT_MESSAGE_SUCCESS
})

export const sendChatTextMessageFailure = () => ({
	type: SEND_TEXT_CHAT_MESSAGE_FAILURE
})

export const addNewMessageToChat = (newMessage, chatId) => ({
	type: ADD_NEW_MESSAGE_TO_CHAT,
	payload: {
		message: newMessage,
		chatId
	}
})

export const addNewMessageToChatFromPushNotificationClearUnread = (
	newMessage,
	chatDetails,
	chatId
) => ({
	type: ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_CLEAR_UNREAD_COUNTER,
	payload: {
		message: newMessage,
		chat: chatDetails,
		chatId
	}
})

export const addNewMessageToChatFromPushNotificationIncrementUnread = (
	newMessage,
	chatDetails,
	chatId
) => ({
	type: ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_INCREMENT_UNREAD_COUNTER,
	payload: {
		message: newMessage,
		chat: chatDetails,
		chatId
	}
})

export const switchChat = chatId => ({
	type: SWITCH_CHAT,
	payload: chatId
})
