import { chatsRequest, feedbackRequest } from '../../api'
import I18n from '../../../locales/i18n'
import { FEEDBACK_QUESTIONS_TYPE } from '../../enums'
import { navigationService, toastService } from '../../services'
import { getErrorDataFromNetworkException } from '../../common/utils'
import { PAGES_NAMES } from '../../navigation/pages'
import {
	fetchFeedbackQuestionsFailure,
	fetchFeedbackQuestionsStarted,
	fetchFeedbackQuestionsSuccess,
	saveFeedbackAsnwersFailure,
	saveFeedbackAsnwersStarted,
	saveFeedbackAsnwersSuccess
} from '../../store/feedback/actions'
import { hideSpinner, showSpinner } from '../../store/global/actions'

export const fetchFeedbackQuestions = chatId => async (dispatch, getState) => {
	try {
		const feedbackQuesionsAlreadyFetched =
			getState().feedback.questions.length > 0
		if (!feedbackQuesionsAlreadyFetched) {
			dispatch(fetchFeedbackQuestionsStarted())
			const questions = await feedbackRequest.fetchFeedbackQuestions()
			dispatch(fetchFeedbackQuestionsSuccess(questions))
		}
		navigationService.navigate(PAGES_NAMES.FEEDBACK_PAGE, { chatId })
	} catch (err) {
		const error = getErrorDataFromNetworkException(err)
		dispatch(fetchFeedbackQuestionsFailure())
		toastService.showErrorToast(error, 'top')
	}
}

export const saveFeedbackAnswers = (chatId, answers) => async dispatch => {
	try {
		dispatch(showSpinner())
		dispatch(saveFeedbackAsnwersStarted())
		const answersOnlyContainingText = answers.filter(
			answer => answer.answer !== 0 && answer.answer !== ''
		)
		const remappedModel = answersOnlyContainingText.map(answer => ({
			feedback_question_id: answer.questionId,
			[answer.type === FEEDBACK_QUESTIONS_TYPE.RATING
				? 'rating_response'
				: 'text_response']: answer.answer
		}))
		await chatsRequest.saveFeedbackAnswers(chatId, remappedModel)
		dispatch(saveFeedbackAsnwersSuccess(chatId))
		navigationService.goBack()
	} catch (err) {
		let errorMessage =
			err.response && err.response.status === 404
				? I18n.t(`errors.cannot_save_feedback_answers`)
				: getErrorDataFromNetworkException(err)
		toastService.showErrorToast(errorMessage, 'top')
		dispatch(saveFeedbackAsnwersFailure(errorMessage))
	} finally {
		dispatch(hideSpinner())
	}
}
