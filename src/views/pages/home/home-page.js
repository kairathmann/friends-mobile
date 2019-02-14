import _ from 'lodash'
import { Container, Tab, Tabs, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import PastRound from '../../../components/PastRound/PastRound'
import RoundDetails from '../../../components/RoundDetails/RoundDetails'
import RoundDowntime from '../../../components/RoundWarnings/RoundDowntime'
import RoundMissed from '../../../components/RoundWarnings/RoundMissed'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { LUMINOS_ACCENT } from '../../../styles/colors'
import { fetchMyRounds, joinRound, resignRound } from './scenario-actions'

class HomePage extends React.Component {
	componentDidMount() {
		this.props.fetchPastRounds()
	}

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
			return <RoundDowntime />
		}
		if (
			future.length === 0 &&
			current.length !== 0 &&
			!_.some(current, 'subscribed')
		) {
			return <RoundMissed />
		}

		if (future.length !== 0) {
			return (
				<RoundDetails
					round={future[0]}
					onResignClick={this.handleResign}
					onJoinClick={this.handleJoin}
				/>
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
	}
})

HomePage.propTypes = {
	navigation: PropTypes.object,
	pastRounds: PropTypes.array.isRequired,
	fetchPastRounds: PropTypes.func.isRequired,
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
		fetchPastRounds: data => dispatch(fetchMyRounds(data)),
		joinRound: round => dispatch(joinRound(round)),
		resignRound: round => dispatch(resignRound(round))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage)
