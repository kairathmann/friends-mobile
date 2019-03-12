import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Keyboard, StatusBar } from 'react-native'
import { NavigationEvents, SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import validator from 'validator'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import TextInput from '../../../components/TextInput/TextInput'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import I18n from '../../../../locales/i18n'
import * as FONTS from '../../../styles/fonts'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import {
	clearTelegramEmailErrorState,
	registerTelegramUser
} from './scenario-actions'

const NOT_VALID_EMAIL_ADDRESS_ERROR = I18n.t('errors.email_invalid')

class AuthTelegramEmailPage extends React.Component {
	state = {
		email: '',
		emailValid: true,
		validationEnabled: false
	}

	handleChange = (text, field) => {
		this.setState(
			{
				[field]: text
			},
			this.validateForm
		)
	}

	validateForm = () => {
		this.setState({
			emailValid: this.validateEmail(this.state.email)
		})
	}

	validateEmail = email => validator.isEmail(email)

	handleEmailSignup = () => {
		this.setState({ validationEnabled: true }, () => {
			const { email } = this.state
			const emailValid = this.validateEmail(email)
			Keyboard.dismiss()
			if (emailValid) {
				this.props.registerTelegramUser(email)
			} else {
				this.setState({ emailValid })
			}
		})
	}

	renderErrorMessage = () => {
		let errorMessage = ''
		// if we have server error then display that
		if (this.props.emailError !== '') {
			errorMessage = this.props.emailError
		} else if (this.state.validationEnabled && !this.state.emailValid) {
			// if not server error message but validation is enabled and phone number is invalid then show constant error message
			errorMessage = NOT_VALID_EMAIL_ADDRESS_ERROR
		}
		if (errorMessage === '') {
			return null
		}
		return (
			<Text style={[styles.emailControlCatpionText, commonStyles.errorText]}>
				{errorMessage}
			</Text>
		)
	}

	clearErrors = () => {
		if (this.props.emailError) {
			this.props.clearTelegramEmailErrorState()
		}
		if (this.state.validationEnabled) {
			this.setState({ validationEnabled: false, phoneNumberValid: true })
		}
	}

	renderEmailInput = () => (
		<View style={styles.emailControlContainer}>
			<TextInput
				value={this.state.email}
				placeholder={I18n.t('onboarding.auth_telegram_email_placeholder')}
				onChange={text => this.handleChange(text, 'email')}
				blurOnSubmit={true}
				returnKeyType={'done'}
				onSubmitEditing={this.handleEmailSignup}
				status={
					this.props.emailError !== '' ||
					(this.state.validationEnabled && !this.state.emailValid)
						? 'error'
						: 'normal'
				}
			/>
			<View style={styles.emailControlCaptions}>
				{this.renderErrorMessage()}
			</View>
		</View>
	)

	render() {
		return (
			<React.Fragment>
				<NavigationEvents onWillFocus={this.clearErrors} />
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<View style={styles.descriptionContainer}>
								<Text style={styles.headerText}>
									{I18n.t('onboarding.auth_telegram_email_title')}
								</Text>
								<Text style={[styles.descriptionText]}>
									{I18n.t('onboarding.auth_telegram_email_description')}
								</Text>
							</View>
							{this.renderEmailInput()}
							<NavigationBottomBar
								rightDisabled={
									this.props.isLoading ||
									(this.state.validationEnabled && !this.state.emailValid)
								}
								onLeftClick={() => this.props.navigation.goBack()}
								onRightClick={() => this.handleEmailSignup()}
							/>
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	descriptionContainer: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: 20,
		marginRight: 20
	},
	headerText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'center',
		color: 'white',
		fontSize: 35,
		letterSpacing: 0.25,
		marginBottom: 12
	},
	descriptionText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'center',
		color: 'white',
		fontSize: 14,
		lineHeight: 18,
		letterSpacing: 0.25,
		marginLeft: 30,
		marginRight: 30
	},
	emailControlContainer: {
		flex: 1,
		marginLeft: 16,
		marginRight: 16
	},
	emailControlCaptions: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	emailControlCatpionText: {
		...createFontStyle(FONTS.LATO),
		lineHeight: 16,
		fontSize: 13,
		letterSpacing: 0.4,
		color: '$strongGreyColor'
	}
})

AuthTelegramEmailPage.defaultProps = {
	isLoading: false,
	emailError: ''
}

AuthTelegramEmailPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	registerTelegramUser: PropTypes.func.isRequired,
	clearTelegramEmailErrorState: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	emailError: PropTypes.string.isRequired
}

const mapStateToProps = state => {
	return {
		emailError: createErrorMessageSelector(['TELEGRAM_EMAIL'])(state),
		isLoading: createLoadingSelector(['TELEGRAM_EMAIL'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		registerTelegramUser: email => dispatch(registerTelegramUser(email)),
		clearTelegramEmailErrorState: () => dispatch(clearTelegramEmailErrorState())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthTelegramEmailPage)
