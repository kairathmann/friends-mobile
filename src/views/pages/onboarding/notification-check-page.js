import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import i18n from '../../../../locales/i18n'
import Button from '../../../components/Button/Button'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { PAGES_NAMES } from '../../../navigation/pages'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { navigationService, pushService } from '../../../services'

class NotificationCheckPage extends React.Component {
	PAGE_NAME = PAGES_NAMES.NOTIFICATION_CHECK_PAGE
	handleCheckNotifications = () => {
		pushService.register()
	}

	goToNextPage = () => {
		if (this.props.questions.length === 0) {
			navigationService.navigateAndResetNavigation(PAGES_NAMES.HOME_PAGE)
		} else {
			this.props.navigation.navigate(PAGES_NAMES.QUESTIONS_BEFORE_PAGE)
		}
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
								pageNumber={this.props.onboardingStepsConfig[this.PAGE_NAME]}
								leftText={i18n.t('onboarding.sign_up')}
								totalPage={this.props.onboardingMaxSteps}
							/>
							<View style={styles.indent}>
								<Text style={styles.header}>
									{i18n.t('onboarding.notifications_page_header')}
								</Text>
								<Text style={styles.description}>
									{i18n.t('onboarding.notifications_page_description')}
								</Text>
								<Button
									buttonStyle={styles.spaceAbove}
									onPress={this.handleCheckNotifications}
									text={i18n.t('onboarding.notifications_button')}
								/>
							</View>
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={this.goToNextPage}
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
	spaceAbove: {
		marginTop: 32
	},
	header: {
		...createFontStyle(),
		color: 'white',
		fontSize: 32,
		textAlign: 'center',
		marginTop: 48,
		marginBottom: 30
	},
	description: {
		...createFontStyle(),
		marginLeft: 10,
		marginRight: 10,
		color: 'white',
		fontSize: 14,
		lineHeight: 24,
		letterSpacing: 0.1,
		textAlign: 'center'
	}
})

NotificationCheckPage.propTypes = {
	navigation: PropTypes.object,
	questions: PropTypes.array.isRequired,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
		questions: state.onboarding.questions,
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
	}
}

export default connect(
	mapStateToProps,
	null
)(NotificationCheckPage)
