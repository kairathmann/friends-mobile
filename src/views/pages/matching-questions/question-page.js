import { Container, Content, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import Question from '../../../components/Question/Question'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { createLoadingSelector } from '../../../store/utils/selectors'

import { COLORS, styles as commonStyles } from '../../../styles/index'
import { saveAnswered } from './scenario-actions'
import { PAGES_NAMES } from '../../../navigation/pages'

class QuestionsPageProfileEditView extends React.Component {
	PAGE_NAME = PAGES_NAMES.QUESTION_PAGE_PROFILE_EDIT_VIEW
	state = {
		question: this.props.navigation.getParam('question')
	}

	onChangeAnswer = answer => {
		const { question } = this.state
		if (question.lastAnswer !== answer.id) {
			this.props.saveAnswered({
				[question.id]: {
					selected: answer.id
				}
			})
		}
	}

	render() {
		const { question } = this.state
		const { lastAnswer } = question
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<View style={styles.questionContainer}>
								<Question
									fullScreenMode
									answers={question.answers}
									text={question.text}
									selectedAnswer={lastAnswer}
									onChangeAnswer={this.onChangeAnswer}
								/>
							</View>
							<NavigationBottomBar
								rightHidden={true}
								onLeftClick={() => this.props.navigation.goBack()}
							/>
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
	}
})

QuestionsPageProfileEditView.propTypes = {
	navigation: PropTypes.object,
	saveAnswered: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
	return {
		isLoading: createLoadingSelector(['SAVE_MATCHING_ANSWERS'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveAnswered: data => dispatch(saveAnswered(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionsPageProfileEditView)
