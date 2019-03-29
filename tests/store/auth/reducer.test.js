import authReducer from '../../../src/store/auth/reducer'
import * as types from '../../../src/store/auth/action-types'
import * as globalActions from '../../../src/store/global/action-types'

describe('Auth Reducer', () => {
	it('should return the initial state', () => {
		expect(authReducer(undefined, {})).toEqual({
			phoneNumberCountryCode: '',
			phoneNumber: '',
			lastDateSmsCodeSent: '',
			isTelegramUser: false
		})
	})

	it('shoudl handle SET_AUTH_INFO', () => {
		expect(
			authReducer(
				{},
				{
					type: types.SET_AUTH_INFO,
					payload: {
						phoneNumberCountryCode: '48',
						phoneNumber: '123456789',
						lastDateSmsCodeSent: '2019-02-02 12:20:22',
						isTelegramUser: true
					}
				}
			)
		).toEqual({
			phoneNumberCountryCode: '48',
			phoneNumber: '123456789',
			lastDateSmsCodeSent: '2019-02-02 12:20:22',
			isTelegramUser: true
		})
	})

	it('shoudl handle SMS_TOKEN_VERIFICATION_SUCCESS', () => {
		expect(
			authReducer(
				{
					phoneNumberCountryCode: '48',
					phoneNumber: '123456789',
					lastDateSmsCodeSent: '2019-02-02 12:20:22',
					isTelegramUser: true
				},
				{
					type: types.SMS_TOKEN_VERIFICATION_SUCCESS
				}
			)
		).toEqual({
			phoneNumberCountryCode: '',
			phoneNumber: '',
			lastDateSmsCodeSent: '',
			isTelegramUser: true
		})
	})

	it('shoudl handle LOGOUT_USER_AND_CLEAR_DATA', () => {
		expect(
			authReducer(
				{
					phoneNumberCountryCode: '48',
					phoneNumber: '123456789',
					lastDateSmsCodeSent: '2019-02-02 12:20:22',
					isTelegramUser: true
				},
				{
					type: globalActions.LOGOUT_USER_AND_CLEAR_DATA
				}
			)
		).toEqual({
			phoneNumberCountryCode: '',
			phoneNumber: '',
			lastDateSmsCodeSent: '',
			isTelegramUser: false
		})
	})
})
