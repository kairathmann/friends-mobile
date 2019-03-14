import {
	DECREMENT_INDEX,
	INCREMENT_INDEX,
	RESET_STATE,
	SET_QUESTIONS
} from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	questionIndex: 0,
	questions: {
		unanswered: [],
		answered: []
	}
}

export default function unansweredWizardReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SET_QUESTIONS: {
			return {
				...state,
				questionIndex: Math.min(
					state.questionIndex,
					payload.unanswered.length - 1
				),
				questions: payload
			}
		}
		case INCREMENT_INDEX: {
			return {
				...state,
				questionIndex: state.questionIndex + 1
			}
		}
		case DECREMENT_INDEX: {
			return {
				...state,
				questionIndex: state.questionIndex - 1
			}
		}
		case RESET_STATE: {
			return {
				...state,
				questionIndex: 0
			}
		}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
