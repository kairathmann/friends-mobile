import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'

const loadingReducer = (state = {}, action) => {
	const { type } = action
	const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type)
	if (type === LOGOUT_USER_AND_CLEAR_DATA) {
		return {}
	}
	// not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
	if (!matches) return state

	const [, requestName, requestState] = matches
	return {
		...state,
		// Store whether a request is happening at the moment or not
		// e.g. will be true when receiving GET_TODOS_REQUEST
		//      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
		[requestName]: requestState === 'REQUEST'
	}
}

export default loadingReducer

//const loadingSelector = createLoadingSelector(['FETCHING_REPORTS'])
