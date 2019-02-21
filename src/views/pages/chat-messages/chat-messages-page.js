import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FlatList, StatusBar } from 'react-native'
import { Container, Icon, Text, View } from 'native-base'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'

import UserAvatar from '../../../components/UserAvatar'
import NewMessageInputs from '../../../components/NewMessageInputs'
import TextMessage from '../../../components/TextMessage'
import { createFontStyle, styles as commonStyles, FONTS } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { CHAT_TYPES } from '../../../enums'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { fetchChatDetails } from './scenario-actions'

class ChatMessagesPage extends React.Component {
	state = {
		chatId: this.props.navigation.getParam('chatId'),
		chatType:
			this.props.navigation.getParam('chatType') || CHAT_TYPES.EVERYTHING,
		partnerInfo: this.props.navigation.getParam('partnerInfo')
	}

	//TODO: Add componentDidUpdate reacting to redux updates and auto scrolling stuff bla bla

	fetchChatMessages = () => {
		this.props.fetchChatDetails(this.state.chatId)
	}

	componentDidMount() {
		this.fetchChatMessages()
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

	renderMessagesList = () => (
		<FlatList
			keyExtractor={item => `message-item-index-${item.id}`}
			onRefresh={this.fetchChatMessages}
			refreshing={this.props.isLoading}
			contentContainerStyle={styles.scrollViewContainer}
			data={this.props.chatDetails.messages}
			initialNumToRender={40}
			renderItem={({ item }) => (
				<TextMessage
					text={item.text}
					isTheSameDayAsPrevious={item.isTheSameDayAsPrevious}
					isLoggedUserMessage={item.ownedByLoggedUser}
					timestamp={item.timestamp}
					nextMessageBelongsToTheSameUser={item.nextMessageBelongsToTheSameUser}
				/>
			)}
		/>
	)

	renderNewMessagesInputs = () => (
		<NewMessageInputs
			onTextMessageSend={() => {}}
			chatType={this.state.chatType}
		/>
	)

	render() {
		const { isLoading } = this.props
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						{this.renderPartnerInfoHeader()}
						{!isLoading && (
							<React.Fragment>
								{this.renderMessagesList()}
								{this.renderNewMessagesInputs()}
							</React.Fragment>
						)}
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

//TODO: SMOOTH HEADER TRANSITION SOMEHOW
const styles = EStyleSheet.create({
	partnerInfoHeaderContainer: {
		zIndex: 900,
		left: 0,
		top: 0,
		position: 'absolute',
		paddingLeft: 25,
		paddingRight: 12,
		paddingTop: 8,
		paddingBottom: 8,
		marginBottom: 20,
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
		id: PropTypes.number.isRequired,
		roundId: PropTypes.number.isRequired,
		lastReadMessageId: PropTypes.number,
		messages: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				senderId: PropTypes.number.isRequired,
				ownedByLoggedUser: PropTypes.bool.isRequired,
				text: PropTypes.string,
				timestamp: PropTypes.string.isRequired,
				isTheSameDayAsPrevious: PropTypes.bool.isRequired,
				nextMessageBelongsToTheSameUser: PropTypes.bool.isRequired
			})
		)
	}),
	isLoading: PropTypes.bool.isRequired,
	fetchChatDetails: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		chatDetails: state.messages.currentChatDetails,
		error: createErrorMessageSelector(['FETCH_CHAT_DETAILS'])(state),
		isLoading: createLoadingSelector(['FETCH_CHAT_DETAILS'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchChatDetails: chatId => dispatch(fetchChatDetails(chatId))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatMessagesPage)
