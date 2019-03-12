import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import i18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { PAGES_NAMES } from '../../../navigation/pages'
import {
	defaultFontTypes,
	CommonOnboardingStyles,
	styles as commonStyles
} from '../../../styles'
import * as COLORS from '../../../styles/colors'

class QuestionsBeforePage extends React.Component {
	PAGE_NAME = PAGES_NAMES.QUESTIONS_BEFORE_PAGE
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
								pageNumber={this.props.onboardingStepsConfig[this.PAGE_NAME]}
								leftText={i18n.t('onboarding.sign_up')}
								totalPage={this.props.onboardingMaxSteps}
							/>
							<View
								style={CommonOnboardingStyles.descriptionContainerMarginBottom}
							>
								<Text
									style={[
										defaultFontTypes.H4,
										CommonOnboardingStyles.pageHeading
									]}
								>
									{i18n.t('onboarding.questions_prompt')}
								</Text>
								<Text
									style={[
										defaultFontTypes.Body2,
										CommonOnboardingStyles.pageBody
									]}
								>
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

QuestionsBeforePage.propTypes = {
	navigation: PropTypes.object,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
	}
}

export default connect(
	mapStateToProps,
	null
)(QuestionsBeforePage)
