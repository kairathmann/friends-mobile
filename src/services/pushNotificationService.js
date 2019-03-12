import OneSignal from 'react-native-onesignal'
import Config from 'react-native-config'
import { NOTIFICATION_TYPES } from '../enums'
import {
	addNewMessagesToChatFromSender,
	openChatPageFromNotification
} from '../views/pages/chat-messages/scenario-actions'
import { requestFeedbackOnChats } from '../store/messages/actions'
import { chatsService } from '../services'
let reduxStore

export const register = () => {
	OneSignal.init(Config.APP_ONESIGNAL_TOKEN)
	OneSignal.inFocusDisplaying(0)
}

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

const notificationDispatch = (notificationData, isOpenedFromNativeModal) => {
	const { type } = notificationData.payload.additionalData
	if (type === NOTIFICATION_TYPES.NEW_MESSAGE_NOTIFICATION) {
		newMessageNotificationDispatch(notificationData, isOpenedFromNativeModal)
	}
	if (type === NOTIFICATION_TYPES.FEEDBACK_REQUEST_NOTIFICATION) {
		requestFeedbackNotificationDispatch(
			notificationData,
			isOpenedFromNativeModal
		)
	}
}

const getPayloadFromNotification = notificationData => {
	const openedNotificationGroup =
		notificationData.groupedNotifications &&
		notificationData.groupedNotifications.length > 0
	return openedNotificationGroup
		? notificationData.groupedNotifications.map(data => data.additionalData)
		: [notificationData.payload.additionalData]
}

const requestFeedbackNotificationDispatch = (
	notificationData,
	isOpenedFromNativeModal
) => {
	const notificationPayload = getPayloadFromNotification(notificationData)
	const chatIdsToRequestFeedback = notificationPayload.map(
		data => data.feedback_requested_for_chat
	)
	// add new message to Luminos Bot chat
	newMessageNotificationDispatch(notificationData, isOpenedFromNativeModal)
	// Mark chat as requiring feedback
	reduxStore.dispatch(requestFeedbackOnChats(chatIdsToRequestFeedback))
}

const newMessageNotificationDispatch = (
	notificationData,
	isOpenedFromNativeModal
) => {
	const notificationMessages = getPayloadFromNotification(notificationData)
	const remappedNotificationData = chatsService.remapChatMessageNotificationToChatMessageFormat(
		notificationMessages
	)
	const chatId = remappedNotificationData.chat.id
	const chatType = remappedNotificationData.chat.type
	if (isOpenedFromNativeModal) {
		reduxStore.dispatch(
			openChatPageFromNotification(chatId, chatType, remappedNotificationData)
		)
	} else {
		reduxStore.dispatch(
			addNewMessagesToChatFromSender(chatId, remappedNotificationData)
		)
	}
}

const onNotificationReceived = notification => {
	notificationDispatch(notification, false)
}

const onNotificationOpened = openResult => {
	notificationDispatch(openResult.notification, true)
}
