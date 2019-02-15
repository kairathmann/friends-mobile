import { SET_COLORS } from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	colors: []
}

export default function colorReducer(state = initialState, { type, payload }) {
	switch (type) {
		case SET_COLORS:
			return {
				...state,
				colors: payload
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
