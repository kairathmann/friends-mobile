import { SET_PROFILE_INFO } from './action-types'
import { SET_COLORS } from '../colors/action-types'

const initialState = {
	id: '',
	city: '',
	firstName: '',
	username: '',
	color: ''
}

export default function profileReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SET_PROFILE_INFO:
			return {
				...state,
				...payload,
				color: payload.color ? payload.color : state.color
			}
		// when colors are fetched from the server, automatically fill default color to the first one if user does not have any selected
		case SET_COLORS:
			return {
				...state,
				color: state.color === '' ? payload[0] : state.color
			}
		default:
			return state
	}
}
