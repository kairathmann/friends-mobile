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

class RoundConversationWaitroom extends React.Component {
	componentDidMount() {
		this.fetchChats()
	}

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
		this.props.fetchChats(this.props.round.id)
	}

	render() {
		const { chats } = this.props

		return (
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={this.props.isLoading}
						onRefresh={this.fetchChats}
					/>
				}
			>
				<View style={styles.contentContainer}>
					<Text style={styles.title}>{I18n.t('home.meet_matches')}</Text>
					{chats.map(chat => (
						<ChatItem
							key={`chat-index-${chat.id}`}
							onClick={() => this.onChatClick(chat)}
							chat={chat}
						/>
					))}
				</View>
			</ScrollView>
		)
	}
}

RoundConversationWaitroom.propTypes = {
	round: PropTypes.shape({
		id: PropTypes.number.isRequired,
		from: PropTypes.string.isRequired,
		to: PropTypes.string.isRequired
	}).isRequired,
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
		padding: 16
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		padding: 8
	}
})

const mapStateToProps = state => {
	return {
		error: createErrorMessageSelector(['FETCH_CHATS'])(state),
		isLoading: createLoadingSelector(['FETCH_CHATS'])(state),
		chats: state.messages.chats
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchChats: round => dispatch(fetchChats(round))
	}
}

export default withNavigation(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(RoundConversationWaitroom)
)
