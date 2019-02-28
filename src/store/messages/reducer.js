import _ from 'lodash'
import moment from 'moment'

import {
	ADD_NEW_MESSAGE_TO_CHAT,
	ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_CLEAR_UNREAD_COUNTER,
	ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_INCREMENT_UNREAD_COUNTER,
	FETCH_CHATS_SUCCESS,
	FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY,
	FETCH_CHAT_DETAILS_SUCCESS_MISSING_MESSAGES,
	FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES,
	SWITCH_CHAT
} from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'
import { chatsService } from '../../services'

const initialState = {
	chats: [],
	currentChatId: 0,
	// key is an ID of chat and value is following object:
	//	{
	//		fetchedAllPossiblePastMessages: false,
	//		id: 0,
	//		roundId: 0,
	//		type: '',
	//		lastReadMessageId: 0,
	//		users: [],
	//		messages: []
	//	}
	chatsHistory: {}
}

export default function messageReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SWITCH_CHAT:
			return {
				...state,
				currentChatId: payload
			}
		case FETCH_CHATS_SUCCESS:
			return {
				...state,
				chats: payload
			}
		case FETCH_CHAT_DETAILS_SUCCESS_LATEST_MESSAGES_CLEAN_HISTORY: {
			const chatId = payload.id
			const clonedChats = _.cloneDeep(state.chatsHistory)
			clonedChats[chatId] = payload
			clonedChats[chatId].fetchedAllPossiblePastMessages = false
			return {
				...state,
				currentChatId: payload.id,
				chatsHistory: clonedChats,
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
		}
		case FETCH_CHAT_DETAILS_SUCCESS_PREVIOUS_MESSAGES:
			return {
				...state,
				chatsHistory: _.mapValues(state.chatsHistory, value => {
					if (value.id === payload.id) {
						return {
							...value,
							...payload,
							messages: [...value.messages, ...payload.messages],
							fetchedAllPossiblePastMessages: payload.messages.length === 0
						}
					}
					return value
				})
			}
		case FETCH_CHAT_DETAILS_SUCCESS_MISSING_MESSAGES:
			return {
				...state,
				chatsHistory: _.mapValues(state.chatsHistory, value => {
					if (value.id === payload.id) {
						return {
							...value,
							...payload,
							messages: [...payload.messages, ...value.messages]
						}
					}
					return value
				}),
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
		case ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_CLEAR_UNREAD_COUNTER:
			return {
				...state,
				chatsHistory: _.mapValues(state.chatsHistory, value => {
					if (value.id === payload.chatId) {
						return {
							...value,
							messages: _.unionBy([payload.message, ...value.messages], 'id')
						}
					}
					return value
				}),
				chats: clearUnreadCount(state.chats, payload.chatId, payload.message)
			}
		case ADD_NEW_MESSAGE_TO_CHAT_FROM_PUSH_NOTIFICATION_INCREMENT_UNREAD_COUNTER: {
			const chatAlreadyExists =
				state.chats.findIndex(chat => chat.id === payload.chatId) !== -1
			const { chatId, message, chat } = payload
			let updatedChats = []
			if (chatAlreadyExists) {
				updatedChats = incrementUnreadCount(state.chats, chatId, message)
			} else {
				updatedChats = [
					...state.chats,
					chatsService.remapSingleChat(
						chat.type,
						chat.id,
						chat.roundId,
						chat.partnerName,
						chat.partnerColor,
						chat.partnerEmoji,
						message.text,
						message.timestamp,
						1
					)
				]
			}
			return {
				...state,
				chatsHistory: _.mapValues(state.chatsHistory, value => {
					if (value.id === payload.chatId) {
						return {
							...value,
							messages: _.unionBy([payload.message, ...value.messages], 'id')
						}
					}
					return value
				}),
				chats: updatedChats
			}
		}
		case ADD_NEW_MESSAGE_TO_CHAT:
			return {
				...state,
				chatsHistory: _.mapValues(state.chatsHistory, value => {
					if (value.id === payload.chatId) {
						return {
							...value,
							messages: [payload.message, ...value.messages]
						}
					}
					return value
				}),
				chats: clearUnreadCount(state.chats, payload.chatId, payload.message)
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}

const incrementUnreadCount = (chats, chatId, message) =>
	chats.map(chat => {
		if (chat.id === chatId) {
			const momentPreviousMessage = moment(chat.lastRead)
			const momentNewMessage = moment(message.timestamp)
			const isNewMessageAfterLastMessage = momentNewMessage.isAfter(
				momentPreviousMessage
			)
			return {
				...chat,
				unread: chat.unread + 1,
				lastMessage: isNewMessageAfterLastMessage
					? message.text
					: chat.lastMessage,
				lastRead: isNewMessageAfterLastMessage
					? message.timestamp
					: chat.lastRead
			}
		} else {
			return chat
		}
	})

const clearUnreadCount = (chats, chatId, message) =>
	chats.map(chat => {
		if (chat.id === chatId) {
			const momentPreviousMessage = moment(chat.lastRead)
			const momentNewMessage = moment(message.timestamp)
			const isNewMessageAfterLastMessage = momentNewMessage.isAfter(
				momentPreviousMessage
			)
			return {
				...chat,
				unread: isNewMessageAfterLastMessage ? 0 : chat.unread,
				lastMessage: isNewMessageAfterLastMessage
					? message.text
					: chat.lastMessage,
				lastRead: isNewMessageAfterLastMessage
					? message.timestamp
					: chat.lastRead
			}
		} else {
			return chat
		}
	})
