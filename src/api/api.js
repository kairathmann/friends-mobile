import axios from 'axios'
import { tokenService } from '../services'
import { CHAT_MESSAGES_PAGE_LIMIT } from '../enums'

export default {
	fetchRounds: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get('rounds/', { headers: { 'X-Authorization': `Bearer ${authToken}` } })
			.then(result => result.data)
	},
	joinRound: async round => {
		const authToken = await tokenService.getToken()
		return axios
			.post(
				'rounds/subscribe/',
				{ round_id: round.id, is_subscribed: true },
				{ headers: { 'X-Authorization': `Bearer ${authToken}` } }
			)
			.then(result => result.data)
	},
	fetchChats: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get(`chats/`, {
				headers: { 'X-Authorization': `Bearer ${authToken}` }
			})
			.then(result => result.data)
	},
	resignRound: async round => {
		const authToken = await tokenService.getToken()
		return axios
			.post(
				'rounds/subscribe/',
				{ round_id: round.id, is_subscribed: false },
				{ headers: { 'X-Authorization': `Bearer ${authToken}` } }
			)
			.then(result => result.data)
	},
	fetchSelf: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get('self/', { headers: { 'X-Authorization': `Bearer ${authToken}` } })
			.then(result => result.data)
	},
	requestSmsCodeMessage: (phoneNumberCountryCode, phoneNumber) => {
		const countryCode = phoneNumberCountryCode.startsWith('+')
			? phoneNumberCountryCode
			: `+${phoneNumberCountryCode}`
		return axios.post('verification/', {
			country_code: countryCode,
			phone_number: phoneNumber,
			via: 'sms'
		})
	},
	sendVerificationCode: async (
		phoneNumberCountryCode,
		phoneNumber,
		verificationCode,
		isTelegramLogin
	) => {
		const countryCode = phoneNumberCountryCode.startsWith('+')
			? phoneNumberCountryCode
			: `+${phoneNumberCountryCode}`
		let axiosOptions = {}
		if (isTelegramLogin) {
			const authToken = await tokenService.getToken()
			axiosOptions = { headers: { 'X-Authorization': `Bearer ${authToken}` } }
		}
		return axios.post(
			'verification/token/',
			{
				country_code: countryCode,
				phone_number: phoneNumber,
				token: verificationCode
			},
			axiosOptions
		)
	},
	transferTelegramEmail: email =>
		axios.post('legacy/', {
			email
		}),
	uploadBaseInfo: async ({ name, city, color, emoji }) => {
		const authToken = await tokenService.getToken()
		return axios
			.put(
				'self/',
				{ first_name: name, city, color, emoji },
				{ headers: { 'X-Authorization': `Bearer ${authToken}` } }
			)
			.then(result => result.data)
	},
	fetchQuestions: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get('questions/', {
				headers: { 'X-Authorization': `Bearer ${authToken}` }
			})
			.then(result => result.data)
	},
	fetchAnsweredQuestions: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get('questions/answered', {
				headers: { 'X-Authorization': `Bearer ${authToken}` }
			})
			.then(result => result.data)
	},
	uploadAnswers: async answers => {
		const authToken = await tokenService.getToken()
		return axios
			.post(
				'responses/',
				{ answer_ids: answers },
				{ headers: { 'X-Authorization': `Bearer ${authToken}` } }
			)
			.then(result => result.data)
	},
	getAvailableColors: async () => {
		const authToken = await tokenService.getToken()
		return axios
			.get('colors/', { headers: { 'X-Authorization': `Bearer ${authToken}` } })
			.then(result => result.data)
	},
	getChatMessages: async (
		chatId,
		{ lastMessageId, untilMessageId, limit } = {}
	) => {
		const authToken = await tokenService.getToken()
		const params = {
			limit: limit || CHAT_MESSAGES_PAGE_LIMIT
		}
		if (lastMessageId) {
			params.from_message = lastMessageId
		}
		if (untilMessageId) {
			params.until_message = untilMessageId
		}
		return axios
			.get(`chats/${chatId}/`, {
				params,
				headers: { 'X-Authorization': `Bearer ${authToken}` }
			})
			.then(result => result.data)
	},
	sendChatTextMessage: async (chatId, textMessage) => {
		const authToken = await tokenService.getToken()
		return axios
			.post(
				`chats/${chatId}/`,
				{ text: textMessage },
				{ headers: { 'X-Authorization': `Bearer ${authToken}` } }
			)
			.then(result => result.data)
	}
}
