import { en as onboarding } from '../src/views/pages/onboarding/locales'
import { en as welcome_page } from '../src/views/pages/welcome/locales'
import { en as home } from '../src/views/pages/home/locales'
import { en as profile_page } from '../src/views/pages/profile/locales'
import { en as edit_profile_page } from '../src/views/pages/edit-profile/locales'
import { en as matching_questions } from '../src/views/pages/matching-questions/locales'

export default {
	welcome_page,
	onboarding,
	home,
	profile_page,
	edit_profile_page,
	matching_questions,
	commons: {
		name: 'Name',
		phone_number: 'Your Phone Number',
		concluded: 'Concluded',
		not: 'Missed',
		cancel: 'Cancel',
		proceed: 'Proceed',
		confirm: 'Confirm'
	},
	errors: {
		cannot_save_answers: 'Cannot save answers. Try again later.',
		cannot_fetch_questions: 'Cannot fetch questions. Try again later.',
		incorrect_request: 'Incorrect request',
		server_error: 'Something is wrong at our side. Please try again later.',
		not_authenticated: 'You are logged out',
		phone_number_invalid: 'Phone number invalid. Please try again.',
		email_invalid: 'Please enter correct email address',
		color_missing: 'Please select color before continuing.',
		color_invalid_id: 'Invalid color selection, please try again.',
		emoji_missing: 'Please select emoji before continuing.',
		verification_failed: 'Code invalid. Plesae try again.',
		no_internet_connection: 'Oops, could not connect to our services',
		user_already_transferred:
			"This account has already been transferred. Please go back and select 'Get Started' on the welcome page.",
		user_not_found:
			'This email address has not been used for the December 2018 experiments on Telegram.',
		city_missing: 'City field is missing',
		first_name_missing: 'Name field is missing',
		cannot_join: 'Cannot join to this round',
		cannot_resign: 'Your request failed. Try again later',
		answer_ids_invalid: "Couldn't save your answer. Try again",
		answer_ids_unknown: 'There is no such answer',
		cannot_fetch_chats: 'Cannot fetch chats. Try again later.',
		invalid_round: 'Round does not exist, please refresh list',
		user_not_subscribed: "You haven't signed up for this round",
		round_hasnt_started: "Round hasn't started yet",
		cannot_fetch_messages: 'Cannot fetch messages. Try again later.'
	},
	navigator: {
		home: 'Luminos',
		profile: 'Profile',
		chat: 'Chat'
	},
	tabs: {
		current: 'Current',
		my: 'My rounds',
		questions: 'Unanswered',
		questions_answered: 'Answered'
	}
}
