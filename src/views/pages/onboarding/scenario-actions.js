import * as _ from 'lodash'
import { Platform } from 'react-native'
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
	updateOnboardingConfig,
	uploadInfoFailure,
	uploadInfoStart,
	uploadInfoSuccess
} from '../../../store/onboarding/actions'
import {
	questionsRequest,
	selfRequest,
	verificationRequest,
	colorsRequest,
	legacyRequest
} from '../../../api'
import { setQuestions } from '../../../store/unanswered_wizard/actions'
import { setProfileInfo } from '../../../store/profile/actions'
import { setAvailableColors } from '../../../store/colors/actions'
import { hideSpinner, showSpinner } from '../../../store/global/actions'

export function uploadInfo({ name, location, color, emoji }) {
	return async (dispatch, getState) => {
		try {
			dispatch(showSpinner())
			dispatch(uploadInfoStart())
			const result = await selfRequest.uploadBaseInfo({
				name,
				location,
				color: color.id,
				emoji
			})
			dispatch(
				setProfileInfo({
					latestLocation: location,
					firstName: name,
					color,
					emoji
				})
			)
			dispatch(uploadInfoSuccess(result))
			if (Platform.OS === 'android') {
				const questionsToBeAnswered = getState().questionsWizard.questions
					.unanswered
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
		} finally {
			dispatch(hideSpinner())
		}
	}
}

export const requestSmsCode = (
	phoneNumberCountryCode,
	phoneNumber
) => async dispatch => {
	try {
		dispatch(showSpinner())
		dispatch(setAuthInfo(phoneNumberCountryCode, phoneNumber))
		dispatch(requestSmsCodeStart())
		await verificationRequest.requestSmsCodeMessage(
			phoneNumberCountryCode,
			phoneNumber
		)
		dispatch(requestSmsCodeSuccess())
		navigate(PAGES_NAMES.AUTH_VERIFICATION_TOKEN_PAGE)
	} catch (err) {
		const error = getErrorDataFromNetworkException(err)
		dispatch(requestSmsCodeError(error))
	} finally {
		dispatch(hideSpinner())
	}
}

export const sendVerificationCode = (
	phoneNumberCountryCode,
	phoneNumber,
	isTelegramUser,
	verificationCode
) => async dispatch => {
	try {
		dispatch(showSpinner())
		dispatch(smsTokenVerificationStart())
		const userInfo = await verificationRequest.sendVerificationCode(
			phoneNumberCountryCode,
			phoneNumber,
			verificationCode,
			isTelegramUser
		)
		const userToken = userInfo.authToken
		const userInfoWithoutToken = _.omit(userInfo, 'authToken')
		await tokenService.setToken(userToken)
		const availableColors = await colorsRequest.getAvailableColors()
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
			const [unanswered, answered] = await Promise.all([
				questionsRequest.fetchQuestions(),
				questionsRequest.fetchAnsweredQuestions()
			])
			const onboardingStepsConfig = calculateOnboardingSteps(
				destinationPageForUser,
				true
			)
			onboardingMaxSteps = onboardingStepsConfig.maxSteps
			onboardingSteps = onboardingStepsConfig.configurationPerPage
			dispatch(setQuestions({ unanswered, answered }))
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
	} finally {
		dispatch(hideSpinner())
	}
}

export const registerTelegramUser = email => async dispatch => {
	try {
		dispatch(showSpinner())
		dispatch(telegramEmailStart())
		const userInfo = await legacyRequest.transferTelegramEmail(email)
		const userToken = userInfo.authToken
		await tokenService.setToken(userToken)
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
	} finally {
		dispatch(hideSpinner())
	}
}

export const clearPhoneNumberErrorState = () => dispatch =>
	dispatch(clearPhoneNumberError())

export const clearSmsTokenVerificationErrorState = () => dispatch =>
	dispatch(clearVerificationCodeError())

export const clearTelegramEmailErrorState = () => dispatch =>
	dispatch(clearTelegramEmailError())

export const updateUserColorSelection = color => dispatch =>
	dispatch(setProfileInfo({ color }))

export const updateUserEmojiSelection = emoji => dispatch =>
	dispatch(setProfileInfo({ emoji }))
