import { SET_PROFILE_INFO } from './action-types'

export const setProfileInfo = profileInfo => ({
	type: SET_PROFILE_INFO,
	payload: profileInfo
})
