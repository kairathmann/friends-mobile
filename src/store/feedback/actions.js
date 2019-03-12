import {
	FETCH_FEEDBACK_QUESTIONS_FAILURE,
	FETCH_FEEDBACK_QUESTIONS_REQUEST,
	FETCH_FEEDBACK_QUESTIONS_SUCCESS,
	SAVE_FEEDBACK_ANSWERS_FAILURE,
	SAVE_FEEDBACK_ANSWERS_REQUEST,
	SAVE_FEEDBACK_ANSWERS_SUCCESS
} from './action-types'

export const fetchFeedbackQuestionsStarted = () => ({
	type: FETCH_FEEDBACK_QUESTIONS_REQUEST
})

export const fetchFeedbackQuestionsSuccess = result => ({
	type: FETCH_FEEDBACK_QUESTIONS_SUCCESS,
	payload: result
})

export const fetchFeedbackQuestionsFailure = () => ({
	type: FETCH_FEEDBACK_QUESTIONS_FAILURE
})

export const saveFeedbackAsnwersStarted = () => ({
	type: SAVE_FEEDBACK_ANSWERS_REQUEST
})

export const saveFeedbackAsnwersSuccess = chatId => ({
	type: SAVE_FEEDBACK_ANSWERS_SUCCESS,
	payload: chatId
})

export const saveFeedbackAsnwersFailure = () => ({
	type: SAVE_FEEDBACK_ANSWERS_FAILURE
})
