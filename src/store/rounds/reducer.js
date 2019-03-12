import moment from 'moment'
import { FETCH_MY_ROUNDS_SUCCESS } from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	currentRounds: []
}

export default function roundsReducer(state = initialState, { type, payload }) {
	const now = moment()
	switch (type) {
		case FETCH_MY_ROUNDS_SUCCESS:
			return {
				...state,
				currentRounds: payload.filter(
					rr => moment(rr.from).isBefore(now) && moment(rr.to).isAfter(now)
				)
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
