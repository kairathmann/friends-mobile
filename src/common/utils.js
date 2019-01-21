import moment from 'moment'
import Config from 'react-native-config'
import I18n from '../../locales/i18n'
import DefaultFemale from '../assets/images/default_female.png'
import DefaultMale from '../assets/images/default_male.png'
import DefaultOther from '../assets/images/default_other.png'
import { GENDER } from '../enums'

const baseHostForURLs = Config.APP_URL_BASE


const getErrorDataFromNetworkException = error => {
	let errorMessage = ''
	if (error.response) {
		if (error.response.status >= 500) {
			errorMessage = I18n.t('common.errors.server_error')
		} else {
			const errorCode = error.response.data.code
			switch (error.response.status) {
				case 401:
					errorMessage = I18n.t('common.errors.not_authenticated')
					break
				case 400:
					errorMessage = I18n.t(
						`common.errors.${errorCode || 'incorrect_request'}`
					)
					break
				case 404:
					errorMessage = I18n.t('common.errors.resource_not_found')
					break
			}
		}
	} else if (error.request) {
		errorMessage = I18n.t('common.errors.no_internet_connection')
	} else {
		throw error
	}

	return errorMessage
}

const isPortrait = (screenWidth, screenHeight) => {
	return screenHeight >= screenWidth
}

const isLandscape = (screenWidth, screenHeight) => {
	return screenWidth >= screenHeight
}

const isSameDay = (firstDate, secondDate) => {
	const first = moment(firstDate)
	const second = moment(secondDate)
	return first.dayOfYear() === second.dayOfYear()
}

const getMomentCurrentLocaleWithFallback = () => {
	const supportedLocales = ['en']
	const fallback = 'en'
	const currentLocale = I18n.locale
	const separatorIndex = currentLocale.indexOf('-')
	const currentLocaleStrippedToMomentFormat =
		separatorIndex === -1
			? currentLocale
			: currentLocale.substr(0, separatorIndex)
	const indexOfSupportedLocale = supportedLocales.indexOf(
		currentLocaleStrippedToMomentFormat
	)
	return indexOfSupportedLocale === -1
		? fallback
		: currentLocaleStrippedToMomentFormat
}

export {
	getErrorDataFromNetworkException,
	getMomentCurrentLocaleWithFallback,
	isPortrait,
	isLandscape,
	isSameDay
}
