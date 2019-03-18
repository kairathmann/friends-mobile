import * as _ from 'lodash'
import { responsesRequest, questionsRequest } from '../../api'
import { showErrorToast } from '../../services/toastService'
import i18n from '../../../locales/i18n'
import {
	saveAnswersFailure,
	saveAnswersSuccess
} from '../../store/profile/actions'

import {
	setQuestions,
	saveUnansweredOk,
	saveUnansweredError,
	saveUnansweredRequest
} from '../../store/unanswered_wizard/actions'
import { hideSpinner, showSpinner } from '../../store/global/actions'

const sendAnswerRequest = async answerId => {
	await responsesRequest.uploadAnswers([answerId])
	return Promise.all([
		questionsRequest.fetchQuestions(),
		questionsRequest.fetchAnsweredQuestions()
	])
}

export function saveSingleAnswer(answerId) {
	return async dispatch => {
		try {
			dispatch(showSpinner())
			dispatch(saveUnansweredRequest())
			const [unanswered, answered] = await sendAnswerRequest(answerId)
			dispatch(saveUnansweredOk())
			dispatch(
				saveAnswersSuccess({
					answered: _.uniqBy(answered, 'id'),
					unanswered
				})
			)
			dispatch(setQuestions({ unanswered, answered }))
		} catch (err) {
			dispatch(saveUnansweredError())
			dispatch(saveAnswersFailure(err))
			showErrorToast(i18n.t('errors.cannot_save_answers'))
		} finally {
			dispatch(hideSpinner())
		}
	}
}
