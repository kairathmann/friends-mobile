import PropTypes from 'prop-types'
import React from 'react'

import { FEEDBACK_QUESTIONS_TYPE } from '../../enums'
import RatingQuestion from './RatingQuestion'
import TextQuestion from './TextQuestion'

export default class FeedbackQuestion extends React.PureComponent {
	changeSelectedAnswer = newValue => {
		const { questionId, questionType } = this.props
		this.props.onAnswerChange(questionId, questionType, newValue)
	}

	render() {
		const { questionType, questionText, selectedAnswer } = this.props
		return (
			<React.Fragment>
				{questionType === FEEDBACK_QUESTIONS_TYPE.TEXT && (
					<TextQuestion
						questionText={questionText}
						answerText={selectedAnswer}
						onAnswerChange={this.changeSelectedAnswer}
					/>
				)}
				{questionType === FEEDBACK_QUESTIONS_TYPE.RATING && (
					<RatingQuestion
						questionText={questionText}
						selectedAnswer={selectedAnswer}
						onAnswerChange={this.changeSelectedAnswer}
					/>
				)}
			</React.Fragment>
		)
	}
}

FeedbackQuestion.propTypes = {
	questionText: PropTypes.string.isRequired,
	questionId: PropTypes.number.isRequired,
	questionType: PropTypes.oneOf([
		FEEDBACK_QUESTIONS_TYPE.RATING,
		FEEDBACK_QUESTIONS_TYPE.TEXT
	]).isRequired,
	selectedAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
	onAnswerChange: PropTypes.func.isRequired
}
