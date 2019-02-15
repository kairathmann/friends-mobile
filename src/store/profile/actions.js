import {
	FETCH_MATCHING_QUESTIONS_FAILURE,
	FETCH_MATCHING_QUESTIONS_REQUEST,
	FETCH_MATCHING_QUESTIONS_SUCCESS,
	SAVE_MATCHING_ANSWERS_FAILURE,
	SAVE_MATCHING_ANSWERS_REQUEST,
	SAVE_MATCHING_ANSWERS_SUCCESS,
	SET_PROFILE_INFO
} from './action-types'

export const setProfileInfo = profileInfo => ({
	type: SET_PROFILE_INFO,
	payload: profileInfo
})

export function fetchQuestionsStarted() {
	return {
		type: FETCH_MATCHING_QUESTIONS_REQUEST
	}
}

export function fetchQuestionsSuccess(result) {
	return {
		type: FETCH_MATCHING_QUESTIONS_SUCCESS,
		payload: result
	}
}

export function fetchQuestionsFailure(err) {
	return {
		type: FETCH_MATCHING_QUESTIONS_FAILURE,
		payload: err
	}
}

export function saveAnswersStarted(answers) {
	return {
		type: SAVE_MATCHING_ANSWERS_REQUEST,
		payload: answers
	}
}

export function saveAnswersSuccess(result) {
	return {
		type: SAVE_MATCHING_ANSWERS_SUCCESS,
		payload: result
	}
}

export function saveAnswersFailure(err) {
	return {
		type: SAVE_MATCHING_ANSWERS_FAILURE,
		payload: err
	}
}
