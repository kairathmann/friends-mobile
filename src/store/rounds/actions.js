import {
	FETCH_MY_ROUNDS_FAILURE,
	FETCH_MY_ROUNDS_REQUEST,
	FETCH_MY_ROUNDS_SUCCESS
} from './action-types'

export function fetchingMyRoundsStarted() {
	return {
		type: FETCH_MY_ROUNDS_REQUEST
	}
}

export function fetchingMyRoundsSuccess(result) {
	return {
		type: FETCH_MY_ROUNDS_SUCCESS,
		payload: result
	}
}

export function fetchingMyRoundsFailure(err) {
	return {
		type: FETCH_MY_ROUNDS_FAILURE,
		payload: err
	}
}
