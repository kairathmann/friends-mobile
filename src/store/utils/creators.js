import { camelize } from 'humps'
import capitalize from 'lodash/capitalize'

function createActionTypesFromArray(arrayOfActionTypes) {
	let actionTypes = {}
	arrayOfActionTypes.forEach(type => {
		actionTypes = {
			...actionTypes,
			...createActionTypes(type)
		}
	})

	return actionTypes
}

function createActionTypes(type) {
	['REQUEST', 'SUCCESS', 'FAILURE']
		.map(status => `${type}_${status}`)
		.reduce((object, element) => {
			return {
				...object,
				[element]: element
			}
		}, {})
}

function createActions(type) {
	['REQUEST', 'SUCCESS', 'FAILURE']
		.map(status => {
			return {
				[`${camelize(type)}${capitalize(status)}`]: function(data) {
					return {
						type: `${type}_${status}`,
						payload: data
					}
				}
			}
		})
		.reduce((object, element) => {
			return {
				...object,
				[element]: element
			}
		}, {})
}

export { createActionTypes, createActionTypesFromArray, createActions }
