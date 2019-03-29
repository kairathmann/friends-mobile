import TestRenderer from 'react-test-renderer'
import React from 'react'
import WelcomePage from '../../../src/views/pages/welcome/welcome-page'
import Button from '../../../src/components/Button'
import { PAGES_NAMES } from '../../../src/navigation/pages'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

describe('WelcomePage Component', () => {
	const initialState = {}
	const middlewares = [thunk]
	const mockStore = configureStore(middlewares)
	let store

	beforeEach(() => {
		store = mockStore(initialState)
	})

	it('renders without crashing', () => {
		const navigation = { navigate: jest.fn() }
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<WelcomePage startup={jest.fn()} navigation={navigation} />
			</Provider>
		)
		const testInstance = testRender.root
		expect(testInstance).not.toBe(null)
	})

	it('clicking Get started button should change navigation to AUTH_PHONE_NUMBER_PAGE', () => {
		const navigation = { navigate: jest.fn() }
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<WelcomePage startup={jest.fn()} navigation={navigation} />
			</Provider>
		)
		const testInstance = testRender.root
		const loginButton = testInstance.findAllByType(Button)[0]
		const loginButtonProps = loginButton.props
		// Click Button
		loginButtonProps.onPress()
		expect(navigation.navigate.mock.calls.length).toBe(1)
		expect(navigation.navigate.mock.calls[0][0]).toBe(
			PAGES_NAMES.AUTH_PHONE_NUMBER_PAGE
		)
	})

	it('clicking Transfer from Telegram button should change navigation to AUTH_TELEGRAM_EMAIL_PAGE', () => {
		const navigation = { navigate: jest.fn() }
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<WelcomePage startup={jest.fn()} navigation={navigation} />
			</Provider>
		)
		const testInstance = testRender.root
		const telegramTransferButton = testInstance.findAllByType(Button)[1]
		const telegramTransferButtonProps = telegramTransferButton.props
		// Click Button
		telegramTransferButtonProps.onPress()
		expect(navigation.navigate.mock.calls.length).toBe(1)
		expect(navigation.navigate.mock.calls[0][0]).toBe(
			PAGES_NAMES.AUTH_TELEGRAM_EMAIL_PAGE
		)
	})

	it('clicking Terms button should change navigation to TERMS', () => {
		const navigation = { navigate: jest.fn() }
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<WelcomePage startup={jest.fn()} navigation={navigation} />
			</Provider>
		)
		const testInstance = testRender.root
		const termsText = testInstance.findByProps({
			testID: 'WELCOME_PAGE_TERMS_BUTTON'
		})
		const termsTextProps = termsText.props
		// Click Button
		termsTextProps.onPress()
		expect(navigation.navigate.mock.calls.length).toBe(1)
		expect(navigation.navigate.mock.calls[0][0]).toBe(PAGES_NAMES.TERMS)
	})

	it('clicking Policy button should change navigation to POLICY', () => {
		const navigation = { navigate: jest.fn() }
		const testRender = TestRenderer.create(
			<Provider store={store}>
				<WelcomePage startup={jest.fn()} navigation={navigation} />
			</Provider>
		)
		const testInstance = testRender.root
		const policyText = testInstance.findByProps({
			testID: 'WELCOME_PAGE_POLICY_BUTTON'
		})
		const policyTextProps = policyText.props
		// Click Button
		policyTextProps.onPress()
		expect(navigation.navigate.mock.calls.length).toBe(1)
		expect(navigation.navigate.mock.calls[0][0]).toBe(PAGES_NAMES.POLICY)
	})
})
