import { Container, Content, View, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { BackHandler, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import Question from '../../../components/Question/Question'
import { createLoadingSelector } from '../../../store/utils/selectors'
import { createFontStyle, FONTS } from '../../../styles'
import { COLORS, styles as commonStyles } from '../../../styles/index'
import { saveAnswer, showPreviousQuestion } from './scenario-actions'
import { MIN_AMOUNT_OF_ANSWERED_QUESTIONS } from '../../../enums'
import { navigationService } from '../../../services'
import { PAGES_NAMES } from '../../../navigation/pages'
import Alert from '../../../components/Alert'

class QuestionsPage extends React.Component {
	PAGE_NAME = PAGES_NAMES.QUESTIONS_PAGE
	state = {
		showPopupAlert: false,
		answer: {}
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.goBack)
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.goBack)
	}

	openAlert = () => {
		if (!this.state.showPopupAlert) {
			this.setState({ showPopupAlert: true })
		}
	}

	hideAlert = () => {
		if (this.state.showPopupAlert) {
			this.setState({ showPopupAlert: false })
		}
	}

	continueToHomePage = () => {
		this.hideAlert()
		navigationService.navigateAndResetNavigation(PAGES_NAMES.HOME_PAGE)
	}

	onChangeAnswer = (question, answer) => {
		this.setState({
			answer: {
				[question.id]: {
					selected: answer.id
				}
			}
		})
	}

	goBack = () => {
		const { currentQuestionToDisplayIndex } = this.props
		if (currentQuestionToDisplayIndex === 0) {
			this.props.navigation.goBack()
		} else {
			this.props.showPreviousQuestion()
		}
		return true
	}

	saveAnswer = () => {
		const { currentQuestionToDisplayIndex, questions } = this.props
		const shouldRedirectToHomePage =
			currentQuestionToDisplayIndex + 1 === questions.length ||
			questions.length === 0
		this.props.saveAnswer(this.state.answer, shouldRedirectToHomePage)
	}

	render() {
		const { answer, showPopupAlert } = this.state
		const { currentQuestionToDisplayIndex, questions } = this.props
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<UserColorAwareComponent>
						{color => (
							<Alert
								visible={showPopupAlert}
								onDismiss={this.hideAlert}
								title={i18n.t('onboarding.finish_later_alert_title')}
								message={i18n.t('onboarding.finish_later_alert_message')}
								actionButtonCallback={this.continueToHomePage}
								actionButtonText={i18n.t('commons.proceed')}
								actionButtonStyle={{ color }}
							/>
						)}
					</UserColorAwareComponent>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<OnboardingHeader
								pageNumber={
									this.props.onboardingStepsConfig[this.PAGE_NAME] +
									currentQuestionToDisplayIndex
								}
								leftText={i18n.t('onboarding.sign_up')}
								totalPage={this.props.onboardingMaxSteps}
							/>
							{questions.length > 0 &&
								currentQuestionToDisplayIndex < questions.length && (
									<View style={styles.questionContainer}>
										<Question
											fullScreenMode
											answers={questions[currentQuestionToDisplayIndex].answers}
											text={questions[currentQuestionToDisplayIndex].text}
											selectedAnswer={
												answer[questions[currentQuestionToDisplayIndex].id]
													? answer[questions[currentQuestionToDisplayIndex].id]
															.selected
													: null
											}
											onChangeAnswer={answer =>
												this.onChangeAnswer(
													questions[currentQuestionToDisplayIndex],
													answer
												)
											}
										/>
									</View>
								)}
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										rightDisabled={
											currentQuestionToDisplayIndex < questions.length &&
											!this.state.answer[
												questions[currentQuestionToDisplayIndex].id
											]
										}
										onLeftClick={this.goBack}
										onRightClick={this.saveAnswer}
										rightArrowColor={color}
										centerComponent={
											currentQuestionToDisplayIndex + 1 >
											MIN_AMOUNT_OF_ANSWERED_QUESTIONS ? (
												<Text
													onPress={this.openAlert}
													style={styles.finishLaterText}
												>
													{i18n.t('onboarding.finish_later')}
												</Text>
											) : null
										}
									/>
								)}
							</UserColorAwareComponent>
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	questionContainer: {
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 16,
		paddingRight: 16,
		marginLeft: 16,
		marginRight: 16,
		marginTop: 0,
		marginBottom: 8
	},
	finishLaterText: {
		...createFontStyle(FONTS.LATO),
		fontSize: 13,
		lineHeight: 16,
		color: '$greyColor',
		letterSpacing: 0.4,
		textDecorationLine: 'underline'
	}
})

QuestionsPage.propTypes = {
	navigation: PropTypes.object,
	questions: PropTypes.array.isRequired,
	saveAnswer: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	currentQuestionToDisplayIndex: PropTypes.number.isRequired,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired,
	showPreviousQuestion: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		questions: state.onboarding.questions,
		currentQuestionToDisplayIndex:
			state.onboarding.currentQuestionToDisplayIndex,
		isLoading: createLoadingSelector(['SAVE_ANSWERS'])(state),
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveAnswer: (data, shouldRedirectToHomePage) =>
			dispatch(saveAnswer(data, shouldRedirectToHomePage)),
		showPreviousQuestion: () => dispatch(showPreviousQuestion())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionsPage)
