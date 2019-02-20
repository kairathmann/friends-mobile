import {
	FETCH_QUESTIONS_SUCCESS,
	SAVE_ANSWERS_SUCCESS,
	SHOW_PREVIOUS_ONBOARDING_QUESTION,
	UPDATE_ONBOARDING_CONFIG
} from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	name: '',
	city: '',
	questions: [],
	currentQuestionToDisplayIndex: 0,
	onboardingMaxSteps: 0,
	onboardingStepsConfig: {}
}

export default function onboardingReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SAVE_ANSWERS_SUCCESS:
			return {
				...state,
				currentQuestionToDisplayIndex: state.currentQuestionToDisplayIndex + 1
			}
		case SHOW_PREVIOUS_ONBOARDING_QUESTION:
			return {
				...state,
				currentQuestionToDisplayIndex: state.currentQuestionToDisplayIndex - 1
			}
		case FETCH_QUESTIONS_SUCCESS:
			return {
				...state,
				questions: payload
			}
		case UPDATE_ONBOARDING_CONFIG:
			return {
				...state,
				onboardingMaxSteps: payload.maxSteps,
				onboardingStepsConfig: payload.stepsConfig
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
