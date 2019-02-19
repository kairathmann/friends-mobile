export const PAGES_NAMES = {
	WELCOME_PAGE: 'WELCOME_PAGE',
	IDENTIFICATION_PAGE: 'IDENTIFICATION_PAGE',
	BASEINFO_PAGE: 'BASEINFO_PAGE',
	NOTIFICATION_CHECK_PAGE: 'NOTIFICATION_CHECK_PAGE',
	QUESTIONS_PAGE: 'QUESTIONS_PAGE',
	QUESTIONS_BEFORE_PAGE: 'QUESTIONS_BEFORE_PAGE',
	POLICY: 'POLICY',
	TERMS: 'TERMS',
	AUTH_PHONE_NUMBER_PAGE: 'AUTH_PHONE_NUMBER_PAGE',
	AUTH_VERIFICATION_TOKEN_PAGE: 'AUTH_VERIFICATION_TOKEN_PAGE',
	AUTH_TELEGRAM_EMAIL_PAGE: 'AUTH_TELEGRAM_EMAIL_PAGE',
	HOME_PAGE: 'HOME_PAGE',
	PROFILE_TAB: 'PROFILE_PAGE',
	CHAT_TAB: 'CHAT_PAGE',
	HOME_TAB: 'HOME_NESTED_PAGE',
	EDIT_PROFILE_PAGE: 'EDIT_PROFILE_PAGE',
	MATCHING_QUESTIONS_PAGE: 'MATCHING_QUESTIONS_PAGE'
}

export const CITY_MAX_LENGTH = 35
export const NAME_MAX_LENGTH = 30
export const MIN_AMOUNT_OF_ANSWERED_QUESTIONS = 0

export const ONBOARDING_STEPS_PER_LANDING_PAGE_CONFIGURAION = {
	android: {
		[PAGES_NAMES.IDENTIFICATION_PAGE]: {
			[PAGES_NAMES.IDENTIFICATION_PAGE]: 1,
			[PAGES_NAMES.BASEINFO_PAGE]: 2,
			[PAGES_NAMES.NOTIFICATION_CHECK_PAGE]: 3,
			[PAGES_NAMES.QUESTIONS_BEFORE_PAGE]: 3,
			[PAGES_NAMES.QUESTIONS_PAGE]: 4
		},
		[PAGES_NAMES.BASEINFO_PAGE]: {
			[PAGES_NAMES.IDENTIFICATION_PAGE]: 1,
			[PAGES_NAMES.BASEINFO_PAGE]: 1,
			[PAGES_NAMES.NOTIFICATION_CHECK_PAGE]: 2,
			[PAGES_NAMES.QUESTIONS_BEFORE_PAGE]: 2,
			[PAGES_NAMES.QUESTIONS_PAGE]: 3
		}
	},
	ios: {
		[PAGES_NAMES.IDENTIFICATION_PAGE]: {
			[PAGES_NAMES.IDENTIFICATION_PAGE]: 1,
			[PAGES_NAMES.BASEINFO_PAGE]: 2,
			[PAGES_NAMES.NOTIFICATION_CHECK_PAGE]: 3,
			[PAGES_NAMES.QUESTIONS_BEFORE_PAGE]: 4,
			[PAGES_NAMES.QUESTIONS_PAGE]: 5
		},
		[PAGES_NAMES.BASEINFO_PAGE]: {
			[PAGES_NAMES.IDENTIFICATION_PAGE]: 1,
			[PAGES_NAMES.BASEINFO_PAGE]: 1,
			[PAGES_NAMES.NOTIFICATION_CHECK_PAGE]: 2,
			[PAGES_NAMES.QUESTIONS_BEFORE_PAGE]: 3,
			[PAGES_NAMES.QUESTIONS_PAGE]: 4
		}
	}
}

export const DEFAULT_EMOJIS = ['🌈', '🌊', '🍵', '📚', '👾', '🎶', '📿']
