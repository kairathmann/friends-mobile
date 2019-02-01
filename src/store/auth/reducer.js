import moment from 'moment'
import {
	SET_AUTH_INFO,
	SMS_CODE_SUCCESS,
	SMS_TOKEN_VERIFICATION_SUCCESS
} from './action-types'

const initialState = {
	phoneNumberCountryCode: '',
	phoneNumber: '',
	lastDateSmsCodeSent: '',
	isTelegramUser: false
}

export default function authReducer(state = initialState, { type, payload }) {
	switch (type) {
		case SET_AUTH_INFO:
			return {
				...state,
				...payload
			}
		// when request to send sms code to phone number has successed, restart timer
		case SMS_CODE_SUCCESS: {
			return {
				...state,
				lastDateSmsCodeSent: moment().toISOString()
			}
		}
		// clear this senstive data from memory once auth is completed
		case SMS_TOKEN_VERIFICATION_SUCCESS:
			return {
				...state,
				phoneNumberCountryCode: '',
				phoneNumber: '',
				lastDateSmsCodeSent: ''
			}
		default:
			return state
	}
}
