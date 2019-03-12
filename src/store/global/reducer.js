import {
	HIDE_SPINNER,
	LOGOUT_USER_AND_CLEAR_DATA,
	SHOW_SPINNER
} from './action-types'

const initialState = {
	showSpinner: false
}

export default function globalReducer(state = initialState, { type }) {
	switch (type) {
		case HIDE_SPINNER:
			return {
				...state,
				showSpinner: false
			}
		case SHOW_SPINNER:
			return {
				...state,
				showSpinner: true
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
