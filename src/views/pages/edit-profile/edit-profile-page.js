import PropTypes from 'prop-types'
import { Container, Content, Text, View } from 'native-base'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import EmojiSelector from '../../../components/EmojiSelector'
import ColorSelector from '../../../components/ColorSelector'
import TextInput from '../../../components/TextInput/TextInput'
import UserAvatar from '../../../components/UserAvatar'
import { DEFAULT_EMOJIS, NAME_MAX_LENGTH } from '../../../enums'
import {
	createErrorMessageSelector,
	createLoadingSelector
} from '../../../store/utils/selectors'
import {
	styles as commonStyles,
	BaseInfoStyles,
	CommonOnboardingStyles,
	IdentificationPageStyles
} from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { updateUserProfile } from './scenario-actions'
import { CityAutocomplete } from '../../../components/Autocomplete'

class EditProfilePage extends React.Component {
	state = {
		name: this.props.firstName,
		location: this.props.location,
		color: this.props.color,
		firstName: this.props.firstName,
		emoji: this.props.emoji,
		validationEnabled: false
	}

	handleNameChange = text => {
		this.setState({
			name: text
		})
	}

	onLocationSelect = location => {
		this.setState({ location })
	}

	handleColorChange = newColor => {
		const colorInstance = this.props.availableColors.find(
			color => color.hexValue === newColor
		)
		if (colorInstance) {
			this.setState({
				color: colorInstance
			})
		}
	}

	handleEmojiChange = newEmoji => {
		this.setState({
			emoji: newEmoji
		})
	}

	validateEmoji = selectedEmoji => {
		return selectedEmoji !== ''
	}

	validateLocation = location => {
		return location.fullName.length > 0
	}

	validateColor = selectedColor => {
		return (
			selectedColor.id &&
			selectedColor.hexValue &&
			this.props.availableColors.find(color => color.id === selectedColor.id)
		)
	}

	validate = () => {
		const { location, name, color, emoji } = this.state

		return (
			name.length !== 0 &&
			this.validateLocation(location) &&
			this.validateColor(color) &&
			this.validateEmoji(emoji)
		)
	}

	handleSave = () => {
		this.setState({ validationEnabled: true }, () => {
			const formValid = this.validate()
			if (formValid) {
				this.props.updateUserProfile({
					name: this.state.name,
					location: this.state.location,
					color: this.state.color,
					emoji: this.state.emoji
				})
			}
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

	renderColorPickers = () => (
		<View style={IdentificationPageStyles.spaceBetweenSections}>
			<Text
				style={[
					CommonOnboardingStyles.text,
					CommonOnboardingStyles.textHeader,
					CommonOnboardingStyles.space
				]}
			>
				{I18n.t('edit_profile_page.choose_color_section_header').toUpperCase()}
			</Text>
			<ColorSelector
				colors={this.props.availableColors.map(
					singleColor => singleColor.hexValue
				)}
				selectedColor={this.state.color.hexValue}
				onSelectionChange={this.handleColorChange}
			/>
		</View>
	)

	renderEmojiPickers = () => (
		<View style={IdentificationPageStyles.spaceBetweenSections}>
			<Text
				style={[
					CommonOnboardingStyles.text,
					CommonOnboardingStyles.textHeader,
					CommonOnboardingStyles.space
				]}
			>
				{I18n.t('edit_profile_page.choose_emoji_section_header').toUpperCase()}
			</Text>
			<EmojiSelector
				preselectedEmojis={DEFAULT_EMOJIS}
				selectedEmoji={this.state.emoji}
				onSelectionChange={this.handleEmojiChange}
			/>
		</View>
	)

	renderPickers = () => (
		<View style={CommonOnboardingStyles.formContainer}>
			{this.renderColorPickers()}
			{this.renderEmojiPickers()}
		</View>
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
							<View style={BaseInfoStyles.avatarContainer}>
								<UserAvatar
									emoji={this.state.emoji}
									color={`#${this.state.color.hexValue}`}
									emojiSize={46}
								/>
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
							{this.renderPickers()}
							<NavigationBottomBar
								rightDisabled={
									this.props.isLoading ||
									(!this.validate() && this.state.validationEnabled)
								}
								onLeftClick={() => this.props.navigation.goBack()}
								onRightClick={this.handleSave}
								rightArrowColor={`#${this.state.color.hexValue}`}
								customRightIcon="check"
							/>
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

EditProfilePage.propTypes = {
	navigation: PropTypes.object,
	isLoading: PropTypes.bool.isRequired,
	firstName: PropTypes.string,
	location: PropTypes.shape({
		fullName: PropTypes.string,
		name: PropTypes.string,
		mapboxId: PropTypes.string,
		latitude: PropTypes.number,
		longitude: PropTypes.number
	}),
	color: PropTypes.shape({
		id: PropTypes.number.isRequired,
		hexValue: PropTypes.string.isRequired
	}).isRequired,
	emoji: PropTypes.string.isRequired,
	availableColors: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			hexValue: PropTypes.string.isRequired
		})
	).isRequired,
	updateUserProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		baseInfoError: createErrorMessageSelector(['UPLOAD_INFO'])(state),
		isLoading: createLoadingSelector(['UPLOAD_INFO'])(state),
		firstName: state.profile.firstName,
		location: state.profile.latestLocation,
		color: state.profile.color,
		emoji: state.profile.emoji,
		availableColors: state.colors.colors
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserProfile: data => dispatch(updateUserProfile(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfilePage)
