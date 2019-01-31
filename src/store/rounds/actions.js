import {
	FETCH_MY_ROUNDS_FAILURE,
	FETCH_MY_ROUNDS_REQUEST,
	FETCH_MY_ROUNDS_SUCCESS,
	JOIN_ROUND_FAILURE,
	JOIN_ROUND_REQUEST,
	JOIN_ROUND_SUCCESS,
	RESIGN_ROUND_FAILURE,
	RESIGN_ROUND_REQUEST,
	RESIGN_ROUND_SUCCESS
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

export function joinRoundStarted(round) {
	return {
		type: JOIN_ROUND_REQUEST,
		payload: round
	}
}

export function joinRoundSuccess(result) {
	return {
		type: JOIN_ROUND_SUCCESS,
		payload: result
	}
}

export function joinRoundFailure(err) {
	return {
		type: JOIN_ROUND_FAILURE,
		payload: err
	}
}

export function resignRoundStarted(round) {
	return {
		type: RESIGN_ROUND_REQUEST,
		payload: round
	}
}

export function resignRoundSuccess(result) {
	return {
		type: RESIGN_ROUND_SUCCESS,
		payload: result
	}
}

export function resignRoundFailure(err) {
	return {
		type: RESIGN_ROUND_FAILURE,
		payload: err
	}
}
