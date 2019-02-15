import * as _ from 'lodash'
import api from '../../../api/api'
import { showErrorToast } from '../../../services/toastService'
import i18n from '../../../../locales/i18n'
import {
	fetchQuestionsFailure,
	fetchQuestionsStarted,
	fetchQuestionsSuccess,
	saveAnswersFailure,
	saveAnswersStarted,
	saveAnswersSuccess
} from '../../../store/profile/actions'

export function fetchQuestions() {
	return async dispatch => {
		try {
			dispatch(fetchQuestionsStarted())
			const result = await Promise.all([
				api.fetchQuestions(),
				api.fetchAnsweredQuestions()
			])
			dispatch(
				fetchQuestionsSuccess({
					answered: _.uniqBy(result[1], 'id'),
					unanswered: result[0]
				})
			)
		} catch (err) {
			dispatch(fetchQuestionsFailure(err))
		}
	}
}

export function saveAnswers(answers) {
	return async dispatch => {
		try {
			dispatch(saveAnswersStarted(answers))
			const answersIds = _.values(answers).map(ans => ans.selected)
			await api.uploadAnswers(answersIds)
			const result = await Promise.all([
				api.fetchQuestions(),
				api.fetchAnsweredQuestions()
			])
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
