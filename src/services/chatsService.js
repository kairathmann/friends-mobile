import { DEFAULT_EMOJIS } from '../enums'
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

export { remapChats, remapSingleChat }
