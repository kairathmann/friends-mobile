import api from '../../../api/api'
import i18n from '../../../../locales/i18n'

import {
	fetchQuestionsFailure,
	fetchQuestionsStarted,
	fetchQuestionsSuccess
} from '../../../store/profile/actions'
import { showErrorToast } from '../../../services/toastService'
import { setQuestions } from '../../../store/unanswered_wizard/actions'

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
			dispatch(setQuestions(unanswered))
		} catch (err) {
			dispatch(fetchQuestionsFailure(err))
			showErrorToast(i18n.t('errors.cannot_fetch_questions'))
		}
	}
}
