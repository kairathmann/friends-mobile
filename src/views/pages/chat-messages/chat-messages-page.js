import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StatusBar
} from 'react-native'
import { Container, Icon, Text, View } from 'native-base'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'

import UserAvatar from '../../../components/UserAvatar'
import SystemCard from '../../../components/SystemCard'
import NewMessageInputs from '../../../components/NewMessageInputs'
import TextMessage from '../../../components/TextMessage'
import { FeedbackHeader } from '../../../components/Feedback'
import { createFontStyle, styles as commonStyles, FONTS } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { CHAT_TYPES } from '../../../enums'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import {
	fetchChatDetailsLatestCleanHistory,
	fetchChatDetailsMissingMessages,
	fetchChatDetailsPreviousMessages,
	sendTextMessage,
	switchChatInstance
} from './scenario-actions'
import { fetchFeedbackQuestions } from '../../../components/Feedback/scenario-actions'

const DEFAULT_CHAT_OBJECT = {
	fetchedAllPossiblePastMessages: false,
	id: 0,
	roundId: 0,
	type: '',
	lastReadMessageId: 0,
	users: [],
	messages: []
}

class ChatMessagesPage extends React.Component {
	__mounted = false
	state = {
		textMessageInputValue: '',
		chatId: this.props.navigation.getParam('chatId'),
		chatType:
			this.props.navigation.getParam('chatType') || CHAT_TYPES.EVERYTHING,
		partnerInfo: this.props.navigation.getParam('partnerInfo')
	}

	fetchChatDetailsMissingMessages = () => {
		this.props.fetchChatDetailsMissingMessages(this.state.chatId)
	}

	fetchChatMessagesLatestWithCleanHistory = () => {
		this.props.fetchChatDetailsLatestCleanHistory(this.state.chatId)
	}

	fetchPreviousChatMessages = () => {
		this.props.fetchChatDetailsPreviousMessages(this.state.chatId)
	}

	onSuccessMessageSend = () => {
		if (!this.__mounted) {
			return
		}
		this.setState({ textMessageInputValue: '' })
	}

	sendNewMessage = () => {
		this.scrollToTheBottom()
		const { chatId, textMessageInputValue } = this.state
		this.props.sendNewMessage(
			chatId,
			textMessageInputValue,
			this.onSuccessMessageSend
		)
	}

	componentDidMount() {
		this.__mounted = true
		this.props.switchChatInstance(this.state.chatId)
		if (this.props.chatDetails.messages.length === 0) {
			this.fetchChatMessagesLatestWithCleanHistory()
		} else {
			this.fetchChatDetailsMissingMessages()
		}
	}

	componentWillUnmount() {
		this.__mounted = false
	}

	onEndReached = () => {
		// fetch more only if there is anything more to fetch
		// if at any point request returns empty messages array that means
		// that we have reached all previous messages
		// This is also done because React Native's FlatList returns mulitple time that
		// user has reached the end when there is no more extra data after fetch
		// so we are guarding against mulitple requests to server that wouldn't
		// return anything new
		if (
			!this.props.chatDetails.fetchedAllPossiblePastMessages &&
			!this.props.isLoading
		) {
			this.fetchPreviousChatMessages()
		}
	}

	scrollToTheBottom = () => {
		if (this.flatListInstance && this.__mounted) {
			this.flatListInstance.scrollToOffset({ x: 0, y: 0, animated: true })
		}
	}

	onTextMessageChange = newText => {
		if (newText !== this.state.textMessageInputValue) {
			this.setState({ textMessageInputValue: newText })
		}
	}

	renderPartnerInfoHeader = () => {
		const { partnerInfo } = this.state
		const { firstName, emoji, color } = partnerInfo
		const { navigation } = this.props
		return (
			<View style={styles.partnerInfoHeaderContainer}>
				<Icon
					onPress={() => navigation.goBack()}
					type={'MaterialIcons'}
					name={'arrow-back'}
					style={styles.backArrow}
				/>
				<View style={styles.partnerInfoHeaderUserNameContainer}>
					<Text style={styles.partnerInfoHeaderUserNameText}>{firstName}</Text>
				</View>
				<UserAvatar
					emoji={emoji}
					color={color}
					borderWidth={2}
					circleSize={50}
					emojiSize={25}
				/>
			</View>
		)
	}

	fetchFeedback = () => {
		const { fetchFeedbackQuestions } = this.props
		fetchFeedbackQuestions(this.state.chatId)
	}

	renderFeedbackHeader = () => {
		const { feedbackRequested } = this.props
		return feedbackRequested ? (
			<FeedbackHeader opened={false} onSubmitClick={this.fetchFeedback} />
		) : null
	}

	renderMessagesList = () => (
		<FlatList
			ref={ref => (this.flatListInstance = ref)}
			inverted
			keyExtractor={item => `message-item-index-${item.id}`}
			onEndReachedThreshold={0.6}
			onEndReached={this.onEndReached}
			contentContainerStyle={styles.scrollViewContainer}
			data={_.orderBy(this.props.chatDetails.messages, 'id', 'desc')}
			initialNumToRender={40}
			renderItem={({ item }) => {
				return item.senderId ? (
					<TextMessage
						text={item.text}
						isTheSameDayAsPrevious={item.isTheSameDayAsPrevious}
						isLoggedUserMessage={item.ownedByLoggedUser}
						timestamp={item.timestamp}
						nextMessageBelongsToTheSameUser={
							item.nextMessageBelongsToTheSameUser
						}
					/>
				) : (
					<SystemCard text={item.text} />
				)
			}}
		/>
	)

