import { FETCH_QUESTIONS_SUCCESS } from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	name: '',
	city: '',
	questions: []
}

export default function onboardingReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case FETCH_QUESTIONS_SUCCESS:
			return {
				...state,
				questions: payload
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
