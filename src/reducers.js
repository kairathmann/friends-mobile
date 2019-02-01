import { combineReducers } from 'redux'
import errorReducer from './store/errors/reducer'
import loadingReducer from './store/loading/reducer'
import onboardingReducer from './store/onboarding/reducer'
import authReducer from './store/auth/reducer'
import profileReducer from './store/profile/reducer'
import roundsReducer from './store/rounds/reducer'

export default combineReducers({
	auth: authReducer,
	profile: profileReducer,
	onboarding: onboardingReducer,
	rounds: roundsReducer,
	loading: loadingReducer,
	errors: errorReducer
})
