import { combineReducers } from 'redux'
import errorReducer from './store/errors/reducer'
import loadingReducer from './store/loading/reducer'

export default combineReducers({
	loading: loadingReducer,
	errors: errorReducer
})
