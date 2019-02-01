import { en as onboarding } from '../src/views/pages/onboarding/locales'
import { en as welcome_page } from '../src/views/pages/welcome/locales'
import { en as home } from '../src/views/pages/home/locales'

export default {
	welcome_page,
	onboarding,
	home,
	commons: {
		name: 'Name',
		phone_number: 'Phone Number',
		concluded: 'Concluded',
		not: 'Missed'
	},
	errors: {
		incorrect_request: 'Incorrect request',
		server_error: 'Something is wrong at our side. Please try again later.',
		not_authenticated: 'You are logged out',
		phone_number_invalid: 'Please enter correct phone number.',
		email_invalid: 'Please enter correct email address',
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
		my: 'My rounds'
	}
}
