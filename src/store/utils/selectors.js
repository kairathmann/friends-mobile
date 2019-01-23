import _ from 'lodash'

export const createLoadingSelector = actions => state => {
	return _(actions).some(action => _.get(state, `loading.${action}`))
}

export const createErrorMessageSelector = actions => state => {
	return (
		_(actions)
			.map(action => _.get(state, `errors.${action}`))
			.compact()
			.first() || ''
	)
}
