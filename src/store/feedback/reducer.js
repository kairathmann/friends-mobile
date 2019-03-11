import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'
import {
	FETCH_FEEDBACK_QUESTIONS_FAILURE,
	FETCH_FEEDBACK_QUESTIONS_SUCCESS,
	SAVE_FEEDBACK_ANSWERS_SUCCESS
} from './action-types'

const initialState = {
	questions: []
}

export default function feedbackReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case FETCH_FEEDBACK_QUESTIONS_FAILURE:
			return {
				...state,
				questions: []
			}
		case SAVE_FEEDBACK_ANSWERS_SUCCESS:
			return {
				...state
			}
		case FETCH_FEEDBACK_QUESTIONS_SUCCESS:
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
