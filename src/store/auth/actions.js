import {
	SET_AUTH_INFO,
	SMS_CODE_CLEAR_ERROR,
	SMS_CODE_REQUEST,
	SMS_CODE_SUCCESS,
	SMS_CODE_FAILURE,
	SMS_TOKEN_VERIFICATION_CLEAR_ERROR,
	SMS_TOKEN_VERIFICATION_REQUEST,
	SMS_TOKEN_VERIFICATION_SUCCESS,
	SMS_TOKEN_VERIFICATION_FAILURE,
	TELEGRAM_EMAIL_CLEAR_ERROR,
	TELEGRAM_EMAIL_REQUEST,
	TELEGRAM_EMAIL_SUCCESS,
	TELEGRAM_EMAIL_FAILURE
} from './action-types'

export const setAuthInfo = (phoneNumberCountryCode, phoneNumber) => ({
	type: SET_AUTH_INFO,
	payload: {
		phoneNumberCountryCode,
		phoneNumber
	}
})

export const clearPhoneNumberError = () => ({
	type: SMS_CODE_CLEAR_ERROR
})

export const requestSmsCodeStart = () => ({
	type: SMS_CODE_REQUEST
})

export const requestSmsCodeSuccess = () => ({
	type: SMS_CODE_SUCCESS
})

export const requestSmsCodeError = error => ({
	type: SMS_CODE_FAILURE,
	payload: error
})

export const clearVerificationCodeError = () => ({
	type: SMS_TOKEN_VERIFICATION_CLEAR_ERROR
})

export const smsTokenVerificationStart = () => ({
	type: SMS_TOKEN_VERIFICATION_REQUEST
})

export const smsTokenVerificationSuccess = () => ({
	type: SMS_TOKEN_VERIFICATION_SUCCESS
})

export const smsTokenVerificationError = error => ({
	type: SMS_TOKEN_VERIFICATION_FAILURE,
	payload: error
})

export const setTelegramUser = () => ({
	type: SET_AUTH_INFO,
	payload: {
		isTelegramUser: true
	}
})

export const clearTelegramEmailError = () => ({
	type: TELEGRAM_EMAIL_CLEAR_ERROR
})

export const telegramEmailStart = () => ({
	type: TELEGRAM_EMAIL_REQUEST
})

export const telegramEmailSuccess = () => ({
	type: TELEGRAM_EMAIL_SUCCESS
})

export const telegramEmailError = error => ({
	type: TELEGRAM_EMAIL_FAILURE,
	payload: error
})
