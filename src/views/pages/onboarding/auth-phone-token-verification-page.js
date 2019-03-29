import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Keyboard, StatusBar } from 'react-native'
import { NavigationEvents, SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import validator from 'validator'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import TextInput from '../../../components/TextInput/TextInput'
import {
	createFontStyle,
	defaultFontTypes,
	CommonOnboardingStyles,
	styles as commonStyles
} from '../../../styles'
import * as COLORS from '../../../styles/colors'
import I18n from '../../../../locales/i18n'
import * as FONTS from '../../../styles/fonts'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import {
	clearSmsTokenVerificationErrorState,
	requestSmsCode,
	sendVerificationCode
} from './scenario-actions'

const NOT_VALID_VERIFICATION_CODE_ERROR = I18n.t('errors.verification_failed')
const NUMBER_OF_DIGITS = 4
const TIMER_INTERVAL_MS = 100
const TIME_BETWEEN_SMS_RESEND_SECONDS = 30

class AuthPageTokenVerificationPage extends React.Component {
	state = {
		verificationCode: '',
		verificationCodeDigits: Array(NUMBER_OF_DIGITS).fill(''),
		verificationCodeValid: true,
		validationEnabled: false,
		secondsLeftToNextSmsSendTry: TIME_BETWEEN_SMS_RESEND_SECONDS
	}

	inputs = {}
	intervalId = ''
	__isMounted = false

	timerFunction = () => {
		if (!this.__isMounted) {
			return
		}
		const momentOfLastSend = moment(this.props.lastDateSmsCodeSent)
		const momentCurrentTime = moment()
		const timeDifferenceSeconds = momentCurrentTime.diff(
			momentOfLastSend,
			'seconds'
		)
		const timeLeft = TIME_BETWEEN_SMS_RESEND_SECONDS - timeDifferenceSeconds
		if (timeDifferenceSeconds <= TIME_BETWEEN_SMS_RESEND_SECONDS) {
			// we are doing this callback every 100ms so we need to limit number of rerenders
			if (this.state.secondsLeftToNextSmsSendTry - timeLeft > 0) {
				this.setState({ secondsLeftToNextSmsSendTry: timeLeft })
			}
		} else {
			// stop timer
			clearInterval(this.intervalId)
		}
	}

	onEnter = () => {
		this.__isMounted = true
		this.timerFunction()
		this.intervalId = setInterval(this.timerFunction, TIMER_INTERVAL_MS)
		if (this.props.tokenError) {
			this.props.clearSmsTokenVerificationErrorState()
		}
		if (this.state.validationEnabled) {
			this.setState({ validationEnabled: false, phoneNumberValid: true })
		}
	}

	onExit = () => {
		this.__isMounted = false
		clearInterval(this.intervalId)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.lastDateSmsCodeSent !== this.props.lastDateSmsCodeSent) {
			this.intervalId = setInterval(this.timerFunction, TIMER_INTERVAL_MS)
		}
	}

	handleChange = (text, indexInRow) => {
		const clonedCodeDigits = [...this.state.verificationCodeDigits]
		clonedCodeDigits[indexInRow] = text
		const newVerificationCode = clonedCodeDigits.join('')
		this.setState(
			{
				verificationCodeDigits: clonedCodeDigits,
				verificationCode: newVerificationCode
			},
			this.validateForm
		)
		if (text !== '' && indexInRow !== NUMBER_OF_DIGITS - 1) {
			this.focusNextField(indexInRow)
		}
	}

	validateForm = () => {
		this.setState({
			verificationCodeValid: this.validateCode(this.state.verificationCode)
		})
	}

	validateCode = code => {
		return (
			validator.isLength(code, {
				min: NUMBER_OF_DIGITS,
				max: NUMBER_OF_DIGITS
			}) && validator.isNumeric(code, { no_symbols: true })
		)
	}

	focusNextField = currentIndexInRow => {
		this.inputs[`verification-code-${currentIndexInRow + 1}`]._root.focus()
	}

	handleVerificationCodeSend = () => {
		this.setState({ validationEnabled: true }, () => {
			const { verificationCode } = this.state
			const verificationCodeValid = this.validateCode(verificationCode)
			Keyboard.dismiss()
			if (verificationCodeValid) {
				this.props.sendVerificationCode(
					this.props.phoneNumberCountryCode,
					this.props.phoneNumber,
					this.props.isTelegramUser,
					verificationCode
				)
			} else {
				this.setState({ verificationCodeValid })
			}
		})
	}

	renderErrorMessage = () => {
		let errorMessage = ''
		// if we have server error then display that
		if (this.props.tokenError !== '') {
			errorMessage = this.props.tokenError
		} else if (
			this.state.validationEnabled &&
			!this.state.verificationCodeValid
		) {
			// if not server error message but validation is enabled and phone number is invalid then show constant error message
			errorMessage = NOT_VALID_VERIFICATION_CODE_ERROR
		}
		if (errorMessage === '') {
			return null
		}
		return (
			<Text
				style={[
					styles.verificationCodeControlCaptionText,
					commonStyles.errorText
				]}
			>
				{errorMessage}
			</Text>
		)
	}

	renderSingleCodeInput = (indexInRow, isLastInRow) => (
		<View
			style={styles.singleVerificationCodeInputContainer}
			key={`verification-code-${indexInRow}`}
		>
			<TextInput
				value={this.state.verificationCodeDigits[indexInRow]}
				onChange={text => this.handleChange(text, indexInRow)}
				keyboardType="number-pad"
				maxLength={1}
				containerStyle={styles.singleVerificationCodeInputCustom}
				centerInput={true}
				blurOnSubmit={true}
				returnKeyType={isLastInRow ? 'done' : 'next'}
				getRef={input => {
					this.inputs[`verification-code-${indexInRow}`] = input
				}}
				onSubmitEditing={
					isLastInRow
						? this.handleVerificationCodeSend
						: () => this.focusNextField(indexInRow)
				}
				status={
					this.props.tokenError !== '' ||
					(this.state.validationEnabled && !this.state.verificationCodeValid)
						? 'error'
						: 'normal'
				}
			/>
		</View>
	)

	renderVerificationCodeInputs = () => (
		<View style={styles.verificationCodeControlContainer}>
			<View style={styles.verificationCodeInputsContainer}>
				{[...Array(NUMBER_OF_DIGITS)].map((val, index) =>
					this.renderSingleCodeInput(index, index === NUMBER_OF_DIGITS - 1)
				)}
			</View>
			<View style={styles.verificationCodeControlCaptions}>
				{this.renderErrorMessage()}
			</View>
		</View>
	)

	canResendSms = () => this.state.secondsLeftToNextSmsSendTry === 0

	resendCodeMessage = () => {
		if (this.canResendSms()) {
			this.props.requestSmsCode(
				this.props.phoneNumberCountryCode,
				this.props.phoneNumber
			)
			this.setState({
				secondsLeftToNextSmsSendTry: TIME_BETWEEN_SMS_RESEND_SECONDS
			})
		}
	}

	renderResendCodeButton = () => (
		<View style={styles.resendCodeContainer}>
			<Text
				onPress={this.resendCodeMessage}
				style={[
					styles.resendCodeText,
					commonStyles.underline,
					!this.canResendSms() && styles.resendCodeDisabled
				]}
			>
				{I18n.t('onboarding.resend_code_label')}
				{!this.canResendSms() && (
					<React.Fragment>{` (${
						this.state.secondsLeftToNextSmsSendTry
					})`}</React.Fragment>
				)}
			</Text>
		</View>
	)

	render() {
		return (
			<React.Fragment>
				<NavigationEvents onWillBlur={this.onExit} onWillFocus={this.onEnter} />
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<View
								style={CommonOnboardingStyles.descriptionContainerMarginTop}
							>
								<Text
									style={[
										defaultFontTypes.H4,
										CommonOnboardingStyles.pageHeading
									]}
								>
									{I18n.t('onboarding.auth_verification_code_header')}
								</Text>
								<Text
									style={[
										defaultFontTypes.Body2,
										CommonOnboardingStyles.pageBody
									]}
								>
									{I18n.t('onboarding.auth_verification_code_description')}
								</Text>
							</View>
							{this.renderVerificationCodeInputs()}
							{this.renderResendCodeButton()}
							<NavigationBottomBar
								rightDisabled={
									this.props.isLoading ||
									(this.state.validationEnabled &&
										!this.state.verificationCodeValid)
								}
								onLeftClick={() => this.props.navigation.goBack()}
								onRightClick={() => this.handleVerificationCodeSend()}
							/>
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	verificationCodeControlContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	verificationCodeInputsContainer: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	singleVerificationCodeInputContainer: {
		marginLeft: 4,
		marginRight: 4
	},
	singleVerificationCodeInputCustom: {
		width: 60,
		height: 60,
		borderRadius: 10
	},
	verificationCodeControlCaptions: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	verificationCodeControlCaptionText: {
		...createFontStyle(FONTS.LATO),
		lineHeight: 16,
		fontSize: 13,
		letterSpacing: 0.4
	},
	resendCodeContainer: {
		marginTop: 20,
		flex: 1,
		alignItems: 'center'
	},
	resendCodeText: {
		...createFontStyle(FONTS.LATO),
		lineHeight: 16,
		fontSize: 16,
		letterSpacing: 0.4,
		color: 'white',
		textAlign: 'center'
	},
	resendCodeDisabled: {
		color: '$greyColor'
	}
})

AuthPageTokenVerificationPage.defaultProps = {
	isLoading: false,
	tokenError: '',
	isTelegramUser: false
}

AuthPageTokenVerificationPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	phoneNumberCountryCode: PropTypes.string.isRequired,
	phoneNumber: PropTypes.string.isRequired,
	requestSmsCode: PropTypes.func.isRequired,
	sendVerificationCode: PropTypes.func.isRequired,
	clearSmsTokenVerificationErrorState: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	tokenError: PropTypes.string.isRequired,
	lastDateSmsCodeSent: PropTypes.string.isRequired,
	isTelegramUser: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
	return {
		phoneNumberCountryCode: state.auth.phoneNumberCountryCode,
		phoneNumber: state.auth.phoneNumber,
		lastDateSmsCodeSent: state.auth.lastDateSmsCodeSent,
		isTelegramUser: state.auth.isTelegramUser,
		tokenError: createErrorMessageSelector(['SMS_TOKEN_VERIFICATION'])(state),
		isLoading: createLoadingSelector(['SMS_TOKEN_VERIFICATION'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		requestSmsCode: (phoneNumberCountryCode, phoneNumber) =>
			dispatch(requestSmsCode(phoneNumberCountryCode, phoneNumber)),
		sendVerificationCode: (
			phoneNumberCountryCode,
			phoneNumber,
			isTelegramUser,
			verificationCode
		) =>
			dispatch(
				sendVerificationCode(
					phoneNumberCountryCode,
					phoneNumber,
					isTelegramUser,
					verificationCode
				)
			),
		clearSmsTokenVerificationErrorState: () =>
			dispatch(clearSmsTokenVerificationErrorState())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthPageTokenVerificationPage)
