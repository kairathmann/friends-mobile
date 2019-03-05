import { DEFAULT_EMOJIS } from '../enums'
import _ from 'lodash'
import moment from 'moment'

const remapChats = (chats, profileId, defaultColor) => {
	const chatsWithAtLeastTwoUsers = chats.filter(
		chat =>
			chat.chatusersSet.length >= 2 &&
			chat.chatusersSet.filter(member => member.user.id !== profileId).length >=
				1
	)
	const now = moment().toISOString()
	return chatsWithAtLeastTwoUsers.map(chat => {
		const partner = chat.chatusersSet.filter(u => u.user.id !== profileId)
		return remapSingleChat(
			chat.type,
			chat.id,
			chat.round || '',
			partner[0].user.firstName,
			partner[0].user.color || defaultColor,
			partner[0].user.emoji || DEFAULT_EMOJIS[0],
			chat.lastMessage.text || '',
			chat.lastMessage.timestamp || now,
			chat.unreadMessages[profileId]
		)
	})
}

const remapSingleChat = (
	type,
	id,
	roundId,
	partnerName,
	partnerColor,
	partnerEmoji,
	lastMesasge,
	lastReadTimeStamp,
	unreadCounter
) => {
	return {
		type: type,
		id: id,
		roundId: roundId || '',
		partnerName: partnerName,
		partnerColor: partnerColor,
		partnerEmoji: partnerEmoji,
		lastMessage: lastMesasge,
		lastRead: lastReadTimeStamp,
		unread: unreadCounter,
		feedback: {
			show: false,
			given: false
		}
	}
}

const remapChatMessageNotificationToChatMessageFormat = notificationsPayload => {
	if (notificationsPayload.length === 0) {
		return ''
	}
	const firstMessage = notificationsPayload[0]
	const chat = {
		id: firstMessage.chat_id,
		type: firstMessage.chat_type,
		roundId: firstMessage.round_id || '',
		partnerName: firstMessage.message_sender.first_name,
		partnerColor: {
			id: firstMessage.message_sender.color.id,
			hexValue: firstMessage.message_sender.color.hex_value
		},
		partnerEmoji: firstMessage.message_sender.emoji,
		feedback: {
			show: false,
			given: false
		}
	}
	const messages = _.orderBy(
		notificationsPayload.map(notification => ({
			id: notification.message_id,
			timestamp: notification.message_timestamp,
			text: notification.message_text,
			sender: notification.message_sender.id
		})),
		'id',
		'asc'
	)
	return {
		chat,
		messages
	}
}

export {
	remapChatMessageNotificationToChatMessageFormat,
	remapChats,
	remapSingleChat
}
