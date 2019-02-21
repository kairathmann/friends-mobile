import {
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_SUCCESS,
	MARK_ROUND_CHAT_AS_READ
} from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	chats: [],
	currentChatDetails: {
		id: 0,
		roundId: 0,
		type: '',
		lastReadMessageId: 0,
		users: [],
		messages: []
	}
}

export default function messageReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case FETCH_CHATS_SUCCESS:
			return {
				...state,
				chats: payload
			}
		case FETCH_CHAT_DETAILS_SUCCESS:
			return {
				...state,
				currentChatDetails: payload
			}
		case MARK_ROUND_CHAT_AS_READ:
			return {
				...state,
				chats: state.chats.map(singleChat => ({
					...singleChat,
					unread: singleChat.id === payload ? 0 : singleChat.unread
				}))
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
