import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducers from './reducers'

let middlewares = [thunk]

if (process.env.NODE_ENV === `development`) {
	const logger = createLogger({
		duration: true,
		diff: true
	})
	middlewares.push(logger)
}

function setupStore(initialState = {}) {
	const middleware = applyMiddleware(...middlewares)
	return createStore(reducers, initialState, middleware)
}

export default setupStore()
