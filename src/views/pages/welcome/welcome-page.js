import { Container, Content, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Image, ImageBackground, StatusBar, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import I18n from '../../../../locales/i18n'
import SplashBackground from '../../../assets/images/welcome-page-splash-background.jpg'
import LogoWhite from '../../../assets/logos/logo-white.png'
import Button from '../../../components/Button'
import { PAGES_NAMES } from '../../../navigation/pages'
import { startup } from './scenario-actions'
import {
	createFontStyle,
	FONTS,
	FONTS_STYLES,
	styles as commonStyles
} from '../../../styles'

class WelcomePage extends React.Component {
	componentDidMount() {
		this.props.startup()
	}

	goToAuthPage = () => {
		this.props.navigation.navigate(PAGES_NAMES.AUTH_PHONE_NUMBER_PAGE)
	}

	goToTelegramAuthPage = () => {
		this.props.navigation.navigate(PAGES_NAMES.AUTH_TELEGRAM_EMAIL_PAGE)
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
									source={LogoWhite}
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
									onPress={this.goToAuthPage}
									textStyle={styles.signUpButtonTextCustom}
									text={I18n.t('welcome_page.get_started')}
								/>
								<View style={styles.termsContainer}>
									<Text style={styles.terms}>
										{I18n.t('welcome_page.legal_terms_beggining')}
									</Text>
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
								<Button
									buttonStyle={styles.button}
									onPress={this.goToTelegramAuthPage}
									textStyle={styles.telegramButtonTextCustom}
									text={I18n.t('welcome_page.transfer_from_telegram')}
								/>
								<View style={styles.termsContainer}>
									<Text style={styles.terms}>
										{I18n.t('welcome_page.transfer_from_telegram_explanation')}
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
	navigation: PropTypes.object.isRequired,
	startup: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	backgroundImage: {
		width: '100%',
		height: '100%'
	},
	buttonsContainer: {
		flexGrow: 1,
		justifyContent: 'flex-end',
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
		...createFontStyle(FONTS.LATO, FONTS_STYLES.BOLD),
		marginTop: '1.5rem',
		fontSize: '3rem',
		letterSpacing: -0.5,
		color: 'white'
	},
	descriptionTitle: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		fontSize: '1rem',
		marginTop: '0.5rem',
		letterSpacing: 1.25,
		lineHeight: 24,
		color: '$greyColor'
	},
	signUpButtonCustom: {
		height: 50,
		borderColor: '$starlightColor',
		backgroundColor: '$starlightColor'
	},
	signUpButtonTextCustom: {
		color: '$voidColor',
		fontSize: 16
	},
	telegramButtonTextCustom: {
		fontSize: 14
	},
	termsContainer: {
		marginLeft: 25,
		marginRight: 25,
		flexWrap: 'wrap',
		justifyContent: 'center',
		flexDirection: 'row',
		marginBottom: 12
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

const mapDispatchToProps = dispatch => {
	return {
		startup: () => dispatch(startup())
	}
}

export default connect(
	null,
	mapDispatchToProps
)(WelcomePage)
