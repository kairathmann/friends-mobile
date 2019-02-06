import algoliasearch from 'algoliasearch'
import debounce from 'lodash/debounce'
import { Container, Content, Spinner, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { LayoutAnimation, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Config from 'react-native-config'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import TextInput from '../../../components/TextInput/TextInput'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import { CITY_MAX_LENGTH, NAME_MAX_LENGTH } from '../../../enums'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { LUMINOS_ACCENT } from '../../../styles/colors'
import * as FONTS from '../../../styles/fonts'
import * as FONTS_STYLES from '../../../styles/fontStyles'
import { uploadInfo } from './scenario-actions'

const places = algoliasearch.initPlaces(
	Config.APP_ALGOLIA_APP_ID,
	Config.APP_ALGOLIA_API_KEY
)

class BaseinfoPage extends React.Component {
	state = {
		name: this.props.isTelegramUser ? this.props.firstName : '',
		city: this.props.isTelegramUser ? this.props.city : '',
		cityError: false,
		cityLoading: false
	}

	componentDidMount() {
		// need to check it in componentDidMount because handleCityChange is using setState
		// and calling setState inside constructor is forbidden as component is not mounted yet then
		if (this.props.isTelegramUser && this.state.city !== '') {
			this.handleCityChange(this.state.city)
		}
	}

	handleNameChange = text => {
		this.setState({
			name: text
		})
	}

	handleCityChange = city => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
		this.setState(
			{
				city,
				cityLoading: true
			},
			this.askForPlaces
		)
	}

	validate = () => {
		const { city, cityError, name, cityLoading } = this.state

		return !cityLoading && city.length !== 0 && name.length !== 0 && !cityError
	}

	handleSave = () => {
		this.props.saveData({
			name: this.state.name,
			city: this.state.city,
			color: this.props.color
		})
	}

	askForPlaces = debounce(() => {
		const { city } = this.state
		places.search(
			{
				query: this.state.city,
				type: 'city',
				hitsPerPage: 3,
				getRankingInfo: true
			},
			(err, res) => {
				if (err) {
					return this.setState({
						cityLoading: false,
						cityError: true
					})
				}
				const foundExactMatches = res.hits.filter(
					h => h._rankingInfo.nbExactWords === city.split(' ').length
				)
				this.setState({
					cityError: foundExactMatches.length === 0,
					cityLoading: false
				})
			}
		)
	}, 2500)

	render() {
		return (
			<React.Fragment>
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<UserColorAwareComponent>
						{color => (
							<Container style={commonStyles.content}>
								<Content
									contentContainerStyle={[
										commonStyles.scrollableContent,
										styles.center
									]}
								>
									{this.props.isLoading && <Spinner color={'white'} />}
									<OnboardingHeader
										pageNumber={2}
										leftText={i18n.t('onboarding.sign_up')}
										totalPage={4}
									/>
									<View style={styles.avatarContainer}>
										<View style={[styles.avatar, { backgroundColor: color }]} />
										<Text
											style={[
												styles.text,
												styles.lato,
												styles.completeText,
												styles.verticalSpace
											]}
										>
											{i18n.t('onboarding.complete_profile')}
										</Text>
									</View>
									<View style={styles.formContainer}>
										<Text
											style={[styles.text, styles.textHeader, styles.space]}
										>
											{i18n.t('onboarding.public_profile').toUpperCase()}
										</Text>
										{this.props.isTelegramUser &&
											(this.state.city !== '' || this.state.name !== '') && (
												<Text
													style={[
														styles.text,
														styles.lato,
														styles.completeText,
														styles.verticalSpace,
														commonStyles.textCenter
													]}
												>
													{i18n.t('onboarding.telegram_up_to_date')}
												</Text>
											)}
										<View style={[styles.space, styles.horizontalSpace]}>
											<TextInput
												label={i18n.t('onboarding.name_warning')}
												value={this.state.name}
												placeholder={'Name'}
												maxLength={NAME_MAX_LENGTH}
												onChange={text => this.handleNameChange(text)}
											/>
										</View>
										<View
											style={[
												styles.space,
												styles.horizontalSpace,
												{ flexDirection: 'row' }
											]}
										>
											<View style={{ flex: 1 }}>
												<TextInput
													value={this.state.city}
													placeholder={'City'}
													status={this.state.cityError ? 'error' : 'normal'}
													errorMessage={
														this.state.cityError
															? i18n.t('onboarding.city_error')
															: ''
													}
													containerStyle={{ flexGrow: 1 }}
													maxLength={CITY_MAX_LENGTH}
													onChange={text => this.handleCityChange(text)}
												/>
											</View>
											{this.state.cityLoading && (
												<Spinner
													color={LUMINOS_ACCENT}
													style={styles.spinner}
												/>
											)}
										</View>
										<Text
											style={[styles.text, styles.textHeader, styles.space]}
										>
											{i18n.t('onboarding.secret_profile').toUpperCase()}
										</Text>
										<Text style={[styles.text, styles.lato, styles.indent]}>
											{i18n.t('onboarding.secret_profile_info')}
										</Text>
									</View>
									<NavigationBottomBar
										leftDisabled={
											this.props.navigation.getParam('goBackArrowDisabled') ===
											true
										}
										rightDisabled={
											this.state.cityLoading ||
											this.props.isLoading ||
											!this.validate()
										}
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={this.handleSave}
										rightArrowColor={color}
									/>
								</Content>
							</Container>
						)}
					</UserColorAwareComponent>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	formContainer: {
		margin: 16
	},
	avatarContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 32
	},
	avatar: {
		width: 120,
		height: 120,
		borderWidth: 4,
		borderRadius: 60,
		borderColor: '#e2e0e0'
	},
	completeText: {
		fontSize: 15
	},
	text: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'white',
		fontSize: 12
	},
	textHeader: {
		letterSpacing: 2,
		lineHeight: 16
	},
	indent: {
		marginLeft: 12
	},
	space: {
		marginBottom: 12
	},
	verticalSpace: {
		marginTop: 20,
		marginBottom: 20
	},
	horizontalSpace: {
		marginLeft: 8,
		marginRight: 8
	},
	lato: {
		...createFontStyle()
	},
	spinner: {
		paddingLeft: 8
	}
})

BaseinfoPage.defaultProps = {
	isTelegramUser: false
}

BaseinfoPage.propTypes = {
	navigation: PropTypes.object,
	saveData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isTelegramUser: PropTypes.bool.isRequired,
	firstName: PropTypes.string,
	city: PropTypes.string,
	color: PropTypes.number.isRequired
}

const mapStateToProps = state => {
	return {
		baseInfoError: createErrorMessageSelector(['UPLOAD_INFO'])(state),
		isLoading: createLoadingSelector(['UPLOAD_INFO'])(state),
		isTelegramUser: state.auth.isTelegramUser,
		firstName: state.profile.firstName,
		city: state.profile.city,
		color: state.profile.color.id
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveData: data => dispatch(uploadInfo(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BaseinfoPage)
