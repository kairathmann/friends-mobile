import { SET_PROFILE_INFO } from './action-types'

const initialState = {
	id: '',
	city: '',
	firstName: '',
	username: ''
}

export default function profileReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SET_PROFILE_INFO:
			return {
				...state,
				...payload
			}
		default:
			return state
	}
}
