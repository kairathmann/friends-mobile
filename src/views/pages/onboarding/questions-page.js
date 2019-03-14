import { Container, Content, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { createLoadingSelector } from '../../../store/utils/selectors'
import { createFontStyle, FONTS } from '../../../styles'
import { COLORS, styles as commonStyles } from '../../../styles/index'
import { MIN_AMOUNT_OF_ANSWERED_QUESTIONS } from '../../../enums'
import { navigationService } from '../../../services'
import { PAGES_NAMES } from '../../../navigation/pages'
import Alert from '../../../components/Alert'
import UnansweredQuestionWizard from '../../../components/UnansweredQuestionWizard'

class QuestionsPage extends React.Component {
	PAGE_NAME = PAGES_NAMES.QUESTIONS_PAGE
	state = {
		showPopupAlert: false
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

	render() {
		const { showPopupAlert } = this.state
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
								rightText={`${questions.length} left`}
								styles={{
									rightText: {
										...createFontStyle(FONTS.LATO),
										color: 'white',
										letterSpacing: 0.4,
										fontSize: 12
									}
								}}
							/>
							<UnansweredQuestionWizard
								onQuestionsDepleted={() =>
									navigationService.navigateAndResetNavigation(
										PAGES_NAMES.HOME_PAGE
									)
								}
								bottomBarCenterComponent={
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
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
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
	isLoading: PropTypes.bool.isRequired,
	currentQuestionToDisplayIndex: PropTypes.number.isRequired,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
		questions: state.questionsWizard.questions.unanswered,
		currentQuestionToDisplayIndex: state.questionsWizard.questionIndex,
		isLoading: createLoadingSelector(['WIZARD_SAVE_UNANSWERED'])(state),
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
	}
}

export default connect(mapStateToProps)(QuestionsPage)
