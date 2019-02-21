import React from 'react'
import { Image } from 'react-native'
/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
import {
	createAppContainer,
	createBottomTabNavigator,
	createStackNavigator
} from 'react-navigation'
import I18n from '../../locales/i18n'
import ChatIcon from '../assets/images/bottom_chat_icon.png'
import HomeIcon from '../assets/images/bottom_home_icon.png'
import ProfileIcon from '../assets/images/bottom_profile_icon.png'
import * as navigationService from '../services/navigationService'
import { COLORS } from '../styles'
import ChatPage from '../views/pages/chat/chat-page'
import HomePage from '../views/pages/home/home-page'
import BaseinfoPage from '../views/pages/onboarding/baseinfo-page'
import NotificationCheckPage from '../views/pages/onboarding/notification-check-page'
import QuestionsBeforePage from '../views/pages/onboarding/questions-before-page'
import QuestionsPage from '../views/pages/onboarding/questions-page'
import PolicyPage from '../views/pages/policy/policy-page'
import ProfilePage from '../views/pages/profile/profile-page'
import TermsPage from '../views/pages/terms/terms-page'
import WelcomePage from '../views/pages/welcome/welcome-page'
import AuthPagePhoneNumberPage from '../views/pages/onboarding/auth-phone-number-page'
import AuthPageTokenVerificationPage from '../views/pages/onboarding/auth-phone-token-verification-page'
import AuthTelegramEmailPage from '../views/pages/onboarding/auth-telegram-email-page'
import IdentificationPage from '../views/pages/onboarding/identification-page'
import UserColorAwareComponent from '../components/UserColorAwareComponent'
import EditProfilePage from '../views/pages/edit-profile'
import MatchingQuestionsPage from '../views/pages/matching-questions/matching-questions-page'
import ChatMesasgesPage from '../views/pages/chat-messages'
import { PAGES_NAMES } from '../enums'

const BottomBarNavigationIcon = ({ focused, icon }) => (
	<UserColorAwareComponent>
		{color => (
			<Image
				style={{
					width: 20,
					height: 20,
					tintColor: focused ? color : COLORS.LUMINOS_GREY
				}}
				source={icon}
			/>
		)}
	</UserColorAwareComponent>
)

const HomeBottomBar = createBottomTabNavigator(
	{
		CHAT_TAB: {
			screen: ChatPage,
			navigationOptions: () => ({
				title: I18n.t('navigator.chat'),
				tabBarIcon: ({ focused }) => {
					return <BottomBarNavigationIcon focused={focused} icon={ChatIcon} />
				},
				header: null
			})
		},
		HOME_TAB: {
			screen: HomePage,
			navigationOptions: () => ({
				title: I18n.t('navigator.home'),
				tabBarIcon: ({ focused }) => {
					return <BottomBarNavigationIcon focused={focused} icon={HomeIcon} />
				},
				header: null
			})
		},
		PROFILE_TAB: {
			screen: ProfilePage,
			navigationOptions: () => ({
				title: I18n.t('navigator.profile'),
				tabBarIcon: ({ focused }) => {
					return (
						<BottomBarNavigationIcon focused={focused} icon={ProfileIcon} />
					)
				},
				header: null
			})
		}
	},
	{
		initialRouteName: 'HOME_TAB',
		tabBarOptions: {
			order: [
				PAGES_NAMES.HOME_TAB,
				PAGES_NAMES.PROFILE_TAB,
				PAGES_NAMES.CHAT_TAB
			],
			showLabel: false,
			style: {
				backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR
			},
			activeTintColor: '#50E3C2'
		}
	}
)

const AppStackNavigator = createStackNavigator({
	WELCOME_PAGE: {
		screen: WelcomePage,
		navigationOptions: () => ({
			header: null
		})
	},
	IDENTIFICATION_PAGE: {
		screen: IdentificationPage,
		navigationOptions: () => ({
			header: null
		})
	},
	BASEINFO_PAGE: {
		screen: BaseinfoPage,
		navigationOptions: () => ({
			header: null
		})
	},
	NOTIFICATION_CHECK_PAGE: {
		screen: NotificationCheckPage,
		navigationOptions: () => ({
			header: null
		})
	},
	QUESTIONS_PAGE: {
		screen: QuestionsPage,
		navigationOptions: () => ({
			header: null,
			gesturesEnabled: false
		})
	},
	QUESTIONS_BEFORE_PAGE: {
		screen: QuestionsBeforePage,
		navigationOptions: () => ({
			header: null
		})
	},
	POLICY: {
		screen: PolicyPage,
		navigationOptions: () => ({
			headerTintColor: 'white',
			headerStyle: { backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR }
		})
	},
	TERMS: {
		screen: TermsPage,
		navigationOptions: () => ({
			headerTintColor: 'white',
			headerStyle: { backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR }
		})
	},
	AUTH_PHONE_NUMBER_PAGE: {
		screen: AuthPagePhoneNumberPage,
		navigationOptions: () => ({
			header: null
		})
	},
	AUTH_VERIFICATION_TOKEN_PAGE: {
		screen: AuthPageTokenVerificationPage,
		navigationOptions: () => ({
			header: null
		})
	},
	AUTH_TELEGRAM_EMAIL_PAGE: {
		screen: AuthTelegramEmailPage,
		navigationOptions: () => ({
			header: null
		})
	},
	HOME_PAGE: {
		screen: HomeBottomBar,
		navigationOptions: () => ({
			header: null
		})
	},
	EDIT_PROFILE_PAGE: {
		screen: EditProfilePage,
		navigationOptions: () => ({
			header: null
		})
	},
	MATCHING_QUESTIONS_PAGE: {
		screen: MatchingQuestionsPage,
		navigationOptions: () => ({
			header: null
		})
	},
	CHAT_MESSAGES_PAGE: {
		screen: ChatMesasgesPage,
		navigationOptions: () => ({
			header: null
		})
	}
})

const AppNavigator = createAppContainer(AppStackNavigator)

const AppStackNavigatorWithGlobalSupport = () => (
	<AppNavigator
		ref={navigatorRef => {
			navigationService.setTopLevelNavigator(navigatorRef)
		}}
	/>
)

export { AppStackNavigatorWithGlobalSupport, PAGES_NAMES }
