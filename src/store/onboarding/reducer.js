import { FETCH_QUESTIONS_SUCCESS } from './action-types'

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
		default:
			return state
	}
}
