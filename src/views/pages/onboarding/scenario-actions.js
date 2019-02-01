import * as _ from 'lodash'
import { Platform } from 'react-native'
import { Answers } from 'react-native-fabric'
import api from '../../../api/api'
import { getErrorDataFromNetworkException } from '../../../common/utils'
import { PAGES_NAMES } from '../../../navigation/pages'
import { tokenService } from '../../../services'
import {
	getUserLandingPageBasedOnUserInfo,
	navigate,
	navigateAndResetNavigation
} from '../../../services/navigationService'
import { register } from '../../../services/pushNotificationService'
import { showErrorToast } from '../../../services/toastService'
import configuredStore from '../../../store'
import I18n from '../../../../locales/i18n'
import {
	clearPhoneNumberError,
	clearTelegramEmailError,
	clearVerificationCodeError,
	requestSmsCodeError,
	requestSmsCodeStart,
	requestSmsCodeSuccess,
	setAuthInfo,
	smsTokenVerificationError,
	smsTokenVerificationStart,
	smsTokenVerificationSuccess,
	setTelegramUser,
	telegramEmailError,
	telegramEmailStart,
	telegramEmailSuccess
} from '../../../store/auth/actions'
import {
	fetchQuestionsFailure,
	fetchQuestionsStart,
	fetchQuestionsSuccess,
	saveAnswersFailure,
	saveAnswersStart,
	saveAnswersSuccess,
	uploadInfoFailure,
	uploadInfoStart,
	uploadInfoSuccess
} from '../../../store/onboarding/actions'
import { setProfileInfo } from '../../../store/profile/actions'

export function uploadInfo({ name, city }) {
	return async dispatch => {
		try {
			dispatch(uploadInfoStart())
			const result = await api.uploadBaseInfo({ name, city })
			dispatch(uploadInfoSuccess(result))
			if (Platform.OS === 'android') {
				register(configuredStore)
				navigate(PAGES_NAMES.QUESTIONS_BEFORE_PAGE)
			} else {
				navigate(PAGES_NAMES.NOTIFICATION_CHECK_PAGE)
			}
		} catch (err) {
			const error = getErrorDataFromNetworkException(err)
			dispatch(uploadInfoFailure(error))
			showErrorToast(error)
		}
	}
}

export const requestSmsCode = (
	phoneNumberCountryCode,
	phoneNumber
) => async dispatch => {
	try {
		dispatch(setAuthInfo(phoneNumberCountryCode, phoneNumber))
		dispatch(requestSmsCodeStart())
		await api.requestSmsCodeMessage(phoneNumberCountryCode, phoneNumber)
		dispatch(requestSmsCodeSuccess())
		navigate(PAGES_NAMES.AUTH_VERIFICATION_TOKEN_PAGE)
	} catch (err) {
		const error = getErrorDataFromNetworkException(err)
		dispatch(requestSmsCodeError(error))
	}
}

export const sendVerificationCode = (
	phoneNumberCountryCode,
	phoneNumber,
	isTelegramUser,
	verificationCode
) => async dispatch => {
	try {
		dispatch(smsTokenVerificationStart())
		const requestResult = await api.sendVerificationCode(
			phoneNumberCountryCode,
			phoneNumber,
			verificationCode,
			isTelegramUser
		)
		const userInfo = requestResult.data
		const userToken = userInfo.authToken
		const userInfoWithoutToken = _.omit(userInfo, 'authToken')
		const tokenStored = await tokenService.setToken(userToken)
		if (!tokenStored.success) {
			Answers.logCustom('AUTH-TOKEN-COULD-NOT-STORE-ERROR', {
				error: tokenStored.error
			})
		}
		let destinationPageForUser = PAGES_NAMES.BASEINFO_PAGE
		let questionsToAnswer = []
		// telegram user always goes to onboarding so execute extra logic only if user is non telegram import
		if (!isTelegramUser) {
			// only send extra request for questions if user has filled basic info already
			if (
				userInfoWithoutToken.firstName !== '' &&
				userInfoWithoutToken.city !== ''
			) {
				questionsToAnswer = await api.fetchQuestions()
			}
			destinationPageForUser = getUserLandingPageBasedOnUserInfo(
				userInfoWithoutToken,
				questionsToAnswer
			)
		}
		dispatch(smsTokenVerificationSuccess())
		dispatch(setProfileInfo(userInfoWithoutToken))
		navigateAndResetNavigation(destinationPageForUser)
	} catch (err) {
		const error = getErrorDataFromNetworkException(err)
		dispatch(smsTokenVerificationError(error))
	}
}

export const registerTelegramUser = email => async dispatch => {
	try {
		dispatch(telegramEmailStart())
		const requestResult = await api.transferTelegramEmail(email)
		const userInfo = requestResult.data
		const userToken = userInfo.authToken
		const tokenStored = await tokenService.setToken(userToken)
		if (!tokenStored.success) {
			Answers.logCustom('AUTH-TOKEN-COULD-NOT-STORE-ERROR', {
				error: tokenStored.error
			})
		}
		dispatch(setTelegramUser())
		dispatch(telegramEmailSuccess())
		navigate(PAGES_NAMES.AUTH_PHONE_NUMBER_PAGE)
	} catch (err) {
		let errorMessage = ''
		if (err.response) {
			switch (err.response.status) {
				case 404:
					errorMessage = I18n.t('errors.user_not_found')
					break
				case 409:
					errorMessage = I18n.t('errors.user_already_transferred')
					break
				default:
					errorMessage = getErrorDataFromNetworkException(err)
					break
			}
		} else {
			errorMessage = getErrorDataFromNetworkException(err)
		}
		dispatch(telegramEmailError(errorMessage))
	}
}

export const clearPhoneNumberErrorState = () => dispatch =>
	dispatch(clearPhoneNumberError())

export const clearSmsTokenVerificationErrorState = () => dispatch =>
	dispatch(clearVerificationCodeError())

export const clearTelegramEmailErrorState = () => dispatch =>
	dispatch(clearTelegramEmailError())

export function saveAnswers(answers) {
	return async dispatch => {
		try {
			dispatch(saveAnswersStart())
			const answersIds = _.values(answers).map(ans => ans.selected)
			await api.uploadAnswers(answersIds)
			dispatch(saveAnswersSuccess())
			navigateAndResetNavigation(PAGES_NAMES.HOME_PAGE)
		} catch (err) {
			const error = getErrorDataFromNetworkException(err)
			dispatch(saveAnswersFailure(error))
		}
	}
}

export function fetchQuestions() {
	return async dispatch => {
		try {
			dispatch(fetchQuestionsStart())
			const result = await api.fetchQuestions()
			dispatch(fetchQuestionsSuccess(result))
		} catch (err) {
			const error = getErrorDataFromNetworkException(err)
			dispatch(fetchQuestionsFailure(error))
		}
	}
}
