import i18n from '../../../../locales/i18n'
import api from '../../../api/api'
import { showErrorToast } from '../../../services/toastService'
import {
	fetchingMyRoundsFailure,
	fetchingMyRoundsStarted,
	fetchingMyRoundsSuccess,
	joinRoundFailure,
	joinRoundStarted,
	joinRoundSuccess,
	resignRoundFailure,
	resignRoundStarted,
	resignRoundSuccess
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

export function joinRound(round) {
	return async dispatch => {
		try {
			dispatch(joinRoundStarted(round))
			const result = await api.joinRound(round)
			dispatch(joinRoundSuccess(result))
		} catch (err) {
			dispatch(joinRoundFailure(err))
			dispatch(resignRoundStarted(round))
			showErrorToast(i18n.t('errors.cannot_join'))
		}
	}
}

export function resignRound(round) {
	return async dispatch => {
		try {
			dispatch(resignRoundStarted(round))
			const result = await api.resignRound(round)
			dispatch(resignRoundSuccess(result))
		} catch (err) {
			dispatch(resignRoundFailure(err))
			dispatch(joinRoundStarted(round))
			showErrorToast(i18n.t('errors.cannot_resign'))
		}
	}
}
