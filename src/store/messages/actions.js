import {
	ADD_NEW_MESSAGE_TO_CHAT,
	FETCH_CHATS_FAILURE,
	FETCH_CHATS_REQUEST,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_FAILURE,
	FETCH_CHAT_DETAILS_REQUEST,
	FETCH_CHAT_DETAILS_SUCCESS,
	SEND_TEXT_CHAT_MESSAGE_FAILURE,
	SEND_TEXT_CHAT_MESSAGE_REQUEST,
	SEND_TEXT_CHAT_MESSAGE_SUCCESS
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

export const fetchChatDetailsSuccess = chatDetails => ({
	type: FETCH_CHAT_DETAILS_SUCCESS,
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
