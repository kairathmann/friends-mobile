import { UPDATE_ONBOARDING_CONFIG } from './action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const initialState = {
	name: '',
	city: '',
	onboardingMaxSteps: 0,
	onboardingStepsConfig: {}
}

export default function onboardingReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
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
