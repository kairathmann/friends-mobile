import { SET_COLORS } from './action-types'

export const setAvailableColors = availableColors => ({
	type: SET_COLORS,
	payload: availableColors
})
