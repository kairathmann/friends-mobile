import axios from 'axios/index'
import { camelizeKeys } from 'humps'
import Config from 'react-native-config'

export default () => {
	axios.defaults.baseURL = Config.APP_AXIOS_BASE_URL
	// Needs to be set in order for cookies to be sent to the server after auth
	axios.defaults.withCredentials = Config.APP_AXIOS_WITH_CREDENTIALS === 'TRUE'
	axios.defaults.transformResponse = [
		...axios.defaults.transformResponse,
		data => camelizeKeys(data)
	]
}
