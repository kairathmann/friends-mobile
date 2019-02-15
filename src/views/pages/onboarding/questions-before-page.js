import { Container, Content, Text, View } from 'native-base'
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
import { PAGES_NAMES } from '../../../navigation/pages'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { fetchQuestions } from './scenario-actions'

class QuestionsBeforePage extends React.Component {
	componentDidMount() {
		this.props.fetchQuestions()
	}

	render() {
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<OnboardingHeader
								pageNumber={3}
								leftText={i18n.t('onboarding.sign_up')}
								totalPage={4}
							/>
							<View style={styles.indent}>
								<Text style={styles.text}>
									{i18n.t('onboarding.questions_prompt')}
								</Text>
								<Text style={styles.smallerText}>
									{i18n.t('onboarding.answer_all_questions')}
								</Text>
							</View>
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										leftDisabled={
											this.props.navigation.getParam('goBackArrowDisabled') ===
											true
										}
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={() =>
											this.props.navigation.navigate(PAGES_NAMES.QUESTIONS_PAGE)
										}
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
	indent: {
		marginLeft: 36,
		marginRight: 36
	},
	text: {
		...createFontStyle(),
		color: 'white',
		fontSize: 36,
		textAlign: 'center',
		marginTop: 48
	},
	smallerText: {
		...createFontStyle(),
		color: 'white',
		fontSize: 15,
		lineHeight: 24,
		textAlign: 'center',
		marginTop: 24
	}
})

QuestionsBeforePage.propTypes = {
	navigation: PropTypes.object,
	fetchQuestions: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		questions: state.onboarding.questions,
		error: createErrorMessageSelector(['FETCH_QUESTIONS'])(state),
		isLoading: createLoadingSelector(['FETCH_QUESTIONS'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchQuestions: data => dispatch(fetchQuestions(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionsBeforePage)
