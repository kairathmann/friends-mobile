import _ from 'lodash'
import {
	ADD_NEW_MESSAGE_TO_CHAT,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_SUCCESS
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
				chats: _.unionBy([...payload, ...state.chats], 'id')
			}
		case FETCH_CHAT_DETAILS_SUCCESS:
			return {
				...state,
				currentChatDetails: payload,
				chats: state.chats.map(chat => ({
					...chat,
					unread: chat.id === payload.id ? 0 : chat.unread,
					lastMessage:
						chat.id === payload.id && payload.messages.length > 0
							? payload.messages[payload.messages.length - 1].text
							: chat.lastMessage,
					lastRead:
						chat.id === payload.id && payload.messages.length > 0
							? payload.messages[payload.messages.length - 1].timestamp
							: chat.lastRead
				}))
			}
		case ADD_NEW_MESSAGE_TO_CHAT:
			return {
				...state,
				currentChatDetails: {
					...state.currentChatDetails,
					messages: [...state.currentChatDetails.messages, payload.message]
				},
				chats: state.chats.map(chat => ({
					...chat,
					lastMessage:
						chat.id === payload.chatId
							? payload.message.text
							: chat.lastMessage,
					lastRead:
						chat.id === payload.chatId
							? payload.message.timestamp
							: chat.lastRead
				}))
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