	renderNewMessagesInputs = () => (
		<NewMessageInputs
			onTextMessageSend={this.sendNewMessage}
			chatType={this.state.chatType}
			textMessageValue={this.state.textMessageInputValue}
			onTextMessageChange={this.onTextMessageChange}
			sendButtonDisabled={
				this.state.textMessageInputValue.length === 0 ||
				this.props.isSendingNewTextMessage ||
				this.props.isLoading
			}
		/>
	)

	render() {
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<KeyboardAvoidingView
						style={styles.keyboardAwareContainer}
						behavior="padding"
						enabled={Platform.OS === 'ios'}
					>
						<Container style={commonStyles.content}>
							{this.renderPartnerInfoHeader()}
							{this.renderFeedbackHeader()}
							{this.renderMessagesList()}
							{this.renderNewMessagesInputs()}
						</Container>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	keyboardAwareContainer: {
		flex: 1
	},
	partnerInfoHeaderContainer: {
		paddingLeft: 25,
		paddingRight: 12,
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: 'rgba(17,21,28,0.9)',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	backArrow: {
		fontSize: 32,
		color: '$greyColor'
	},
	partnerInfoHeaderUserNameContainer: {
		marginLeft: 30,
		marginRight: 30,
		flex: 1
	},
	partnerInfoHeaderUserNameText: {
		...createFontStyle(FONTS.LATO),
		color: 'white',
		fontSize: 21,
		letterSpacing: 0.25
	},
	scrollViewContainer: {
		backgroundColor: '$primaryBackgroundColor',
		flexGrow: 1
	}
})

ChatMessagesPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	chatDetails: PropTypes.shape({
		fetchedAllPossiblePastMessages: PropTypes.bool.isRequired,
		id: PropTypes.number.isRequired,
		roundId: PropTypes.number,
		lastReadMessageId: PropTypes.number,
		messages: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				senderId: PropTypes.number,
				ownedByLoggedUser: PropTypes.bool.isRequired,
				text: PropTypes.string,
				timestamp: PropTypes.string.isRequired,
				isTheSameDayAsPrevious: PropTypes.bool.isRequired,
				nextMessageBelongsToTheSameUser: PropTypes.bool.isRequired
			})
		)
	}),
	feedbackRequested: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	fetchChatDetailsLatestCleanHistory: PropTypes.func.isRequired,
	fetchChatDetailsMissingMessages: PropTypes.func.isRequired,
	fetchChatDetailsPreviousMessages: PropTypes.func.isRequired,
	sendNewMessage: PropTypes.func.isRequired,
	switchChatInstance: PropTypes.func.isRequired,
	fetchFeedbackQuestions: PropTypes.func.isRequired,
	isSendingNewTextMessage: PropTypes.bool.isRequired
}

const areTwoDaysTheSameDay = (d1, d2) =>
	d1.getFullYear() === d2.getFullYear() &&
	d1.getMonth() === d2.getMonth() &&
	d1.getDate() === d2.getDate()

const mapStateToProps = (state, ownProps) => {
	const chatDetailsRegular =
		state.messages.chatsHistory[ownProps.navigation.getParam('chatId')] ||
		DEFAULT_CHAT_OBJECT
	const chatDetailsMessagesTempDate = chatDetailsRegular.messages.map(
		message => ({
			...message,
			tempDate: new Date(message.timestamp)
		})
	)
	const chatDetailsMessagesRemapped = chatDetailsMessagesTempDate.map(
		(message, index) => {
			const prevMessage =
				index - 1 > 0 ? chatDetailsMessagesTempDate[index - 1] : null
			const nextMessage =
				index + 1 < chatDetailsMessagesTempDate.length
					? chatDetailsMessagesTempDate[index + 1]
					: null
			return {
				...message,
				nextMessageBelongsToTheSameUser: nextMessage
					? nextMessage.senderId === message.senderId
					: true,
				isTheSameDayAsPrevious: prevMessage
					? areTwoDaysTheSameDay(prevMessage.tempDate, message.tempDate)
					: true
			}
		}
	)
	const chatDetailsRemapped = {
		...chatDetailsRegular,
		messages: chatDetailsMessagesRemapped
	}
	const chatInstance = state.messages.chats.find(
		chat => chat.id === ownProps.navigation.getParam('chatId')
	)
	return {
		chatDetails: chatDetailsRemapped,
		feedbackRequested: chatInstance ? chatInstance.feedback : false,
		error: createErrorMessageSelector(['FETCH_CHAT_DETAILS'])(state),
		isLoading: createLoadingSelector(['FETCH_CHAT_DETAILS'])(state),
		isSendingNewTextMessage: createLoadingSelector(['SEND_TEXT_CHAT_MESSAGE'])(
			state
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchChatDetailsLatestCleanHistory: chatId =>
			dispatch(fetchChatDetailsLatestCleanHistory(chatId)),
		fetchChatDetailsMissingMessages: chatId =>
			dispatch(fetchChatDetailsMissingMessages(chatId)),
		fetchChatDetailsPreviousMessages: chatId =>
			dispatch(fetchChatDetailsPreviousMessages(chatId)),
		sendNewMessage: (chatId, text, successCallback) =>
			dispatch(sendTextMessage(chatId, text, successCallback)),
		switchChatInstance: chatId => dispatch(switchChatInstance(chatId)),
		fetchFeedbackQuestions: chatId => dispatch(fetchFeedbackQuestions(chatId))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatMessagesPage)
