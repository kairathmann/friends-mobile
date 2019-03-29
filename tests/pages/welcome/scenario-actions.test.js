import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import SplashScreen from 'react-native-splash-screen'
import { navigationService, tokenService } from '../../../src/services'
import { PAGES_NAMES } from '../../../src/navigation/pages'
import { colorsRequest, selfRequest } from '../../../src/api'
import * as actions from '../../../src/views/pages/welcome/scenario-actions'
import { SET_COLORS } from '../../../src/store/colors/action-types'
import { SET_PROFILE_INFO } from '../../../src/store/profile/action-types'
import { UPDATE_ONBOARDING_CONFIG } from '../../../src/store/onboarding/action-types'
import { DEFAULT_EMOJIS } from '../../../src/enums'

describe('WelcomePage Scenario Actions', () => {
	const initialState = {
		colors: {
			colors: []
		},
		profile: {
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
	}
	const middlewares = [thunk]
	const mockStore = configureStore(middlewares)
	let store

	beforeEach(() => {
		store = mockStore(initialState)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should call SplashScreen.hide method when user token does not exist yet on device', async () => {
		tokenService.getToken = jest.fn(() => '')
		SplashScreen.hide = jest.fn()
		await store.dispatch(actions.startup())
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
	})

	it("should call SplashScreen.hide method and redirect to HomePage when user token can't be retrieved", async () => {
		tokenService.getToken = jest.fn(() => Promise.reject('ERROR'))
		navigationService.navigate = jest.fn()
		SplashScreen.hide = jest.fn()
		await store.dispatch(actions.startup())
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls[0][0]).toBe(
			PAGES_NAMES.WELCOME_PAGE
		)
	})

	it("should navigate to WelcomePage when user can't be fetched", async () => {
		const colorsPayload = [{ id: 1, hexValue: 'FFFFFF' }]
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		navigationService.navigate = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.reject('ERROR'))
		colorsRequest.getAvailableColors = jest.fn(() =>
			Promise.resolve(colorsPayload)
		)
		await store.dispatch(actions.startup())
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls[0][0]).toBe(
			PAGES_NAMES.WELCOME_PAGE
		)
	})

	it("should navigate to WelcomePage when colors can't be fetched", async () => {
		const profilePayload = {
			id: 1,
			authToken: 'test-token',
			firstName: 'test',
			username: '123456789',
			color: {
				id: 1,
				hexValue: 'FFFFFF'
			},
			emoji: '😪',
			notificationId: '1234abcd',
			latestLocation: {
				latitude: 1,
				longitude: 1,
				fullName: 'Nice city',
				mapboxId: 1
			}
		}
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.resolve(profilePayload))
		colorsRequest.getAvailableColors = jest.fn(() => Promise.reject('error'))
		await store.dispatch(actions.startup())
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls.length).toBe(1)
		expect(navigationService.navigate.mock.calls[0][0]).toBe(
			PAGES_NAMES.WELCOME_PAGE
		)
	})

	it('should redirect user to HomePage when every request was a success and user profile is complete', async () => {
		const profilePayload = {
			id: 1,
			authToken: 'test-token',
			firstName: 'test',
			username: '123456789',
			color: {
				id: 1,
				hexValue: 'FFFFFF'
			},
			emoji: '😪',
			notificationId: '1234abcd',
			latestLocation: {
				latitude: 1,
				longitude: 1,
				fullName: 'Nice city',
				mapboxId: 1
			}
		}
		const expectedReduxActions = [
			{
				type: SET_COLORS,
				payload: [
					{
						id: 1,
						hexValue: 'FFFFFF'
					}
				]
			},
			{
				type: SET_PROFILE_INFO,
				payload: {
					id: 1,
					firstName: 'test',
					username: '123456789',
					color: {
						id: 1,
						hexValue: 'FFFFFF'
					},
					emoji: '😪',
					notificationId: '1234abcd',
					latestLocation: {
						latitude: 1,
						longitude: 1,
						fullName: 'Nice city',
						mapboxId: 1
					}
				}
			}
		]
		const colorsPayload = [{ id: 1, hexValue: 'FFFFFF' }]
		navigationService.navigateAndResetNavigation = jest.fn()
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.resolve(profilePayload))
		colorsRequest.getAvailableColors = jest.fn(() =>
			Promise.resolve(colorsPayload)
		)
		await store.dispatch(actions.startup())
		const reduxActions = store.getActions()
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigateAndResetNavigation.mock.calls.length).toBe(
			1
		)
		expect(navigationService.navigateAndResetNavigation.mock.calls[0][0]).toBe(
			PAGES_NAMES.HOME_PAGE
		)
		expect(reduxActions).toEqual(expectedReduxActions)
	})

	it('should redirect user to IdentificationPage when every request was a success and user profile is missing emoji', async () => {
		const profilePayload = {
			id: 1,
			authToken: 'test-token',
			firstName: 'test',
			username: '123456789',
			color: {
				id: 1,
				hexValue: 'FFFFFF'
			},
			emoji: '',
			notificationId: '1234abcd',
			latestLocation: {
				latitude: 1,
				longitude: 1,
				fullName: 'Nice city',
				mapboxId: 1
			}
		}
		const expectedReduxActions = [
			{
				type: SET_COLORS,
				payload: [
					{
						id: 1,
						hexValue: 'FFFFFF'
					}
				]
			},
			{
				type: SET_PROFILE_INFO,
				payload: {
					id: 1,
					firstName: 'test',
					username: '123456789',
					color: {
						id: 1,
						hexValue: 'FFFFFF'
					},
					emoji: '',
					notificationId: '1234abcd',
					latestLocation: {
						latitude: 1,
						longitude: 1,
						fullName: 'Nice city',
						mapboxId: 1
					}
				}
			},
			{
				type: UPDATE_ONBOARDING_CONFIG,
				payload: {
					maxSteps: 3,
					stepsConfig: {
						BASEINFO_PAGE: 2,
						IDENTIFICATION_PAGE: 1,
						NOTIFICATION_CHECK_PAGE: 3,
						QUESTIONS_BEFORE_PAGE: 4,
						QUESTIONS_PAGE: 5
					}
				}
			}
		]
		const colorsPayload = [{ id: 1, hexValue: 'FFFFFF' }]
		navigationService.navigateAndResetNavigation = jest.fn()
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.resolve(profilePayload))
		colorsRequest.getAvailableColors = jest.fn(() =>
			Promise.resolve(colorsPayload)
		)
		await store.dispatch(actions.startup())
		const reduxActions = store.getActions()
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigateAndResetNavigation.mock.calls.length).toBe(
			1
		)
		expect(navigationService.navigateAndResetNavigation.mock.calls[0][0]).toBe(
			PAGES_NAMES.IDENTIFICATION_PAGE
		)
		expect(reduxActions).toEqual(expectedReduxActions)
	})

	it('should redirect user to IdentificationPage when every request was a success and user profile is missing color', async () => {
		const profilePayload = {
			id: 1,
			authToken: 'test-token',
			firstName: 'test',
			username: '123456789',
			emoji: '😪',
			notificationId: '1234abcd',
			latestLocation: {
				latitude: 1,
				longitude: 1,
				fullName: 'Nice city',
				mapboxId: 1
			}
		}
		const expectedReduxActions = [
			{
				type: SET_COLORS,
				payload: [
					{
						id: 1,
						hexValue: 'FFFFFF'
					}
				]
			},
			{
				type: SET_PROFILE_INFO,
				payload: {
					id: 1,
					firstName: 'test',
					username: '123456789',
					emoji: '😪',
					notificationId: '1234abcd',
					latestLocation: {
						latitude: 1,
						longitude: 1,
						fullName: 'Nice city',
						mapboxId: 1
					}
				}
			},
			{
				type: UPDATE_ONBOARDING_CONFIG,
				payload: {
					maxSteps: 3,
					stepsConfig: {
						BASEINFO_PAGE: 2,
						IDENTIFICATION_PAGE: 1,
						NOTIFICATION_CHECK_PAGE: 3,
						QUESTIONS_BEFORE_PAGE: 4,
						QUESTIONS_PAGE: 5
					}
				}
			}
		]
		const colorsPayload = [{ id: 1, hexValue: 'FFFFFF' }]
		navigationService.navigateAndResetNavigation = jest.fn()
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.resolve(profilePayload))
		colorsRequest.getAvailableColors = jest.fn(() =>
			Promise.resolve(colorsPayload)
		)
		await store.dispatch(actions.startup())
		const reduxActions = store.getActions()
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigateAndResetNavigation.mock.calls.length).toBe(
			1
		)
		expect(navigationService.navigateAndResetNavigation.mock.calls[0][0]).toBe(
			PAGES_NAMES.IDENTIFICATION_PAGE
		)
		expect(reduxActions).toEqual(expectedReduxActions)
	})

	it('should redirect user to BaseInfoPage when every request was a success and user profile is missing firstName and latestLocation', async () => {
		const profilePayload = {
			id: 1,
			firstName: '',
			authToken: 'test-token',
			username: '123456789',
			latestLocation: {
				name: ''
			},
			color: {
				id: 1,
				hexValue: 'FFFFFF'
			},
			emoji: '😪',
			notificationId: '1234abcd'
		}
		const expectedReduxActions = [
			{
				type: SET_COLORS,
				payload: [
					{
						id: 1,
						hexValue: 'FFFFFF'
					}
				]
			},
			{
				type: SET_PROFILE_INFO,
				payload: {
					id: 1,
					firstName: '',
					username: '123456789',
					latestLocation: {
						name: ''
					},
					color: {
						id: 1,
						hexValue: 'FFFFFF'
					},
					emoji: '😪',
					notificationId: '1234abcd'
				}
			},
			{
				type: UPDATE_ONBOARDING_CONFIG,
				payload: {
					maxSteps: 2,
					stepsConfig: {
						BASEINFO_PAGE: 1,
						IDENTIFICATION_PAGE: 1,
						NOTIFICATION_CHECK_PAGE: 2,
						QUESTIONS_BEFORE_PAGE: 3,
						QUESTIONS_PAGE: 4
					}
				}
			}
		]
		const colorsPayload = [{ id: 1, hexValue: 'FFFFFF' }]
		navigationService.navigateAndResetNavigation = jest.fn()
		tokenService.getToken = jest.fn(() => 'TEST TOKEN')
		SplashScreen.hide = jest.fn()
		selfRequest.fetchSelf = jest.fn(() => Promise.resolve(profilePayload))
		colorsRequest.getAvailableColors = jest.fn(() =>
			Promise.resolve(colorsPayload)
		)
		await store.dispatch(actions.startup())
		const reduxActions = store.getActions()
		expect(SplashScreen.hide.mock.calls.length).toBe(1)
		expect(navigationService.navigateAndResetNavigation.mock.calls.length).toBe(
			1
		)
		expect(navigationService.navigateAndResetNavigation.mock.calls[0][0]).toBe(
			PAGES_NAMES.BASEINFO_PAGE
		)
		expect(reduxActions).toEqual(expectedReduxActions)
	})
})
