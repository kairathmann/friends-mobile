import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Keyboard, StatusBar } from 'react-native'
import { NavigationEvents, SafeAreaView } from 'react-navigation'
import EStyleSheet from 'react-native-extended-stylesheet'
import validator from 'validator'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import TextInput from '../../../components/TextInput/TextInput'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import I18n from '../../../../locales/i18n'
import * as FONTS from '../../../styles/fonts'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { clearPhoneNumberErrorState, requestSmsCode } from './scenario-actions'

const NOT_VALID_PHONE_NUMBER_ERROR = I18n.t('errors.phone_number_invalid')

class AuthPagePhoneNumberPage extends React.Component {
	state = {
		phoneCountryCode: this.props.phoneNumberCountryCode,
		phoneNumber: this.props.phoneNumber,
		phoneNumberValid: true,
		validationEnabled: false
	}

	inputs = {}

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
			phoneNumberValid: this.validatePhoneNumber(
				this.state.phoneCountryCode,
				this.state.phoneNumber
			)
		})
	}

	validatePhoneNumber = (phoneCountryCode, phoneNumber) => {
		const phoneNumberCountryCode = phoneCountryCode.startsWith('+')
			? phoneCountryCode
			: `+${phoneCountryCode}`
		const phoneNumberToTest = `${phoneNumberCountryCode}${phoneNumber}`
		return validator.isMobilePhone(phoneNumberToTest, 'any', {
			strictMode: true
		})
	}

	focusNextField = id => {
		this.inputs[id]._root.focus()
	}

	handlePhoneSignup = () => {
		this.setState({ validationEnabled: true }, () => {
			const { phoneCountryCode, phoneNumber } = this.state
			const phoneNumberValid = this.validatePhoneNumber(
				phoneCountryCode,
				phoneNumber
			)
			Keyboard.dismiss()
			if (phoneNumberValid) {
				this.props.requestSmsCode(phoneCountryCode, phoneNumber)
			} else {
				this.setState({ phoneNumberValid })
			}
		})
	}

	renderErrorMessage = () => {
		let errorMessage = ''
		// if we have server error then display that
		if (this.props.smsError !== '') {
			errorMessage = this.props.smsError
		} else if (this.state.validationEnabled && !this.state.phoneNumberValid) {
			// if not server error message but validation is enabled and phone number is invalid then show constant error message
			errorMessage = NOT_VALID_PHONE_NUMBER_ERROR
		}
		if (errorMessage === '') {
			return null
		}
		return (
			<Text style={[styles.phoneControlCatpionText, commonStyles.errorText]}>
				{errorMessage}
			</Text>
		)
	}

	clearErrors = () => {
		if (this.props.smsError) {
			this.props.clearPhoneNumberError()
		}
		if (this.state.validationEnabled) {
			this.setState({ validationEnabled: false, phoneNumberValid: true })
		}
	}

	renderPhoneNumberInput = () => (
		<View style={styles.phoneControlContainer}>
			<View style={styles.phoneInputsContainer}>
				<View style={styles.phoneCountryCodeContainer}>
					<TextInput
						prefix={'+'}
						value={this.state.phoneCountryCode}
						maxLength={5}
						placeholder="1"
						onChange={text => this.handleChange(text, 'phoneCountryCode')}
						keyboardType="phone-pad"
						containerStyle={styles.phoneCountryCodeInputCustom}
						blurOnSubmit={false}
						returnKeyType={'next'}
						getRef={input => {
							this.inputs['phoneNumberCountryCode'] = input
						}}
						onSubmitEditing={() => {
							this.focusNextField('phoneNumber')
						}}
						status={
							this.props.smsError !== '' ||
							(this.state.validationEnabled && !this.state.phoneNumberValid)
								? 'error'
								: 'normal'
						}
					/>
				</View>
				<View style={styles.phoneNumberContainer}>
					<TextInput
						value={this.state.phoneNumber}
						maxLength={14}
						placeholder={I18n.t('onboarding.phone_number_placeholder')}
						onChange={text => this.handleChange(text, 'phoneNumber')}
						keyboardType="phone-pad"
						containerStyle={styles.phoneNumberInputCustom}
						blurOnSubmit={true}
						returnKeyType={'done'}
						getRef={input => {
							this.inputs['phoneNumber'] = input
						}}
						onSubmitEditing={this.handlePhoneSignup}
						status={
							this.props.smsError !== '' ||
							(this.state.validationEnabled && !this.state.phoneNumberValid)
								? 'error'
								: 'normal'
						}
					/>
				</View>
			</View>
			<View style={styles.phoneControlCaptions}>
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
							<OnboardingHeader
								pageNumber={1}
								leftText={I18n.t('onboarding.sign_up')}
								totalPage={2}
							/>
							<View style={styles.descriptionContainer}>
								<Text style={styles.headerText}>
									{I18n.t('commons.phone_number')}
								</Text>
								<Text style={[styles.descriptionText]}>
									{I18n.t('onboarding.auth_phone_number_caption')}
								</Text>
							</View>
							{this.renderPhoneNumberInput()}
							<NavigationBottomBar
								rightDisabled={
									this.props.isLoading ||
									(this.state.validationEnabled && !this.state.phoneNumberValid)
								}
								onLeftClick={() => this.props.navigation.goBack()}
								onRightClick={() => this.handlePhoneSignup()}
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
		fontSize: 32,
		letterSpacing: 0.25,
		marginBottom: 30
	},
	descriptionText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'center',
		color: 'white',
		fontSize: 14,
		lineHeight: 18,
		letterSpacing: 0.25,
		marginLeft: 40,
		marginRight: 40
	},
	phoneControlContainer: {
		flex: 1,
		marginLeft: 16,
		marginRight: 16
	},
	phoneInputsContainer: {
		flex: 2,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	phoneCountryCodeContainer: {
		flex: 3
	},
	phoneCountryCodeInputCustom: {
		borderBottomRightRadius: 0,
		borderTopRightRadius: 0
	},
	phoneNumberContainer: {
		flex: 7
	},
	phoneNumberInputCustom: {
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,
		marginLeft: 0
	},
	phoneControlCaptions: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	phoneControlCatpionText: {
		...createFontStyle(FONTS.LATO),
		lineHeight: 16,
		fontSize: 13,
		letterSpacing: 0.4,
		color: '$strongGreyColor'
	}
})

AuthPagePhoneNumberPage.defaultProps = {
	isLoading: false,
	smsError: ''
}

AuthPagePhoneNumberPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	phoneNumberCountryCode: PropTypes.string,
	phoneNumber: PropTypes.string,
	requestSmsCode: PropTypes.func.isRequired,
	clearPhoneNumberError: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	smsError: PropTypes.string.isRequired
}

const mapStateToProps = state => {
	return {
		phoneNumberCountryCode: state.auth.phoneNumberCountryCode,
		phoneNumber: state.auth.phoneNumber,
		smsError: createErrorMessageSelector(['SMS_CODE'])(state),
		isLoading: createLoadingSelector(['SMS_CODE'])(state)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		requestSmsCode: (phoneNumberCountryCode, phoneNumber) =>
			dispatch(requestSmsCode(phoneNumberCountryCode, phoneNumber)),
		clearPhoneNumberError: () => dispatch(clearPhoneNumberErrorState())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthPagePhoneNumberPage)
