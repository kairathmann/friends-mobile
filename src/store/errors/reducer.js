import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const errorReducer = (state = {}, action) => {
	const { type, payload } = action
	const matches = /(.*)_(REQUEST|FAILURE|CLEAR_ERROR)/.exec(type)
	if (type === LOGOUT_USER_AND_CLEAR_DATA) {
		return {}
	}

	// not a *_REQUEST / *_FAILURE actions, so we ignore them
	if (!matches) return state

	const [, requestName, requestState] = matches
	return {
		...state,
		// Store errorMessage
		// e.g. stores errorMessage when receiving GET_TODOS_FAILURE
		//      else clear errorMessage when receiving GET_TODOS_REQUEST
		[requestName]: requestState === 'FAILURE' ? payload : ''
	}
}

export default errorReducer

// const errorSelector = createErrorMessageSelector(['FETCHING_REPORTS'])
