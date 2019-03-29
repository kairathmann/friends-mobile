import { Container, Content, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import TextInput from '../../../components/TextInput/TextInput'
import { CityAutocomplete } from '../../../components/Autocomplete'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import LoggedInUserAvatar from '../../../components/LoggedInUserAvatar'
import { NAME_MAX_LENGTH } from '../../../enums'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import {
	styles as commonStyles,
	BaseInfoStyles,
	defaultFontTypes,
	CommonOnboardingStyles
} from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { uploadInfo } from './scenario-actions'
import { PAGES_NAMES } from '../../../navigation/pages'

class BaseinfoPage extends React.Component {
	PAGE_NAME = PAGES_NAMES.BASEINFO_PAGE
	state = {
		name: this.props.firstName,
		location: this.props.location
	}

	onLocationSelect = location => {
		this.setState({ location })
	}

	handleNameChange = text => {
		this.setState({
			name: text
		})
	}

	validate = () => {
		const { location, name } = this.state

		return location.fullName.length !== 0 && name.length !== 0
	}

	handleSave = () => {
		this.props.saveData({
			name: this.state.name,
			location: this.state.location,
			color: this.props.color,
			emoji: this.props.emoji
		})
	}

	renderUserNameInput = () => (
		<View
			style={[
				CommonOnboardingStyles.space,
				CommonOnboardingStyles.horizontalSpace
			]}
		>
			<TextInput
				label={I18n.t('onboarding.name_warning')}
				value={this.state.name}
				placeholder={'Name'}
				maxLength={NAME_MAX_LENGTH}
				onChange={text => this.handleNameChange(text)}
			/>
		</View>
	)

	renderUserCityInput = () => (
		<CityAutocomplete
			locationFullName={this.props.location.fullName}
			onLocationSelect={this.onLocationSelect}
		/>
	)

	render() {
		return (
			<React.Fragment>
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							<OnboardingHeader
								pageNumber={this.props.onboardingStepsConfig[this.PAGE_NAME]}
								leftText={I18n.t('onboarding.sign_up')}
								totalPage={this.props.onboardingMaxSteps}
							/>
							<View style={BaseInfoStyles.avatarContainer}>
								<LoggedInUserAvatar />
								<Text
									style={[
										defaultFontTypes.Body2,
										CommonOnboardingStyles.verticalSpace
									]}
								>
									{I18n.t('onboarding.complete_profile')}
								</Text>
							</View>
							<View style={CommonOnboardingStyles.formContainer}>
								<Text
									style={[
										defaultFontTypes.Overline,
										CommonOnboardingStyles.space,
										CommonOnboardingStyles.paddingLeft
									]}
								>
									{I18n.t('onboarding.public_profile').toUpperCase()}
								</Text>
								{this.props.isTelegramUser &&
									(this.props.location.fullName !== '' ||
										this.props.firstName !== '') && (
										<Text
											style={[
												CommonOnboardingStyles.text,
												BaseInfoStyles.lato,
												CommonOnboardingStyles.completeText,
												CommonOnboardingStyles.verticalSpace,
												commonStyles.textCenter
											]}
										>
											{I18n.t('onboarding.telegram_up_to_date')}
										</Text>
									)}
								{this.renderUserNameInput()}
								{this.renderUserCityInput()}
								<Text
									style={[
										defaultFontTypes.Overline,
										CommonOnboardingStyles.space,
										CommonOnboardingStyles.paddingLeft
									]}
								>
									{I18n.t('onboarding.secret_profile').toUpperCase()}
								</Text>
								<Text
									style={[
										CommonOnboardingStyles.text,
										BaseInfoStyles.lato,
										CommonOnboardingStyles.indent
									]}
								>
									{I18n.t('onboarding.secret_profile_info')}
								</Text>
							</View>
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										leftDisabled={
											this.props.navigation.getParam('goBackArrowDisabled') ===
											true
										}
										rightDisabled={this.props.isLoading || !this.validate()}
										onLeftClick={() => this.props.navigation.goBack()}
										onRightClick={this.handleSave}
										rightArrowColor={color}
									/>
								)}
							</UserColorAwareComponent>
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

BaseinfoPage.defaultProps = {
	isTelegramUser: false,
	location: {
		fullName: '',
		name: '',
		mapboxId: '',
		latitude: 0,
		longitude: 0
	}
}

BaseinfoPage.propTypes = {
	navigation: PropTypes.object,
	saveData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isTelegramUser: PropTypes.bool.isRequired,
	firstName: PropTypes.string,
	location: PropTypes.shape({
		fullName: PropTypes.string,
		name: PropTypes.string,
		mapboxId: PropTypes.string,
		latitude: PropTypes.number,
		longitude: PropTypes.number
	}).isRequired,
	color: PropTypes.shape({
		id: PropTypes.number.isRequired,
		hexValue: PropTypes.string.isRequired
	}).isRequired,
	emoji: PropTypes.string.isRequired,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
		baseInfoError: createErrorMessageSelector(['UPLOAD_INFO'])(state),
		isLoading: createLoadingSelector(['UPLOAD_INFO'])(state),
		isTelegramUser: state.auth.isTelegramUser,
		firstName: state.profile.firstName,
		location: state.profile.latestLocation,
		color: state.profile.color,
		emoji: state.profile.emoji,
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
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
