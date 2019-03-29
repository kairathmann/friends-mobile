import TestRenderer from 'react-test-renderer'
import React from 'react'
import EditProfilePage from '../../../src/views/pages/edit-profile/edit-profile-page'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../src/store/utils/selectors'
import { NavigationBottomBar } from '../../../src/components/NavigationBottomBar/NavigationBottomBar'
import { DEFAULT_EMOJIS } from '../../../src/enums'
import I18n from '../../../locales/i18n'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme'

describe('WelcomePage Component', () => {
	const initialState = {
		profile: {
			color: { id: 1, hexValue: 'FF0000' },
			firstName: 'Hello',
			emoji: DEFAULT_EMOJIS[0],
			latestLocation: {
				fullName: 'Katowice, Silesia, Poland',
				name: 'Katowice',
				mapboxId: '123',
				latitude: 19.0,
				longitude: 51.0
			}
		},
		colors: {
			colors: [
				{ id: 1, hexValue: 'FF0000' },
				{ id: 2, hexValue: '00FF00' },
				{ id: 3, hexValue: '0000FF' }
			]
		}
	}
	const middlewares = [thunk]
	const mockStore = configureStore(middlewares)
	let store

	const pagePropsGetter = state => {
		return {
			baseInfoError: createErrorMessageSelector(['UPLOAD_INFO'])(state),
			isLoading: createLoadingSelector(['UPLOAD_INFO'])(state),
			navigation: { goBack: jest.fn() },
			firstName: state.profile.firstName,
			location: state.profile.latestLocation,
			color: state.profile.color,
			emoji: state.profile.emoji,
			availableColors: state.colors.colors
		}
	}

	beforeEach(() => {
		store = mockStore(initialState)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('renders without crashing', () => {
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const testInstance = testRender.root
		expect(testInstance).not.toBe(null)
	})

	it('Left arrow bottom bar click traverse to welcome page without saving changes', () => {
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const testInstance = testRender.root
		const navBar = testInstance.findByType(NavigationBottomBar)
		const pageComponent = testInstance.findByType(EditProfilePage)
		const navigation = pageComponent.props.navigation

		navBar.props.onLeftClick()

		const actions = store.getActions()

		expect(actions.length).toBe(0)
		expect(navigation.goBack.mock.calls.length).toBe(1)
	})

	it('state.color receives new value when clicks on color circle', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)

		const pageComponent = testRender.find('EditProfilePage')
		const firstColorCircle = testRender.find('ColorCircle').first()

		const incomingColor = firstColorCircle.props().color
		firstColorCircle.props().onPress()

		expect(
			pageComponent.props().availableColors.map(color => color.hexValue)
		).toContain(incomingColor)
		expect(pageComponent.state().color.hexValue).toEqual(incomingColor)
	})

	it('state.emoji receives new value when clicks on emocji circle', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)

		const pageComponent = testRender.find('EditProfilePage')
		const firstEmojiCircle = testRender.find('EmojiCircle').first()
		const incomingEmoji = firstEmojiCircle.props().emoji

		firstEmojiCircle.props().onPress()

		expect(DEFAULT_EMOJIS).toContain(incomingEmoji)
		expect(pageComponent.state().emoji).toEqual(incomingEmoji)
	})

	it('state.name initial value equal to store.profile.firstName', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)

		const pageComponent = testRender.find('EditProfilePage')

		expect(pageComponent.state().name).toEqual(
			store.getState().profile.firstName
		)
	})

	it('state.name changed after interaction with UserNameInput', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)

		const pageComponent = testRender.find('EditProfilePage')
		const userNameInput = testRender.find(
			`TextInput[label="${I18n.t('onboarding.name_warning')}"]`
		)
		const sampleChange = 'TEST_NAME'

		userNameInput.props().onChange(sampleChange)

		expect(pageComponent.state().name).toEqual(sampleChange)
	})

	it('Right arrow bottom bar click triggers spinner and save changes', () => {
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const testInstance = testRender.root
		const navBar = testInstance.findByType(NavigationBottomBar)

		navBar.props.onRightClick()

		const actions = store.getActions()

		expect(actions.length).toBe(2)
		expect(actions).toEqual([
			{ type: 'GLOBAL_SHOW_SPINNER' },
			{ type: 'UPLOAD_INFO_REQUEST' }
		])
	})

	it('Fails validation on empty name', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const pageComponent = testRender.find('EditProfilePage')

		pageComponent.setState({ name: '' })

		const actions = store.getActions()
		expect(pageComponent.instance().validate()).toBeFalsy()
		expect(actions.length).toBe(0)
	})

	it('Fails validation on invalid location', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const pageComponent = testRender.find('EditProfilePage')

		pageComponent.setState({ location: '' })

		const actions = store.getActions()
		expect(pageComponent.instance().validate()).toBeFalsy()
		expect(actions.length).toBe(0)
	})

	it('Fails validation on invalid color', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const pageComponent = testRender.find('EditProfilePage')

		pageComponent.setState({ color: '' })

		const actions = store.getActions()
		expect(pageComponent.instance().validate()).toBeFalsy()
		expect(actions.length).toBe(0)
	})

	it('Fails validation on color not present in availableColors', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const pageComponent = testRender.find('EditProfilePage')
		const notExistingColor = {
			hexValue: 'DEADBEEF',
			id: 123
		}

		pageComponent.setState({ color: notExistingColor })

		const actions = store.getActions()
		expect(
			pageComponent.props().availableColors.includes(notExistingColor)
		).toBeFalsy()
		expect(pageComponent.instance().validate()).toBeFalsy()
		expect(actions.length).toBe(0)
	})

	it('Fails validation on invalid emoji', () => {
		const testRender = mount(
			<Provider store={store}>
				<EditProfilePage {...pagePropsGetter(store.getState())} />
			</Provider>
		)
		const pageComponent = testRender.find('EditProfilePage')

		pageComponent.setState({ emoji: '' })

		const actions = store.getActions()
		expect(pageComponent.instance().validate()).toBeFalsy()
		expect(actions.length).toBe(0)
	})
})
