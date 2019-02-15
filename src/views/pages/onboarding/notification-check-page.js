import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import i18n from '../../../../locales/i18n'
import Button from '../../../components/Button/Button'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { PAGES_NAMES } from '../../../navigation/pages'
import { register } from '../../../services/pushNotificationService'
import configuredStore from '../../../store'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'

class NotificationCheckPage extends React.Component {
	handleCheckNotifications = () => {
		register(configuredStore)
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
									{i18n.t('onboarding.notifications_right')}
								</Text>
								<Button
									buttonStyle={styles.spaceAbove}
									onPress={this.handleCheckNotifications}
									text={'Allow push notifications'}
								/>
							</View>
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={() =>
											this.props.navigation.navigate(
												PAGES_NAMES.QUESTIONS_BEFORE_PAGE
											)
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
	spaceAbove: {
		marginTop: 32
	},
	text: {
		...createFontStyle(),
		color: 'white',
		fontSize: 36,
		textAlign: 'center',
		marginTop: 48
	}
})

NotificationCheckPage.propTypes = {
	navigation: PropTypes.object
}

export default NotificationCheckPage
