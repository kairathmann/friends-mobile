import axios from 'axios'
import { tokenService } from '../services'
import { CHAT_MESSAGES_PAGE_LIMIT } from '../enums'

class ApiRequest {
	constructor(root) {
		this.root = root
	}
	_customHeaders = async () => {
		const authToken = await tokenService.getToken()
		return {
			'X-Authorization': `Bearer ${authToken}`
		}
	}
	_axiosConfigBuilder = async config => {
		const { headers, params } = config
		if (typeof params === 'boolean' && params === false) {
			delete config.params
		}
		if (typeof headers === 'boolean' && headers === false) {
			delete config.headers
		}
		if (typeof headers === 'undefined') {
			config.headers = await this._customHeaders()
		}
		return config
	}
	get = async ({ url = '/', params = {}, headers }) => {
		const axiosConfig = await this._axiosConfigBuilder({ params, headers })
		return axios
			.get(`${this.root}${url}`, axiosConfig)
			.then(result => result.data)
	}
	post = async ({ url = '/', payload, params = {}, headers }) => {
		const axiosConfig = await this._axiosConfigBuilder({ params, headers })
		return axios
			.post(`${this.root}${url}`, payload, axiosConfig)
			.then(result => result.data)
	}
	put = async ({ url = '/', payload, params = {}, headers }) => {
		const axiosConfig = await this._axiosConfigBuilder({ params, headers })
		return axios
			.put(`${this.root}${url}`, payload, axiosConfig)
			.then(result => result.data)
	}
}

class RoundsRequest extends ApiRequest {
	constructor() {
		super('rounds')
	}
	fetchRounds = async () => this.get({})
}

class ChatsRequest extends ApiRequest {
	constructor() {
		super('chats')
	}
	fetchChats = async () => this.get({})
	getChatMessages = async (
		chatId,
		{ lastMessageId, untilMessageId, limit } = {}
	) => {
		const params = {
			limit: limit || CHAT_MESSAGES_PAGE_LIMIT
		}
		if (lastMessageId) {
			params.from_message = lastMessageId
		}
		if (untilMessageId) {
			params.until_message = untilMessageId
		}
		return this.get({
			url: `/${chatId}/`,
			params
		})
	}
	sendChatTextMessage = async (chatId, textMessage) => {
		return this.post({
			url: `/${chatId}/`,
			payload: { text: textMessage }
		})
	}
	saveFeedbackAnswers = async (chatId, answers) => {
		return this.post({
			url: `/${chatId}/feedback_responses/`,
			payload: { feedback_responses: answers }
		})
	}
}

class SelfRequest extends ApiRequest {
	constructor() {
		super('self')
	}
	fetchSelf = async () => this.get({})
	uploadBaseInfo = async ({ name, location, color, emoji }) => {
		return this.put({
			payload: {
				first_name: name,
				color,
				emoji,
				location: {
					mapbox_id: location.mapboxId,
					full_name: location.fullName,
					name: location.name,
					latitude: location.latitude,
					longitude: location.longitude
				}
			}
		})
	}
}

class VerificationRequest extends ApiRequest {
	constructor() {
		super('verification')
	}
	sanitizeCountryCode = countryCode => {
		return countryCode.startsWith('+') ? countryCode : `+${countryCode}`
	}
	requestSmsCodeMessage = async (phoneNumberCountryCode, phoneNumber) => {
		const countryCode = this.sanitizeCountryCode(phoneNumberCountryCode)
		return this.post({
			headers: false,
			payload: {
				country_code: countryCode,
				phone_number: phoneNumber,
				via: 'sms'
			}
		})
	}
	sendVerificationCode = async (
		phoneNumberCountryCode,
		phoneNumber,
		verificationCode,
		isTelegramLogin
	) => {
		const countryCode = this.sanitizeCountryCode(phoneNumberCountryCode)
		let headers
		if (!isTelegramLogin) {
			headers = false
		}
		return this.post({
			url: '/token/',
			headers,
			payload: {
				country_code: countryCode,
				phone_number: phoneNumber,
				token: verificationCode
			}
		})
	}
}

class LegacyRequest extends ApiRequest {
	constructor() {
		super('legacy')
	}
	transferTelegramEmail = email =>
		this.post({ payload: { email }, headers: false, params: false })
}

class QuestionsRequest extends ApiRequest {
	constructor() {
		super('questions')
	}
	fetchQuestions = async () => this.get({})
	fetchAnsweredQuestions = async () => this.get({ url: '/answered/' })
}

class ResponsesRequest extends ApiRequest {
	constructor() {
		super('responses')
	}
	uploadAnswers = async answers => {
		return this.post({ payload: { answer_ids: answers } })
	}
}

class ColorsRequest extends ApiRequest {
	constructor() {
		super('colors')
	}
	getAvailableColors = async () => this.get({})
}

class FeedbackRequest extends ApiRequest {
	constructor() {
		super('feedback_questions')
	}
	fetchFeedbackQuestions = async () => this.get({})
}

export const roundsRequest = new RoundsRequest()
export const chatsRequest = new ChatsRequest()
export const selfRequest = new SelfRequest()
export const verificationRequest = new VerificationRequest()
export const legacyRequest = new LegacyRequest()
export const questionsRequest = new QuestionsRequest()
export const responsesRequest = new ResponsesRequest()
export const colorsRequest = new ColorsRequest()
export const feedbackRequest = new FeedbackRequest()
