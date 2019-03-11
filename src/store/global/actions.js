import {
	HIDE_SPINNER,
	LOGOUT_USER_AND_CLEAR_DATA,
	SHOW_SPINNER
} from './action-types'

export const logOutUserAndClearData = () => ({
	type: LOGOUT_USER_AND_CLEAR_DATA
})

export const showSpinner = () => ({
	type: SHOW_SPINNER
})

export const hideSpinner = () => ({
	type: HIDE_SPINNER
})
