import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { addNewMessageToChatFromSender } from '../views/pages/chat-messages/scenario-actions'
let reduxStore

export const initialize = (store, userId) => {
	reduxStore = store
	OneSignal.init(Config.APP_ONESIGNAL_TOKEN)
	// don't show notification when app is opened
	OneSignal.inFocusDisplaying(0)
	OneSignal.addEventListener('received', onNotificationReceived)
	OneSignal.addEventListener('opened', onNotificationOpened)
	OneSignal.setExternalUserId(userId)
}

export const cleanUp = () => {
	OneSignal.removeEventListener('received', onNotificationReceived)
	OneSignal.removeEventListener('opened', onNotificationOpened)
}

export const removeUserId = () => {
	OneSignal.removeExternalUserId()
}

const onNotificationReceived = notification => {
	const notificationPayload = notification.payload
	const messageData = notificationPayload.additionalData
	const chatId = messageData.chat_id
	const newMessagePayload = {
		chat: {
			id: messageData.chat_id,
			type: messageData.chat_type,
			roundId: messageData.round_id || '',
			partnerName: messageData.message_sender.first_name,
			partnerColor: {
				id: messageData.message_sender.color.id,
				hexValue: messageData.message_sender.color.hex_value
			},
			partnerEmoji: messageData.message_sender.emoji,
			feedback: {
				show: false,
				given: false
			}
		},
		message: {
			id: messageData.message_id,
			timestamp: messageData.message_timestamp,
			text: messageData.message_text,
			sender: messageData.message_sender.id
		}
	}
	reduxStore.dispatch(addNewMessageToChatFromSender(chatId, newMessagePayload))
}

const onNotificationOpened = openResult => {
	console.log('Message: ', openResult.notification.payload.body)
	console.log('Data: ', openResult.notification.payload.additionalData)
	console.log('isActive: ', openResult.notification.isAppInFocus)
	console.log('openResult: ', openResult)
}
