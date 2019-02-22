import * as _ from 'lodash'
import api from '../../../api/api'
import { showErrorToast } from '../../../services/toastService'
import { navigate } from '../../../services/navigationService'
import { PAGES_NAMES } from '../../../enums'
import i18n from '../../../../locales/i18n'
import {
	fetchQuestionsFailure,
	fetchQuestionsStarted,
	fetchQuestionsSuccess,
	saveAnswersFailure,
	saveAnswersStarted,
	saveAnswersSuccess
} from '../../../store/profile/actions'

const sendAnswerRequest = async answers => {
	const answersIds = _.values(answers).map(ans => ans.selected)
	await api.uploadAnswers(answersIds)
	return Promise.all([api.fetchQuestions(), api.fetchAnsweredQuestions()])
}

export function fetchQuestions() {
	return async dispatch => {
		try {
			dispatch(fetchQuestionsStarted())
			const [unanswered, answered] = await Promise.all([
				api.fetchQuestions(),
				api.fetchAnsweredQuestions()
			])
			dispatch(
				fetchQuestionsSuccess({
					answered,
					unanswered
				})
			)
		} catch (err) {
			dispatch(fetchQuestionsFailure(err))
			showErrorToast(i18n.t('errors.cannot_fetch_questions'))
		}
	}
}

export function saveUnanswered(answers) {
	return async dispatch => {
		try {
			dispatch(saveAnswersStarted(answers))
			const result = await sendAnswerRequest(answers)
			dispatch(
				saveAnswersSuccess({
					answered: _.uniqBy(result[1], 'id'),
					unanswered: result[0]
				})
			)
		} catch (err) {
			dispatch(saveAnswersFailure(err))
			showErrorToast(i18n.t('errors.cannot_save_answers'))
		}
	}
}

export function saveAnswered(answers) {
	return async dispatch => {
		try {
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
		}
	}
}
