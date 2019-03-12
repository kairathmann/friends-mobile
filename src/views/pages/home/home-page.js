import { Container } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { RefreshControl, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import ConversationWaitroom from '../../../components/ConversationWaitroom/ConversationWaitroom'
import RoundDowntime from '../../../components/RoundWarnings/RoundDowntime'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { fetchMyRounds } from './scenario-actions'
import { fetchChats } from '../../../components/ConversationWaitroom/scenario-actions'
import configuredStore from '../../../store'
import { pushService } from '../../../services'

const ScrollViewWithPullToRefresh = ({ children, isLoading, onRefresh }) => (
	<ScrollView
		contentContainerStyle={commonStyles.scrollableContent}
		refreshControl={
			<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
		}
	>
		{children}
	</ScrollView>
)

ScrollViewWithPullToRefresh.propTypes = {
	children: PropTypes.node.isRequired,
	isLoading: PropTypes.bool.isRequired,
	onRefresh: PropTypes.func.isRequired
}

class HomePage extends React.Component {
	componentDidMount() {
		this.fetchRounds()
		this.fetchChats()
		pushService.initialize(configuredStore, this.props.notificationId)
	}

	fetchChats = this.props.fetchChats
	fetchRounds = this.props.fetchRounds

	getComponentForCurrentRounds = () => {
		const { currentRounds: current, isLoading } = this.props

		if (isLoading) {
			return null
		}
		if (current.length === 0) {
			return (
				<ScrollViewWithPullToRefresh
					isLoading={isLoading}
					onRefresh={this.fetchRounds}
				>
					<RoundDowntime />
				</ScrollViewWithPullToRefresh>
			)
		}

		if (current.length !== 0) {
			return <ConversationWaitroom round={current[0]} />
		}
	}

	render() {
		return (
			<React.Fragment>
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						{this.getComponentForCurrentRounds()}
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

HomePage.propTypes = {
	navigation: PropTypes.object,
	fetchChats: PropTypes.func.isRequired,
	fetchRounds: PropTypes.func.isRequired,
	currentRounds: PropTypes.array.isRequired,
	isLoading: PropTypes.bool.isRequired,
	notificationId: PropTypes.string.isRequired
}

const mapStateToProps = state => {
	return {
		error: createErrorMessageSelector(['FETCH_MY_ROUNDS'])(state),
		isLoading: createLoadingSelector(['FETCH_MY_ROUNDS'])(state),
		currentRounds: state.rounds.currentRounds,
		notificationId: state.profile.notificationId
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchRounds: () => dispatch(fetchMyRounds()),
		fetchChats: () => dispatch(fetchChats())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage)
