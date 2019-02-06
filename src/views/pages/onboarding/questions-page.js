import { Container, Content, View, Spinner } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import Question from '../../../components/Question/Question'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { COLORS, styles as commonStyles } from '../../../styles/index'
import { saveAnswers } from './scenario-actions'

class QuestionsPage extends React.Component {
	state = {
		answers: {}
	}

	onChangeAnswer = (question, answer) => {
		this.setState({
			answers: {
				...this.state.answers,
				[question.id]: {
					selected: answer.id
				}
			}
		})
	}

	handleFinish = () => {
		this.props.saveAnswers(this.state.answers)
	}

	render() {
		const { questions } = this.props
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							{this.props.isLoading && <Spinner color={'white'} />}
							<OnboardingHeader
								pageNumber={3}
								leftText={i18n.t('onboarding.sign_up')}
								totalPage={4}
							/>
							{questions.map(q => (
								<View key={q.id} style={styles.questionContainer}>
									<Question
										answers={q.answers}
										text={q.text}
										selectedAnswer={
											this.state.answers[q.id]
												? this.state.answers[q.id].selected
												: null
										}
										onChangeAnswer={answer => this.onChangeAnswer(q, answer)}
									/>
								</View>
							))}
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										rightDisabled={
											Object.keys(this.state.answers).length !==
											this.props.questions.length
										}
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={this.handleFinish}
										rightArrowColor={color}
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
		backgroundColor: '#242937',
		marginLeft: 16,
		marginRight: 16,
		marginTop: 0,
		marginBottom: 8,
		borderRadius: 4
	}
})

QuestionsPage.propTypes = {
	navigation: PropTypes.object,
	questions: PropTypes.array.isRequired,
	saveAnswers: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
	return {
		questions: state.onboarding.questions,
		error: createErrorMessageSelector(['SAVE_ANSWERS'])(state),
		isLoading: createLoadingSelector(['SAVE_ANSWERS'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveAnswers: data => dispatch(saveAnswers(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionsPage)
