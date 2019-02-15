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
		phone_number: 'Phone Number',
		concluded: 'Concluded',
		not: 'Missed'
	},
	errors: {
		cannot_save_answers: 'Cannot save answers. Try again later.',
		incorrect_request: 'Incorrect request',
		server_error: 'Something is wrong at our side. Please try again later.',
		not_authenticated: 'You are logged out',
		phone_number_invalid: 'Please enter correct phone number.',
		email_invalid: 'Please enter correct email address',
		color_missing: 'Please select color before continuing.',
		color_invalid_id: 'Invalid color selection, please try again.',
		emoji_missing: 'Please select emoji before continuing.',
		verification_failed:
			'SMS Verification failed. Please try to resend verification code.',
		no_internet_connection: 'Oops, could not connect to our services',
		user_already_transferred:
			"This account has already been transferred. Please go back and select 'Get Started' on the welcome page.",
		user_not_found:
			'This email address has not been used for the December 2017 experiments on Telegram.',
		city_missing: 'City field is missing',
		first_name_missing: 'Name field is missing',
		cannot_join: 'Cannot join to this round',
		cannot_resign: 'Your request failed. Try again later'
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
