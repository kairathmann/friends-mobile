import _ from 'lodash'
import PropTypes from 'prop-types'
import { Container, Content, Icon, Spinner, Text } from 'native-base'
import React from 'react'
import { connect } from 'react-redux'
import { StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'

import { createLoadingSelector } from '../../../store/utils/selectors'
import { saveFeedbackAnswers } from '../../../components/Feedback/scenario-actions'
import I18n from '../../../../locales/i18n'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { FeedbackHeader, FeedbackQuestion } from '../../../components/Feedback'
import { createFontStyle, FONTS } from '../../../styles'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { FEEDBACK_QUESTIONS_TYPE } from '../../../enums'

class FeedbackPage extends React.Component {
	state = {
		chatId: this.props.navigation.getParam('chatId'),
		// [{}, { questionId: 1, type: 'RATING / TEXT', answer: 1-5/text }]
		answers: []
	}

	closeFeedbackPage = () => {
		this.props.navigation.goBack()
	}

	saveFeedback = () => {
		this.props.saveFeedbackAnswers(this.state.chatId, this.state.answers)
	}

	isEveryRequiredQuestionAnswered = () => {
		const { answers } = this.state
		const { questions } = this.props
		// every RATING question need to have an answer
		const idsOfRequiredQuestions = questions
			.filter(question => question.type === FEEDBACK_QUESTIONS_TYPE.RATING)
			.map(question => question.id)
		const idsOfAnsweredQuestions = answers
			.filter(answer => answer.type === FEEDBACK_QUESTIONS_TYPE.RATING)
			.map(answer => answer.questionId)
		return idsOfAnsweredQuestions.length >= idsOfRequiredQuestions.length
	}

	onQuestionAnswerChange = (questionId, questionType, newAnswer) => {
		const clonedAnswers = _.cloneDeep(this.state.answers)
		const answerIndex = clonedAnswers.findIndex(
			answer => answer.questionId === questionId
		)
		const answerExist = answerIndex !== -1
		if (answerExist) {
			clonedAnswers[answerIndex].answer = newAnswer
		} else {
			clonedAnswers.push({ questionId, type: questionType, answer: newAnswer })
		}
		this.setState({
			answers: clonedAnswers
		})
	}

	renderSingleQuestion = question => {
		const { answers } = this.state
		const answerIndex = answers.findIndex(
			answer => answer.questionId === question.id
		)
		const answerExist = answerIndex !== -1
		return (
			<View
				style={styles.feedbackQuestionSpace}
				key={`feedback-question-id-${question.id}`}
			>
				<FeedbackQuestion
					questionId={question.id}
					questionText={question.text}
					questionType={question.type}
					selectedAnswer={
						answerExist
							? answers[answerIndex].answer
							: question.type === FEEDBACK_QUESTIONS_TYPE.RATING
							? 0
							: ''
					}
					onAnswerChange={this.onQuestionAnswerChange}
				/>
			</View>
		)
	}

	renderBottomPanel = () => {
		const canSaveFeedback = this.isEveryRequiredQuestionAnswered()
		const { isSavingFeedback } = this.props
		return (
			<UserColorAwareComponent>
				{color => (
					<View style={styles.bottom}>
						<View
							style={[
								styles.bottomPanelContainer,
								canSaveFeedback ? styles.bottomPanelOnlyRightItem : ''
							]}
						>
							{!canSaveFeedback && (
								<Text style={styles.errorText}>
									{I18n.t('feedback_page.please_answer_all_questions')}
								</Text>
							)}
							<Icon
								onPress={canSaveFeedback ? this.saveFeedback : null}
								type={'MaterialIcons'}
								name="check"
								style={[
									styles.bottomPanelRightItem,
									{ color },
									!canSaveFeedback || isSavingFeedback
										? styles.bottomPanelItemDisabled
										: ''
								]}
							/>
						</View>
					</View>
				)}
			</UserColorAwareComponent>
		)
	}

	render() {
		const { isSavingFeedback, questions } = this.props
		return (
			<React.Fragment>
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						{isSavingFeedback && <Spinner color="white" />}
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<FeedbackHeader opened onCancelClick={this.closeFeedbackPage} />
							<View style={styles.feedbackContainer}>
								{questions.map(singleQuestion =>
									this.renderSingleQuestion(singleQuestion)
								)}
							</View>
							{this.renderBottomPanel()}
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

FeedbackPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	questions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			text: PropTypes.string.isRequired,
			type: PropTypes.oneOfType([
				FEEDBACK_QUESTIONS_TYPE.RATING,
				FEEDBACK_QUESTIONS_TYPE.TEXT
			]).isRequired
		})
	).isRequired,
	isSavingFeedback: PropTypes.bool.isRequired,
	saveFeedbackAnswers: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	feedbackContainer: {
		paddingTop: 32,
		paddingLeft: 16,
		paddingRight: 16
	},
	feedbackQuestionSpace: {
		paddingBottom: 64
	},
	bottomPanelContainer: {
		padding: 16,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	bottomPanelOnlyRightItem: {
		justifyContent: 'flex-end'
	},
	bottomPanelRightItem: {
		alignSelf: 'flex-end'
	},
	bottomPanelItemDisabled: {
		opacity: 0.5
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	errorText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'left',
		color: '#FF564B',
		fontSize: 12,
		letterSpacing: 0.4
	}
})

const mapStateToProps = state => {
	return {
		questions: state.feedback.questions,
		isSavingFeedback: createLoadingSelector(['SAVE_FEEDBACK_ANSWERS'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveFeedbackAnswers: (chatId, answers) =>
			dispatch(saveFeedbackAnswers(chatId, answers))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedbackPage)
