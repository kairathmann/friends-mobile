import moment from 'moment'
import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import I18n from '../../../locales/i18n'
import { createFontStyle } from '../../styles'
import { LATO, TITILLIUM } from '../../styles/fonts'
import { BOLD, NORMAL, SEMI_BOLD } from '../../styles/fontStyles'
import UserColorAwareComponent from '../UserColorAwareComponent'
import UserAvatar from '../UserAvatar'

class ChatItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			nextProps.chat.unread !== this.props.chat.unread ||
			nextProps.chat.lastMessage !== this.props.chat.lastMessage ||
			nextProps.chat.partnerName !== this.props.chat.partnerName ||
			moment(nextProps.chat.lastRead).diff(this.props.chat.lastRead) !== 0
		)
	}
	render() {
		const { chat, onClick, showUnreadCounter } = this.props
		const isUnread = chat.unread !== 0
		const currentDate = moment()
		const lastMessageTimeStamp = moment(chat.lastRead)
		return (
			<TouchableOpacity onPress={() => onClick(chat)}>
				<View
					style={[
						styles.feedbackContainer,
						chat.feedback.show && !chat.feedback.given
							? styles.feedbackContainerLargeSpacing
							: styles.feedbackContainerSmallSpacing
					]}
				>
					<View style={styles.chatItemContainer}>
						<UserAvatar
							emoji={chat.partnerEmoji}
							color={`#${chat.partnerColor.hexValue}`}
							circleSize={48}
							emojiSize={24}
							borderWidth={2}
						/>
						<View style={styles.textsContainer}>
							<Text
								style={[
									styles.chatPartner,
									isUnread ? styles.boldChatPartner : styles.normalChatPartner
								]}
							>
								{chat.partnerName}
							</Text>
							<Text
								numberOfLines={2}
								ellipsizeMode={'tail'}
								style={[
									styles.normalLastMessage,
									isUnread ? styles.boldLastMessage : styles.normalLastMessage
								]}
							>
								{chat.lastMessage}
							</Text>
						</View>
						<View style={styles.infoContainer}>
							<Text style={styles.readDate}>
								{currentDate.isSame(lastMessageTimeStamp, 'day')
									? lastMessageTimeStamp.format('h:mm a')
									: lastMessageTimeStamp.fromNow()}
							</Text>
							{showUnreadCounter && (
								<UserColorAwareComponent>
									{color => (
										<View
											style={[
												styles.unreadCounterContainer,
												{ borderColor: color },
												isUnread
													? { backgroundColor: color }
													: { backgroundColor: 'transparent' }
											]}
										>
											<Text style={styles.unreadCounter}>
												{chat.unread > 0 && chat.unread < 10 && (
													<React.Fragment>{chat.unread}</React.Fragment>
												)}
												{chat.unread >= 10 && (
													<React.Fragment>9+</React.Fragment>
												)}
											</Text>
										</View>
									)}
								</UserColorAwareComponent>
							)}
						</View>
					</View>
					{chat.feedback.show && chat.feedback.given && (
						<View style={styles.feedbackControlsParent}>
							<Text style={styles.givenFeedbackText}>
								{I18n.t('home.feedback_already_given')}
							</Text>
						</View>
					)}
					{chat.feedback.show && !chat.feedback.given && (
						<UserColorAwareComponent>
							{color => (
								<TouchableOpacity>
									<View
										style={[
											styles.feedbackControlsParent,
											styles.feedbackGivenParent,
											{ backgroundColor: color }
										]}
									>
										<Text style={styles.feedbackText}>
											{I18n.t('home.give_feedback').toUpperCase()}
										</Text>
									</View>
								</TouchableOpacity>
							)}
						</UserColorAwareComponent>
					)}
				</View>
			</TouchableOpacity>
		)
	}
}

ChatItem.defaultProps = {
	showUnreadCounter: true
}

ChatItem.propTypes = {
	chat: PropTypes.shape({
		partnerEmoji: PropTypes.string.isRequired,
		partnerColor: PropTypes.shape({
			id: PropTypes.number.isRequired,
			hexValue: PropTypes.string.isRequired
		}).isRequired,
		partnerName: PropTypes.string.isRequired,
		lastMessage: PropTypes.string,
		lastRead: PropTypes.string.isRequired,
		unread: PropTypes.number.isRequired,
		feedback: PropTypes.shape({
			show: PropTypes.bool.isRequired,
			given: PropTypes.bool
		})
	}).isRequired,
	onClick: PropTypes.func.isRequired,
	showUnreadCounter: PropTypes.bool
}

const styles = EStyleSheet.create({
	feedbackContainer: {
		width: '100%',
		flexDirection: 'column',
		borderRadius: 4,
		backgroundColor: '$darkColor'
	},
	feedbackContainerSmallSpacing: {
		marginBottom: 2
	},
	feedbackContainerLargeSpacing: {
		marginBottom: 17
	},
	chatItemContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 12,
		paddingRight: 12
	},
	textsContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
		marginLeft: 12,
		marginRight: 12
	},
	chatPartner: {
		lineHeight: 18,
		fontSize: 14,
		letterSpacing: 0.25,
		color: 'white',
		marginBottom: 4
	},
	normalChatPartner: {
		...createFontStyle(LATO, NORMAL)
	},
	boldChatPartner: {
		...createFontStyle(LATO, BOLD)
	},
	lastMessage: {
		lineHeight: 18,
		fontSize: 14,
		letterSpacing: 0.25
	},
	normalLastMessage: {
		...createFontStyle(LATO, NORMAL),
		color: '$greyColor'
	},
	boldLastMessage: {
		...createFontStyle(LATO, BOLD),
		color: 'white'
	},
	infoContainer: {
		flexDirection: 'column',
		alignItems: 'flex-end',
		alignContent: 'space-between',
		justifyContent: 'space-between',
		marginLeft: 12,
		height: 50
	},
	readDate: {
		...createFontStyle(LATO, NORMAL),
		lineHeight: 16,
		fontSize: 13,
		textAlign: 'right',
		letterSpacing: 0.4,
		color: 'white',
		marginBottom: 4
	},
	unreadCounterContainer: {
		minWidth: 20,
		height: 20,
		borderWidth: 1,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center'
	},
	unreadCounter: {
		...createFontStyle(TITILLIUM, SEMI_BOLD),
		color: 'black',
		letterSpacing: 0.4,
		fontSize: 12,
		textAlign: 'center',
		paddingLeft: 4,
		paddingRight: 4
	},
	feedbackControlsParent: {
		paddingBottom: 6,
		paddingTop: 6,
		alignItems: 'center'
	},
	feedbackGivenParent: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		paddingTop: 14,
		paddingBottom: 14
	},
	feedbackText: {
		...createFontStyle(TITILLIUM, SEMI_BOLD),
		fontSize: 15,
		letterSpacing: 1.25,
		color: 'black'
	},
	givenFeedbackText: {
		...createFontStyle(TITILLIUM, SEMI_BOLD),
		fontSize: 10,
		letterSpacing: 0.4,
		color: '$greyColor'
	}
})

export default ChatItem
