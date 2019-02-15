import { Container, Content, Spinner, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import TextInput from '../../../components/TextInput/TextInput'
import CitySearchInput from '../../../components/CitySearchInput'
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
	CommonOnboardingStyles
} from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { uploadInfo } from './scenario-actions'

class BaseinfoPage extends React.Component {
	state = {
		name: this.props.firstName,
		city: this.props.city,
		cityError: false,
		cityLoading: false
	}

	onCitySearchStart = () => {
		this.setState({ cityLoading: true })
	}

	onCitySearchEndError = () => {
		this.setState({ cityLoading: false, cityError: true })
	}

	onCitySearchEndSuccess = city => {
		this.setState({ cityLoading: false, cityError: false, city })
	}

	handleNameChange = text => {
		this.setState({
			name: text
		})
	}

	validate = () => {
		const { city, cityError, name, cityLoading } = this.state

		return !cityLoading && city.length !== 0 && name.length !== 0 && !cityError
	}

	handleSave = () => {
		this.props.saveData({
			name: this.state.name,
			city: this.state.city,
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
		<CitySearchInput
			city={this.state.city}
			onSearchStart={this.onCitySearchStart}
			onSearchEndError={this.onCitySearchEndError}
			onSearchEndSuccess={this.onCitySearchEndSuccess}
			validateOnMount={this.props.isTelegramUser}
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
							{this.props.isLoading && <Spinner color={'white'} />}
							<OnboardingHeader
								pageNumber={2}
								leftText={I18n.t('onboarding.sign_up')}
								totalPage={4}
							/>
							<View style={BaseInfoStyles.avatarContainer}>
								<LoggedInUserAvatar />
								<Text
									style={[
										CommonOnboardingStyles.text,
										BaseInfoStyles.lato,
										CommonOnboardingStyles.completeText,
										CommonOnboardingStyles.verticalSpace
									]}
								>
									{I18n.t('onboarding.complete_profile')}
								</Text>
							</View>
							<View style={CommonOnboardingStyles.formContainer}>
								<Text
									style={[
										CommonOnboardingStyles.text,
										CommonOnboardingStyles.textHeader,
										CommonOnboardingStyles.space
									]}
								>
									{I18n.t('onboarding.public_profile').toUpperCase()}
								</Text>
								{this.props.isTelegramUser &&
									(this.props.city !== '' || this.props.firstName !== '') && (
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
										CommonOnboardingStyles.text,
										CommonOnboardingStyles.textHeader,
										CommonOnboardingStyles.space
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
										rightDisabled={
											this.state.cityLoading ||
											this.props.isLoading ||
											!this.validate()
										}
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
	isTelegramUser: false
}

BaseinfoPage.propTypes = {
	navigation: PropTypes.object,
	saveData: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isTelegramUser: PropTypes.bool.isRequired,
	firstName: PropTypes.string,
	city: PropTypes.string,
	color: PropTypes.shape({
		id: PropTypes.number.isRequired,
		hexValue: PropTypes.string.isRequired
	}).isRequired,
	emoji: PropTypes.string.isRequired
}

const mapStateToProps = state => {
	return {
		baseInfoError: createErrorMessageSelector(['UPLOAD_INFO'])(state),
		isLoading: createLoadingSelector(['UPLOAD_INFO'])(state),
		isTelegramUser: state.auth.isTelegramUser,
		firstName: state.profile.firstName,
		city: state.profile.city,
		color: state.profile.color,
		emoji: state.profile.emoji
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
