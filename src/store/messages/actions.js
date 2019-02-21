import {
	FETCH_CHATS_FAILURE,
	FETCH_CHATS_REQUEST,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_FAILURE,
	FETCH_CHAT_DETAILS_REQUEST,
	FETCH_CHAT_DETAILS_SUCCESS,
	MARK_ROUND_CHAT_AS_READ
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

export const markRoundChatAsRed = chatId => ({
	type: MARK_ROUND_CHAT_AS_READ,
	payload: chatId
})
