import _ from 'lodash'
import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { withNavigation } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import I18n from '../../../locales/i18n'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../store/utils/selectors'
import { createFontStyle } from '../../styles'
import { LATO } from '../../styles/fonts'
import ChatItem from '../ChatItem/ChatItem'
import { fetchChats } from './scenario-actions'
import { PAGES_NAMES } from '../../navigation/pages'
import TimeFormatterRoundBounds from '../TimeFormatters'

class ConversationWaitroom extends React.Component {
	onChatClick = chat => {
		const chatId = chat.id
		const chatType = chat.type
		const partnerInfo = {
			firstName: chat.partnerName,
			emoji: chat.partnerEmoji,
			color: `#${chat.partnerColor.hexValue}`
		}
		this.props.navigation.navigate(PAGES_NAMES.CHAT_MESSAGES_PAGE, {
			chatId,
			chatType,
			partnerInfo
		})
	}

	fetchChats = () => {
		const { fetchChats } = this.props
		fetchChats()
	}

	renderChatItems() {
		const { pastChats, chats } = this.props
		const chatsToDisplay = chats.slice(pastChats ? 1 : 0)
		const sortedChats = _.orderBy(
			chatsToDisplay,
			['unread', 'id'],
			['desc', 'asc']
		)
		return sortedChats.map(chat => (
			<ChatItem
				key={`chat-index-${chat.id}`}
				onClick={() => this.onChatClick(chat)}
				chat={chat}
			/>
		))
	}

	renderBotItem() {
		const brianBot = this.props.chats[0]
		return (
			<ChatItem
				key={`chat-index-${brianBot.id}`}
				onClick={() => this.onChatClick(brianBot)}
				chat={brianBot}
				showUnreadCounter={false}
			/>
		)
	}

	render() {
		const { chats, pastChats } = this.props
		return (
			<React.Fragment>
				{pastChats && chats.length > 0 && (
					<View style={styles.botContainer}>{this.renderBotItem()}</View>
				)}
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.props.isLoading}
							onRefresh={this.fetchChats}
						/>
					}
				>
					<View style={styles.contentContainer}>
						{!pastChats && (
							<React.Fragment>
								<TimeFormatterRoundBounds />
								<Text style={styles.title}>{I18n.t('home.meet_matches')}</Text>
							</React.Fragment>
						)}
						{chats.length > 0 && this.renderChatItems()}
					</View>
				</ScrollView>
			</React.Fragment>
		)
	}
}

ConversationWaitroom.defaultProps = {
	pastChats: false
}

ConversationWaitroom.propTypes = {
	pastChats: PropTypes.bool.isRequired,
	fetchChats: PropTypes.func.isRequired,
	chats: PropTypes.array.isRequired,
	isLoading: PropTypes.bool.isRequired,
	navigation: PropTypes.object.isRequired
}

const styles = EStyleSheet.create({
	title: {
		...createFontStyle(LATO),
		lineHeight: 24,
		fontSize: 16,
		textAlign: 'center',
		letterSpacing: 0.5,
		color: 'white',
		paddingBottom: 16
	},
	botContainer: {
		marginTop: 16,
		marginBottom: 24,
		paddingLeft: 8,
		paddingRight: 8
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		padding: 8
	}
})

// filter depending on prop whether to fetch past / current chats
const mapStateToProps = (state, ownProps) => {
	return {
		error: createErrorMessageSelector(['FETCH_CHATS'])(state),
		isLoading: createLoadingSelector(['FETCH_CHATS'])(state),
		chats: state.messages.chats.filter(
			ownProps.pastChats ? chat => !chat.roundId : chat => chat.roundId
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchChats: () => dispatch(fetchChats())
	}
}

export default withNavigation(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ConversationWaitroom)
)
