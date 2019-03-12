import React from 'react'
import { View } from 'native-base'
import PropTypes from 'prop-types'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import Question from '../Question/Question'
import { createLoadingSelector } from '../../store/utils/selectors'
import UserColorAwareComponent from '../UserColorAwareComponent'
import { NavigationBottomBar } from '../NavigationBottomBar/NavigationBottomBar'
import { goBack as goToPreviousPage } from '../../services/navigationService'
import {
	decrementIndex,
	incrementIndex,
	setAnswer
} from '../../store/unanswered_wizard/actions'
import { saveSingleAnswer } from './scenario-actions'

class UnansweredQuestionWizard extends React.Component {
	selectedAnswerId

	onChangeAnswer = answer => {
		const { saveUnanswered } = this.props
		this.selectedAnswerId = answer.id
		saveUnanswered(answer.id)
	}

	goBack = () => {
		const {
			currentQuestionToDisplayIndex,
			onLeftClick,
			decrementIndex
		} = this.props
		if (currentQuestionToDisplayIndex === 0) {
			goToPreviousPage()
		} else {
			decrementIndex()
			onLeftClick()
		}
	}

	goForward = () => {
		const {
			onRightClick,
			currentQuestionToDisplayIndex,
			questions,
			incrementIndex
		} = this.props
		if (currentQuestionToDisplayIndex !== questions.length - 1) {
			incrementIndex()
			onRightClick()
		}
	}

	render() {
		const {
			leftDisabled,
			rightDisabled,
			isLoading,
			questions,
			currentQuestionToDisplayIndex,
			bottomBarCenterComponent
		} = this.props
		if (questions.length === 0) {
			return null
		}
		return (
			<React.Fragment>
				<View style={styles.questionContainer}>
					<Question
						fullScreenMode
						answers={questions[currentQuestionToDisplayIndex].answers}
						text={questions[currentQuestionToDisplayIndex].text}
						selectedAnswer={this.selectedAnswerId}
						onChangeAnswer={this.onChangeAnswer}
					/>
				</View>
				<UserColorAwareComponent>
					{color => (
						<NavigationBottomBar
							leftDisabled={isLoading || leftDisabled}
							rightHidden={
								isLoading ||
								currentQuestionToDisplayIndex === questions.length - 1 ||
								rightDisabled
							}
							onLeftClick={this.goBack}
							onRightClick={this.goForward}
							centerComponent={bottomBarCenterComponent}
							rightArrowColor={color}
						/>
					)}
				</UserColorAwareComponent>
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
	}
})

UnansweredQuestionWizard.defaultProps = {
	leftDisabled: false,
	rightDisabled: false,
	onLeftClick: () => ({}),
	onRightClick: () => ({})
}

UnansweredQuestionWizard.propTypes = {
	questions: PropTypes.array.isRequired,
	onChangeAnswer: PropTypes.func,
	isLoading: PropTypes.bool.isRequired,
	loadingAction: PropTypes.string,
	leftDisabled: PropTypes.bool,
	rightDisabled: PropTypes.bool,
	onLeftClick: PropTypes.func,
	onRightClick: PropTypes.func,
	bottomBarCenterComponent: PropTypes.node,
	saveUnanswered: PropTypes.func.isRequired,
	decrementIndex: PropTypes.func.isRequired,
	incrementIndex: PropTypes.func.isRequired,
	currentQuestionToDisplayIndex: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => {
	return {
		isLoading: createLoadingSelector([ownProps.loadingAction])(state),
		questions: state.questionsWizard.questions,
		currentQuestionToDisplayIndex: state.questionsWizard.questionIndex
	}
}

const mapDispatchToProps = dispatch => {
	return {
		incrementIndex: () => dispatch(incrementIndex()),
		decrementIndex: () => dispatch(decrementIndex()),
		setAnswer: (questionId, answerId) =>
			dispatch(setAnswer(questionId, answerId)),
		saveUnanswered: answerId => dispatch(saveSingleAnswer(answerId))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UnansweredQuestionWizard)
