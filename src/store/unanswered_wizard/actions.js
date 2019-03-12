import {
	DECREMENT_INDEX,
	INCREMENT_INDEX,
	RESET_STATE,
	SET_QUESTIONS,
	WIZARD_SAVE_UNANSWERED_REQUEST,
	WIZARD_SAVE_UNANSWERED_SUCCESS,
	WIZARD_SAVE_UNANSWERED_FAILURE
} from './action-types'

const saveUnansweredRequest = () => ({
	type: WIZARD_SAVE_UNANSWERED_REQUEST
})

const saveUnansweredOk = () => ({
	type: WIZARD_SAVE_UNANSWERED_SUCCESS
})

const saveUnansweredError = () => ({
	type: WIZARD_SAVE_UNANSWERED_FAILURE
})

const decrementIndex = () => ({
	type: DECREMENT_INDEX
})

const incrementIndex = () => ({
	type: INCREMENT_INDEX
})

const resetState = () => ({
	type: RESET_STATE
})

const setQuestions = questions => ({
	type: SET_QUESTIONS,
	payload: questions
})

export {
	decrementIndex,
	incrementIndex,
	resetState,
	setQuestions,
	saveUnansweredError,
	saveUnansweredOk,
	saveUnansweredRequest
}
