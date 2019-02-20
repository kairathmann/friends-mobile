import {
	FETCH_CHATS_FAILURE,
	FETCH_CHATS_REQUEST,
	FETCH_CHATS_SUCCESS
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
