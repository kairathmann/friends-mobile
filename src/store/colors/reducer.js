import { SET_COLORS } from './action-types'

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
		default:
			return state
	}
}
