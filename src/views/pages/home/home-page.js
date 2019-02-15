import _ from 'lodash'
import { Container, Fab, Icon, Tab, Tabs, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import PastRound from '../../../components/PastRound/PastRound'
import RoundDetails from '../../../components/RoundDetails/RoundDetails'
import RoundDowntime from '../../../components/RoundWarnings/RoundDowntime'
import RoundMissed from '../../../components/RoundWarnings/RoundMissed'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import * as FONTS from '../../../styles/fonts'
import * as FONTS_STYLES from '../../../styles/fontStyles'
import { LUMINOS_ACCENT } from '../../../styles/colors'
import { fetchMyRounds, joinRound, resignRound } from './scenario-actions'

const JoinRoundButton = ({ onPress }) => (
	<UserColorAwareComponent>
		{color => (
			<Fab
				active
				containerStyle={styles.joinRoundButtonContainer}
				style={[
					{
						backgroundColor: color
					},
					styles.joinRoundButtonContainer
				]}
				position="bottomRight"
				onPress={onPress}
			>
				<View style={styles.joinRoundButtonChildrenContainer}>
					<Icon
						type="MaterialIcons"
						name="add"
						style={styles.joinRoundButtonIcon}
					/>
					<Text style={styles.joinRoundButtonText}>
						{I18n.t('home.join_round').toUpperCase()}
					</Text>
				</View>
			</Fab>
		)}
	</UserColorAwareComponent>
)

JoinRoundButton.propTypes = {
	onPress: PropTypes.func.isRequired
}

const ScrollViewWithPullToRefresh = ({ children, isLoading, onRefresh }) => (
	<ScrollView
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
	}

	fetchRounds = this.props.fetchRounds

	getComponentForCurrentRounds = () => {
		const {
			futureRounds: future,
			currentRounds: current,
			isLoading
		} = this.props

		if (isLoading) {
			return null
		}
		if (future.length === 0 && current.length === 0) {
			return (
				<ScrollViewWithPullToRefresh
					isLoading={isLoading}
					onRefresh={this.fetchRounds}
				>
					<RoundDowntime />
				</ScrollViewWithPullToRefresh>
			)
		}
		if (
			future.length === 0 &&
			current.length !== 0 &&
			!_.some(current, 'subscribed')
		) {
			return (
				<ScrollViewWithPullToRefresh
					isLoading={isLoading}
					onRefresh={this.fetchRounds}
				>
					<RoundMissed />
				</ScrollViewWithPullToRefresh>
			)
		}

		if (future.length !== 0) {
			return (
				<React.Fragment>
					<ScrollViewWithPullToRefresh
						isLoading={isLoading}
						onRefresh={this.fetchRounds}
					>
						<RoundDetails round={future[0]} onResignClick={this.handleResign} />
					</ScrollViewWithPullToRefresh>
					{!future[0].subscribed && (
						<JoinRoundButton onPress={this.handleJoin} />
					)}
				</React.Fragment>
			)
		}
	}

	handleResign = () => {
		this.props.resignRound(this.props.futureRounds[0])
	}

	handleJoin = () => {
		this.props.joinRound(this.props.futureRounds[0])
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
						<Tabs
							style={{ backgroundColor: 'transparent', borderBottomWidth: 0 }}
							tabBarUnderlineStyle={{ height: 0 }}
							tabContainerStyle={{
								borderBottomWidth: 1,
								borderBottomColor: '#0f0f0f'
							}}
							onChangeTab={() => {}}
							tabBarPosition={'overlayTop'}
						>
							<Tab
								style={{ backgroundColor: 'transparent' }}
								textStyle={{ color: 'white' }}
								activeTextStyle={{ color: 'white' }}
								activeTabStyle={styles.activeTabStyle}
								tabStyle={styles.tabStyle}
								heading={I18n.t('tabs.current').toUpperCase()}
							>
								{this.getComponentForCurrentRounds()}
							</Tab>
							<Tab
								style={{ backgroundColor: 'transparent' }}
								textStyle={{ color: 'white' }}
								activeTextStyle={{ color: 'white' }}
								activeTabStyle={styles.activeTabStyle}
								tabStyle={styles.tabStyle}
								heading={I18n.t('tabs.my').toUpperCase()}
							>
								<ScrollViewWithPullToRefresh
									isLoading={this.props.isLoading}
									onRefresh={this.fetchRounds}
								>
									{this.props.pastRounds.length === 0 && (
										<Text style={styles.emptyListText}>
											{I18n.t('home.no_rounds')}
										</Text>
									)}
									{this.props.pastRounds.map(round => (
										<PastRound
											key={`past-round-index-${round.id}`}
											round={round}
										/>
									))}
								</ScrollViewWithPullToRefresh>
							</Tab>
						</Tabs>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	activeTabStyle: {
		backgroundColor: '$primaryBackgroundColor',
		paddingLeft: 0,
		paddingRight: 0,
		color: LUMINOS_ACCENT,
		borderBottomWidth: 2,
		borderBottomColor: 'white'
	},
	tabStyle: {
		backgroundColor: '$primaryBackgroundColor',
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent'
	},
	emptyListText: {
		color: 'white',
		fontSize: 20,
		paddingLeft: 32,
		paddingRight: 32,
		paddingTop: 32,
		textAlign: 'center'
	},
	joinRoundButton: {
		flex: 1,
		borderRadius: 49,
		width: 200
	},
	joinRoundButtonContainer: {
		width: 230,
		height: 60,
		bottom: 5
	},
	joinRoundButtonChildrenContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	joinRoundButtonIcon: {
		color: 'black',
		fontSize: 30
	},
	joinRoundButtonText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'black',
		fontSize: 15,
		letterSpacing: 1.25,
		marginLeft: 10
	}
})

HomePage.propTypes = {
	navigation: PropTypes.object,
	pastRounds: PropTypes.array.isRequired,
	fetchRounds: PropTypes.func.isRequired,
	futureRounds: PropTypes.array.isRequired,
	currentRounds: PropTypes.array.isRequired,
	joinRound: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	resignRound: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		error: createErrorMessageSelector(['FETCH_MY_ROUNDS'])(state),
		isLoading: createLoadingSelector(['FETCH_MY_ROUNDS'])(state),
		pastRounds: state.rounds.pastRounds,
		currentRounds: state.rounds.currentRounds,
		futureRounds: state.rounds.futureRounds
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchRounds: data => dispatch(fetchMyRounds(data)),
		joinRound: round => dispatch(joinRound(round)),
		resignRound: round => dispatch(resignRound(round))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage)
