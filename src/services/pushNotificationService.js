import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import {
	addNewMessagesToChatFromSender,
	openChatPageFromNotification
} from '../views/pages/chat-messages/scenario-actions'
import { chatsService } from '../services'
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
	const remappedNotificationData = chatsService.remapChatMessageNotificationToChatMessageFormat(
		[messageData]
	)
	reduxStore.dispatch(
		addNewMessagesToChatFromSender(chatId, remappedNotificationData)
	)
}

const onNotificationOpened = openResult => {
	const { notification } = openResult
	const openedNotificationGroup =
		notification.groupedNotifications &&
		notification.groupedNotifications.length > 0
	const notificationMessages = openedNotificationGroup
		? notification.groupedNotifications.map(data => data.additionalData)
		: [notification.payload.additionalData]
	const remappedNotificationData = chatsService.remapChatMessageNotificationToChatMessageFormat(
		notificationMessages
	)
	const chatId = remappedNotificationData.chat.id
	const chatType = remappedNotificationData.chat.type
	reduxStore.dispatch(
		openChatPageFromNotification(chatId, chatType, remappedNotificationData)
	)
}
