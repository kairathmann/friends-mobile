import api from '../../../api/api'
import {
	fetchingMyRoundsFailure,
	fetchingMyRoundsStarted,
	fetchingMyRoundsSuccess
} from '../../../store/rounds/actions'

export function fetchMyRounds() {
	return async dispatch => {
		try {
			dispatch(fetchingMyRoundsStarted())
			const result = await api.fetchRounds()
			const mappedRounds = result.map(r => ({
				id: r.id,
				description: r.description,
				from: r.startTimestamp,
				to: r.endTimestamp,
				subscribed: r.isSubscribed,
				status: r.isSubscribed ? 'concluded' : 'not'
			}))
			dispatch(fetchingMyRoundsSuccess(mappedRounds))
		} catch (err) {
			dispatch(fetchingMyRoundsFailure(err))
		}
	}
}
