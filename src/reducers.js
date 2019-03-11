import { combineReducers } from 'redux'
import errorReducer from './store/errors/reducer'
import loadingReducer from './store/loading/reducer'
import messageReducer from './store/messages/reducer'
import onboardingReducer from './store/onboarding/reducer'
import authReducer from './store/auth/reducer'
import profileReducer from './store/profile/reducer'
import roundsReducer from './store/rounds/reducer'
import colorsReducer from './store/colors/reducer'
import globalReducer from './store/global/reducer'

export default combineReducers({
	auth: authReducer,
	profile: profileReducer,
	onboarding: onboardingReducer,
	messages: messageReducer,
	rounds: roundsReducer,
	colors: colorsReducer,
	loading: loadingReducer,
	global: globalReducer,
	errors: errorReducer
})
