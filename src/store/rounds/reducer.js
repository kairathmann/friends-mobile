import moment from 'moment'
import {
	FETCH_MY_ROUNDS_SUCCESS,
	JOIN_ROUND_REQUEST,
	RESIGN_ROUND_REQUEST
} from './action-types'

const initialState = {
	pastRounds: [],
	futureRounds: [],
	currentRounds: []
}

export default function roundsReducer(state = initialState, { type, payload }) {
	const now = moment()
	switch (type) {
		case JOIN_ROUND_REQUEST: {
			return {
				...state,
				futureRounds: state.futureRounds.map(fr => {
					if (fr.id === payload.id) {
						return {
							...fr,
							subscribed: true
						}
					}
					return fr
				})
			}
		}
		case RESIGN_ROUND_REQUEST: {
			return {
				...state,
				futureRounds: state.futureRounds.map(fr => {
					if (fr.id === payload.id) {
						return {
							...fr,
							subscribed: false
						}
					}
					return fr
				})
			}
		}
		case FETCH_MY_ROUNDS_SUCCESS:
			return {
				...state,
				currentRounds: payload.filter(
					rr => moment(rr.from) < now && moment(rr.to) > now
				),
				futureRounds: payload.filter(rr => moment(rr.from) > now),
				pastRounds: payload.filter(rr => moment(rr.to) <= now)
			}
		default:
			return state
	}
}
