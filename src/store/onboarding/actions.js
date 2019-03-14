import {
	UPLOAD_INFO_FAILURE,
	UPLOAD_INFO_REQUEST,
	UPLOAD_INFO_SUCCESS,
	UPDATE_ONBOARDING_CONFIG
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

export const updateOnboardingConfig = (maxSteps, stepsConfig) => ({
	type: UPDATE_ONBOARDING_CONFIG,
	payload: {
		maxSteps,
		stepsConfig
	}
})
