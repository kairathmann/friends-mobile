import * as actions from '../../../src/store/auth/actions'
import * as types from '../../../src/store/auth/action-types'

describe('Auth Actions', () => {
	it('should create action to set phone number and country code', () => {
		const countryCode = '48'
		const phoneNumber = '111222333'
		const expectedAction = {
			type: types.SET_AUTH_INFO,
			payload: {
				phoneNumberCountryCode: countryCode,
				phoneNumber: phoneNumber
			}
		}
		expect(actions.setAuthInfo(countryCode, phoneNumber)).toEqual(
			expectedAction
		)
	})

	it('should create action to clear phone number error', () => {
		const expectedAction = {
			type: types.SMS_CODE_CLEAR_ERROR
		}
		expect(actions.clearPhoneNumberError()).toEqual(expectedAction)
	})

	it('should create action to start requesting sms code', () => {
		const expectedAction = {
			type: types.SMS_CODE_REQUEST
		}
		expect(actions.requestSmsCodeStart()).toEqual(expectedAction)
	})

	it('should create action to finish success requesting sms code', () => {
		const expectedAction = {
			type: types.SMS_CODE_SUCCESS
		}
		expect(actions.requestSmsCodeSuccess()).toEqual(expectedAction)
	})

	it('should create action to finish requesting sms code with error', () => {
		const error = 'TEST-ERROR'
		const expectedAction = {
			type: types.SMS_CODE_FAILURE,
			payload: error
		}
		expect(actions.requestSmsCodeError(error)).toEqual(expectedAction)
	})

	it('should create action to clear verification code error', () => {
		const expectedAction = {
			type: types.SMS_TOKEN_VERIFICATION_CLEAR_ERROR
		}
		expect(actions.clearVerificationCodeError()).toEqual(expectedAction)
	})

	it('should create action to start requesting verification code check', () => {
		const expectedAction = {
			type: types.SMS_TOKEN_VERIFICATION_REQUEST
		}
		expect(actions.smsTokenVerificationStart()).toEqual(expectedAction)
	})

	it('should create action to finish success verification code check', () => {
		const expectedAction = {
			type: types.SMS_TOKEN_VERIFICATION_SUCCESS
		}
		expect(actions.smsTokenVerificationSuccess()).toEqual(expectedAction)
	})

	it('should create action to finish requesting verification code check with error', () => {
		const error = 'TEST-ERROR'
		const expectedAction = {
			type: types.SMS_TOKEN_VERIFICATION_FAILURE,
			payload: error
		}
		expect(actions.smsTokenVerificationError(error)).toEqual(expectedAction)
	})

	it('should create action to set boolean flag to mark user as telegram user', () => {
		const expectedAction = {
			type: types.SET_AUTH_INFO,
			payload: {
				isTelegramUser: true
			}
		}
		expect(actions.setTelegramUser()).toEqual(expectedAction)
	})

	it('should create action to clear telegram user email error', () => {
		const expectedAction = {
			type: types.TELEGRAM_EMAIL_CLEAR_ERROR
		}
		expect(actions.clearTelegramEmailError()).toEqual(expectedAction)
	})

	it('should create action to start requesting telegram user migration', () => {
		const expectedAction = {
			type: types.TELEGRAM_EMAIL_REQUEST
		}
		expect(actions.telegramEmailStart()).toEqual(expectedAction)
	})

	it('should create action to finish success telegram user migration', () => {
		const expectedAction = {
			type: types.TELEGRAM_EMAIL_SUCCESS
		}
		expect(actions.telegramEmailSuccess()).toEqual(expectedAction)
	})

	it('should create action to finish telegram user migration with error', () => {
		const error = 'TEST-ERROR'
		const expectedAction = {
			type: types.TELEGRAM_EMAIL_FAILURE,
			payload: error
		}
		expect(actions.telegramEmailError(error)).toEqual(expectedAction)
	})
})
