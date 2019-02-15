import { Container, Icon, Tab, Tabs, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { LayoutAnimation, ScrollView, StatusBar, Text } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import I18n from '../../../../locales/i18n'
import Question from '../../../components/Question/Question'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent/UserColorAwareComponent'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { LUMINOS_ACCENT } from '../../../styles/colors'
import { fetchQuestions, saveAnswers } from './scenario-actions'

class MatchingQuestionsPage extends React.Component {
	state = {
		answers: {},
		showSave: false
	}

	componentDidMount() {
		this.props.fetchQuestions()
	}

	handleClickAnsweredQuestion = (q, answer) => {
		if (!(this.state.answers[q.id] && this.state.answers[q.id].opened)) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
			this.setState({
				answers: {
					...this.state.answers,
					[q.id]: {
						opened: true,
						selected: q.lastAnswer
					}
				},
				showSave: true
			})
		} else {
			this.onChangeAnswer(q, answer)
		}
	}

	onChangeAnswer = (q, answer) => {
		this.setState({
			answers: {
				...this.state.answers,
				[q.id]: {
					...this.state.answers[q.id],
					selected: answer.id
				}
			},
			showSave: true
		})
	}

	saveQuestions = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		this.props.saveAnswers(this.state.answers)
		this.setState({
			answers: Object.keys(this.state.answers).map(key => {
				return {
					selected: this.state.answers[key].selected,
					opened: false
				}
			}),
			showSave: false
		})
	}

	renderBottomSaveBar = () => {
		const { showSave } = this.state
		return (
			<UserColorAwareComponent>
				{color => (
					<View style={styles.bar}>
						<Icon
							onPress={() => this.props.navigation.goBack()}
							type={'MaterialIcons'}
							name={'arrow-back'}
							style={[styles.leftArrow, { color }]}
						/>
						<Text
							style={[
								styles.saveText,
								{ color, opacity: showSave ? 1.0 : 0.25 }
							]}
						>
							{i18n.t('matching_questions.save_questions').toUpperCase()}
						</Text>
						<Icon
							onPress={showSave ? this.saveQuestions : () => {}}
							type={'MaterialIcons'}
							name={'check'}
							style={[
								styles.rightArrow,
								{ color, opacity: showSave ? 1.0 : 0.25 }
							]}
						/>
					</View>
				)}
			</UserColorAwareComponent>
		)
	}

	render() {
		const { answered, unanswered } = this.props
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
								heading={I18n.t('tabs.questions').toUpperCase()}
							>
								<ScrollView>
									{unanswered.length === 0 && (
										<Text style={styles.emptyListText}>
											{i18n.t('matching_questions.no_questions')}
										</Text>
									)}
									{unanswered.map(q => (
										<View key={q.id} style={styles.questionContainer}>
											<Question
												answers={q.answers}
												text={q.text}
												selectedAnswer={
													this.state.answers[q.id]
														? this.state.answers[q.id].selected
														: null
												}
												onChangeAnswer={answer =>
													this.onChangeAnswer(q, answer)
												}
											/>
										</View>
									))}
								</ScrollView>
							</Tab>
							<Tab
								style={{ backgroundColor: 'transparent' }}
								textStyle={{ color: 'white' }}
								activeTextStyle={{ color: 'white' }}
								activeTabStyle={styles.activeTabStyle}
								tabStyle={styles.tabStyle}
								heading={I18n.t('tabs.questions_answered').toUpperCase()}
							>
								<ScrollView>
									{answered.map(q => (
										<View key={q.id} style={styles.questionContainer}>
											<Question
												answers={q.answers}
												text={q.text}
												answered={
													!(
														this.state.answers[q.id] &&
														this.state.answers[q.id].opened
													)
												}
												selectedAnswer={
													this.state.answers[q.id] &&
													this.state.answers[q.id].opened
														? this.state.answers[q.id].selected
														: q.lastAnswer
												}
												onChangeAnswer={answer =>
													this.handleClickAnsweredQuestion(q, answer)
												}
											/>
										</View>
									))}
								</ScrollView>
							</Tab>
						</Tabs>
					</Container>
					{this.renderBottomSaveBar()}
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
	questionContainer: {
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '$darkColor',
		marginLeft: 16,
		marginRight: 16,
		marginTop: 0,
		marginBottom: 8,
		borderRadius: 4
	},
	emptyListText: {
		color: 'white',
		fontSize: 20,
		paddingLeft: 32,
		paddingRight: 32,
		paddingTop: 32,
		textAlign: 'center'
	},
	bar: {
		padding: 16,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	saveText: {}
})

MatchingQuestionsPage.propTypes = {
	navigation: PropTypes.object,
	fetchQuestions: PropTypes.func.isRequired,
	saveAnswers: PropTypes.func.isRequired,
	answered: PropTypes.array.isRequired,
	unanswered: PropTypes.array.isRequired
}

const mapStateToProps = state => {
	return {
		error: createErrorMessageSelector(['FETCH_MATCHING_QUESTIONS'])(state),
		isLoading: createLoadingSelector(['FETCH_MATCHING_QUESTIONS'])(state),
		answered: state.profile.questions.answered,
		unanswered: state.profile.questions.unanswered
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchQuestions: () => dispatch(fetchQuestions()),
		saveAnswers: answers => dispatch(saveAnswers(answers))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MatchingQuestionsPage)