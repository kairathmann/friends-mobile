import { Container, Content, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import PropTypes from 'prop-types'
import React from 'react'
import { Image, ImageBackground, StatusBar, View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Button from '../../../components/Button'
import I18n from '../../../../locales/i18n'
import {
	styles as commonStyles,
	FONTS,
	FONTS_STYLES,
	createFontStyle
} from '../../../styles'
import { PAGES_NAMES } from '../../../navigation/pages'
import LanternLogoWhite from '../../../assets/logos/lantern-logo-white.png'
import SplashBackground from '../../../assets/images/welcome-page-splash-background.png'

class WelcomePage extends React.Component {
	componentDidMount() {
		SplashScreen.hide()
	}

	render() {
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={'transparent'}
					translucent={true}
				/>
				<Container style={commonStyles.content}>
					<ImageBackground
						source={SplashBackground}
						style={styles.backgroundImage}
					>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<View style={styles.logo}>
								<Image
									resizeMode="contain"
									source={LanternLogoWhite}
									style={styles.logoImage}
								/>
								<Text style={styles.logoTitle} adjustsFontSizeToFit>
									{I18n.t('welcome_page.welcome')}
								</Text>
								<Text style={styles.descriptionTitle} adjustsFontSizeToFit>
									{I18n.t('welcome_page.description')}
								</Text>
							</View>
							<View style={styles.buttonsContainer}>
								<Button
									buttonStyle={{
										...styles.button,
										...styles.signUpButtonCustom
									}}
									textStyle={styles.signUpButtonTextCustom}
									text={I18n.t('welcome_page.signup')}
								/>
								<Button
									buttonStyle={styles.button}
									text={I18n.t('welcome_page.login')}
								/>
								<View style={styles.termsContainer}>
									<Text
										style={[styles.terms, commonStyles.underline]}
										onPress={() => {
											this.props.navigation.navigate(PAGES_NAMES.TERMS)
										}}
									>
										{I18n.t('welcome_page.terms')}
									</Text>
									<Text style={styles.terms}>{I18n.t('welcome_page.and')}</Text>
									<Text
										style={[styles.terms, commonStyles.underline]}
										onPress={() => {
											this.props.navigation.navigate(PAGES_NAMES.POLICY)
										}}
									>
										{I18n.t('welcome_page.privacy_policy')}
									</Text>
								</View>
							</View>
						</Content>
					</ImageBackground>
				</Container>
			</React.Fragment>
		)
	}
}

WelcomePage.propTypes = {
	navigation: PropTypes.object.isRequired
}

const styles = EStyleSheet.create({
	backgroundImage: {
		width: '100%',
		height: '100%'
	},
	buttonsContainer: {
		flexGrow: 1,
		alignItems: 'center',
		marginTop: '1rem',
		marginBottom: '1rem'
	},
	button: {
		alignSelf: 'center',
		maxWidth: 256,
		marginBottom: '0.5rem'
	},
	logo: {
		marginTop: '3rem',
		paddingRight: '1rem',
		paddingLeft: '1rem',
		marginBottom: '1rem',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		flexGrow: 1
	},
	logoImage: {
		height: '8rem',
		width: '8rem'
	},
	logoTitle: {
		...createFontStyle(FONTS.LATO),
		fontSize: '2.8rem',
		marginTop: '1.5rem',
		letterSpacing: '0.08rem',
		color: 'white'
	},
	descriptionTitle: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		fontSize: '1rem',
		marginTop: '0.5rem',
		letterSpacing: 1.25,
		lineHeight: 24,
		color: 'white'
	},
	signUpButtonCustom: {
		borderColor: '$starlightColor',
		backgroundColor: '$starlightColor'
	},
	signUpButtonTextCustom: {
		color: '$voidColor'
	},
	termsContainer: {
		justifyContent: 'center',
		flexDirection: 'row'
	},
	terms: {
		...createFontStyle(FONTS.LATO),
		fontSize: 13,
		lineHeight: 16,
		color: '#D3D3D3',
		paddingLeft: 5,
		paddingRight: 5,
		letterSpacing: 0.4
	}
})

export default WelcomePage
