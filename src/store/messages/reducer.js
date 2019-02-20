import { FETCH_CHATS_SUCCESS } from './action-types'

const initialState = {
	chats: []
}

export default function messageReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case FETCH_CHATS_SUCCESS:
			return {
				...state,
				chats: payload
			}
		default:
			return state
	}
}
