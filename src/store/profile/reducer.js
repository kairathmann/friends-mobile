import { DEFAULT_EMOJIS } from '../../enums'
import { SET_COLORS } from '../colors/action-types'
import { LOGOUT_USER_AND_CLEAR_DATA } from '../global/action-types'
import {
	FETCH_MATCHING_QUESTIONS_SUCCESS,
	SAVE_MATCHING_ANSWERS_FAILURE,
	SAVE_MATCHING_ANSWERS_REQUEST,
	SAVE_MATCHING_ANSWERS_SUCCESS,
	SET_PROFILE_INFO
} from './action-types'

const initialState = {
	id: '',
	city: '',
	firstName: '',
	username: '',
	color: '',
	notificationId: '',
	emoji: DEFAULT_EMOJIS[0],
	questions: {
		answered: [],
		unanswered: []
	}
}

export default function profileReducer(
	state = initialState,
	{ type, payload }
) {
	switch (type) {
		case SET_PROFILE_INFO:
			return {
				...state,
				...payload,
				color: payload.color ? payload.color : state.color,
				emoji: payload.emoji ? payload.emoji : state.emoji
			}
		// when colors are fetched from the server, automatically fill default color to the first one if user does not have
		// any selected
		case SET_COLORS:
			return {
				...state,
				color: state.color === '' ? payload[0] : state.color
			}
		case SAVE_MATCHING_ANSWERS_REQUEST:
			return {
				...state,
				temporaryQuestions: { ...state.questions },
				questions: {
					unanswered: state.questions.unanswered.filter(q => !payload[q.id]),
					answered: [...state.questions.answered, ...state.questions.unanswered]
						.filter(q => q.lastAnswer || payload[q.id])
						.map(q => {
							if (payload[q.id]) {
								return {
									...q,
									lastAnswer: payload[q.id].selected
								}
							} else {
								return q
							}
						})
				}
			}
		case SAVE_MATCHING_ANSWERS_FAILURE:
			return {
				...state,
				temporaryQuestions: undefined,
				questions: state.temporaryQuestions
			}
		case SAVE_MATCHING_ANSWERS_SUCCESS:
		case FETCH_MATCHING_QUESTIONS_SUCCESS:
			return {
				...state,
				questions: payload
			}
		case LOGOUT_USER_AND_CLEAR_DATA:
			return initialState
		default:
			return state
	}
}
