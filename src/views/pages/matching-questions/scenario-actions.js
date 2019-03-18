import * as _ from 'lodash'
import { responsesRequest, questionsRequest } from '../../../api'
import { showErrorToast } from '../../../services/toastService'
import { navigate } from '../../../services/navigationService'
import { PAGES_NAMES } from '../../../enums'
import i18n from '../../../../locales/i18n'
import {
	saveAnswersFailure,
	saveAnswersStarted,
	saveAnswersSuccess
} from '../../../store/profile/actions'
import { hideSpinner, showSpinner } from '../../../store/global/actions'

const sendAnswerRequest = async answers => {
	const answersIds = _.values(answers).map(ans => ans.selected)
	await responsesRequest.uploadAnswers(answersIds)
	return Promise.all([
		questionsRequest.fetchQuestions(),
		questionsRequest.fetchAnsweredQuestions()
	])
}

export function saveAnswered(answers) {
	return async dispatch => {
		try {
			dispatch(showSpinner())
			dispatch(saveAnswersStarted(answers))
			const result = await sendAnswerRequest(answers)
			dispatch(
				saveAnswersSuccess({
					answered: _.uniqBy(result[1], 'id'),
					unanswered: result[0]
				})
			)
			navigate(PAGES_NAMES.MATCHING_QUESTIONS_PAGE)
		} catch (err) {
			dispatch(saveAnswersFailure(err))
			showErrorToast(i18n.t('errors.cannot_save_answers'))
		} finally {
			dispatch(hideSpinner())
		}
	}
}
