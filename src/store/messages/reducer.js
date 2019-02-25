import _ from 'lodash'
import {
	ADD_NEW_MESSAGE_TO_CHAT,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY,
	FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES
} from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	chats: [],
	currentChatDetails: {
		fetchedAllPossiblePastMessages: false,
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
		case FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY:
			return {
				...state,
				currentChatDetails: {
					...state.currentChatDetails,
					...payload,
					fetchedAllPossiblePastMessages: false
				},
				chats: state.chats.map(chat => ({
					...chat,
					unread: chat.id === payload.id ? 0 : chat.unread,
					lastMessage:
						chat.id === payload.id && payload.messages.length > 0
							? payload.messages[0].text
							: chat.lastMessage,
					lastRead:
						chat.id === payload.id && payload.messages.length > 0
							? payload.messages[0].timestamp
							: chat.lastRead
				}))
			}
		case FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES:
			return {
				...state,
				currentChatDetails: {
					...state.currentChatDetails,
					...payload,
					messages: [...state.currentChatDetails.messages, ...payload.messages],
					fetchedAllPossiblePastMessages: payload.messages.length === 0
				}
			}
		case ADD_NEW_MESSAGE_TO_CHAT:
			return {
				...state,
				currentChatDetails: {
					...state.currentChatDetails,
					messages: [payload.message, ...state.currentChatDetails.messages]
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
