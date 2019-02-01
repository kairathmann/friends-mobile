import {
	FETCH_QUESTIONS_FAILURE,
	FETCH_QUESTIONS_REQUEST,
	FETCH_QUESTIONS_SUCCESS,
	SAVE_ANSWERS_FAILURE,
	SAVE_ANSWERS_REQUEST,
	SAVE_ANSWERS_SUCCESS,
	UPLOAD_INFO_FAILURE,
	UPLOAD_INFO_REQUEST,
	UPLOAD_INFO_SUCCESS
} from './action-types'

export function uploadInfoStart() {
	return {
		type: UPLOAD_INFO_REQUEST
	}
}

export function uploadInfoFailure(err) {
	return {
		type: UPLOAD_INFO_FAILURE,
		payload: err
	}
}

export function uploadInfoSuccess(result) {
	return {
		type: UPLOAD_INFO_SUCCESS,
		payload: result
	}
}

export function fetchQuestionsStart() {
	return {
		type: FETCH_QUESTIONS_REQUEST
	}
}

export function fetchQuestionsFailure(err) {
	return {
		type: FETCH_QUESTIONS_FAILURE,
		payload: err
	}
}

export function fetchQuestionsSuccess(result) {
	return {
		type: FETCH_QUESTIONS_SUCCESS,
		payload: result
	}
}

export function saveAnswersStart() {
	return {
		type: SAVE_ANSWERS_REQUEST
	}
}

export function saveAnswersFailure(err) {
	return {
		type: SAVE_ANSWERS_FAILURE,
		payload: err
	}
}

export function saveAnswersSuccess(result) {
	return {
		type: SAVE_ANSWERS_SUCCESS,
		payload: result
	}
}
