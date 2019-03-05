import * as _ from 'lodash'
import { Platform } from 'react-native'
import { Answers } from 'react-native-fabric'
import api from '../../../api/api'
import { getErrorDataFromNetworkException } from '../../../common/utils'
import { PAGES_NAMES } from '../../../navigation/pages'
import { tokenService } from '../../../services'
import {
	calculateOnboardingSteps,
	getUserLandingPageBasedOnUserInfo,
	navigate,
	navigateAndResetNavigation
} from '../../../services/navigationService'
import { showErrorToast } from '../../../services/toastService'
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
	showPreviousOnboardingQuestion,
	updateOnboardingConfig,
	uploadInfoFailure,
	uploadInfoStart,
	uploadInfoSuccess
} from '../../../store/onboarding/actions'
import { setProfileInfo } from '../../../store/profile/actions'
import { setAvailableColors } from '../../../store/colors/actions'

export function uploadInfo({ name, city, color, emoji }) {
	return async (dispatch, getState) => {
		try {
			dispatch(uploadInfoStart())
			const result = await api.uploadBaseInfo({
				name,
				city,
				color: color.id,
				emoji
			})
			dispatch(
				setProfileInfo({
					city,
					firstName: name,
					color,
					emoji
				})
			)
			dispatch(uploadInfoSuccess(result))
			if (Platform.OS === 'android') {
				const questionsToBeAnswered = getState().onboarding.questions
				if (questionsToBeAnswered.length === 0) {
					navigateAndResetNavigation(PAGES_NAMES.HOME_PAGE)
				} else {
					navigate(PAGES_NAMES.QUESTIONS_BEFORE_PAGE)
				}
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
		const availableColors = await api.getAvailableColors()
		let destinationPageForUser = PAGES_NAMES.IDENTIFICATION_PAGE
		// telegram user always goes to onboarding so execute extra logic only if user is non telegram import
		if (!isTelegramUser) {
			destinationPageForUser = getUserLandingPageBasedOnUserInfo(
				userInfoWithoutToken
			)
		}
		let onboardingMaxSteps = 0
		let onboardingSteps = {}
		// fetch questions only if we are not suppose to be redirected to Home Page aka we need to stay in onboarding
		if (destinationPageForUser !== PAGES_NAMES.HOME_PAGE) {
			const availableQuestions = await api.fetchQuestions()
			const onboardingStepsConfig = calculateOnboardingSteps(
				destinationPageForUser,
				availableQuestions
			)
			onboardingMaxSteps = onboardingStepsConfig.maxSteps
			onboardingSteps = onboardingStepsConfig.configurationPerPage
			dispatch(fetchQuestionsSuccess(availableQuestions))
		}
		dispatch(smsTokenVerificationSuccess())
		dispatch(setAvailableColors(availableColors))
		dispatch(setProfileInfo(userInfoWithoutToken))
		dispatch(updateOnboardingConfig(onboardingMaxSteps, onboardingSteps))
		navigateAndResetNavigation(destinationPageForUser, {
			goBackArrowDisabled: true
		})
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

export function saveAnswer(answer, shouldGoToHomePage) {
	return async dispatch => {
		try {
			dispatch(saveAnswersStart())
			const answersIds = _.values(answer).map(ans => ans.selected)
			await api.uploadAnswers(answersIds)
			dispatch(saveAnswersSuccess())
			if (shouldGoToHomePage) {
				navigateAndResetNavigation(PAGES_NAMES.HOME_PAGE)
			}
		} catch (err) {
			const error = getErrorDataFromNetworkException(err)
			showErrorToast(error)
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

export const updateUserColorSelection = color => dispatch =>
	dispatch(setProfileInfo({ color }))

export const updateUserEmojiSelection = emoji => dispatch =>
	dispatch(setProfileInfo({ emoji }))

export const showPreviousQuestion = () => dispatch =>
	dispatch(showPreviousOnboardingQuestion())
