import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content, Text, View } from 'native-base'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import ColorSelector from '../../../components/ColorSelector'
import EmojiSelector from '../../../components/EmojiSelector'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import {
	styles as commonStyles,
	CommonOnboardingStyles,
	IdentificationPageStyles,
	defaultFontTypes
} from '../../../styles'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import LoggedInUserAvatar from '../../../components/LoggedInUserAvatar'
import * as COLORS from '../../../styles/colors'
import {
	updateUserColorSelection,
	updateUserEmojiSelection
} from './scenario-actions'
import { PAGES_NAMES } from '../../../navigation/pages'
import { DEFAULT_EMOJIS } from '../../../enums'

class IdentificationPage extends React.Component {
	PAGE_NAME = PAGES_NAMES.IDENTIFICATION_PAGE
	state = {
		validColor: true,
		validEmoji: true,
		validationEnabled: false
	}

	handleColorChange = newColor => {
		const colorInstance = this.props.availableColors.find(
			color => color.hexValue === newColor
		)
		if (colorInstance) {
			this.props.updateUserColorSelection(colorInstance)
		}
	}

	handleEmojiChange = newEmoji => {
		this.props.updateUserEmojiSelection(newEmoji)
	}

	validateForm = () => {
		this.setState({
			validColor: this.validateColor(this.props.selectedColor),
			validEmoji: this.validateEmoji(this.props.selectedEmoji)
		})
	}

	validateEmoji = selectedEmoji => {
		return selectedEmoji !== ''
	}

	validateColor = selectedColor => {
		return (
			selectedColor.id &&
			selectedColor.hexValue &&
			this.props.availableColors.find(color => color.id === selectedColor.id)
		)
	}

	handleSave = () => {
		this.setState({ validationEnabled: true }, () => {
			const { selectedColor, selectedEmoji } = this.props
			const validColor = this.validateColor(selectedColor)
			const validEmoji = this.validateEmoji(selectedEmoji)
			if (validColor && validEmoji) {
				this.props.navigation.navigate(PAGES_NAMES.BASEINFO_PAGE)
			} else {
				this.setState({ validColor, validEmoji })
			}
		})
	}

	renderColorPickers = () => (
		<View style={IdentificationPageStyles.spaceBetweenSections}>
			<Text
				style={[
					defaultFontTypes.Overline,
					CommonOnboardingStyles.space,
					CommonOnboardingStyles.paddingLeft
				]}
			>
				{I18n.t(
					'onboarding.identification_page_choose_color_section_header'
				).toUpperCase()}
			</Text>
			<ColorSelector
				colors={this.props.availableColors.map(
					singleColor => singleColor.hexValue
				)}
				selectedColor={this.props.selectedColor.hexValue}
				onSelectionChange={this.handleColorChange}
			/>
		</View>
	)

	renderEmojiPickers = () => (
		<View style={IdentificationPageStyles.spaceBetweenSections}>
			<Text
				style={[
					defaultFontTypes.Overline,
					CommonOnboardingStyles.space,
					CommonOnboardingStyles.paddingLeft
				]}
			>
				{I18n.t(
					'onboarding.identification_page_choose_emoji_section_header'
				).toUpperCase()}
			</Text>
			<EmojiSelector
				preselectedEmojis={DEFAULT_EMOJIS}
				selectedEmoji={this.props.selectedEmoji}
				onSelectionChange={this.handleEmojiChange}
			/>
		</View>
	)

	renderUserAvatarPreview = () => (
		<View
			style={[
				IdentificationPageStyles.userAvatarContainer,
				IdentificationPageStyles.spaceBetweenSections
			]}
		>
			<LoggedInUserAvatar />
		</View>
	)

	renderContent = () => (
		<View style={CommonOnboardingStyles.formContainer}>
			{this.renderUserAvatarPreview()}
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
							<OnboardingHeader
								pageNumber={this.props.onboardingStepsConfig[this.PAGE_NAME]}
								leftText={I18n.t('onboarding.sign_up')}
								totalPage={this.props.onboardingMaxSteps}
							/>
							<View style={CommonOnboardingStyles.descriptionContainerNoMargin}>
								<Text
									style={[
										defaultFontTypes.H4,
										CommonOnboardingStyles.pageHeading
									]}
								>
									{I18n.t('onboarding.identification_page_title')}
								</Text>
								<Text
									style={[
										defaultFontTypes.Body2,
										CommonOnboardingStyles.pageBody
									]}
								>
									{I18n.t('onboarding.identification_page_description')}
								</Text>
							</View>
							{this.renderContent()}
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										leftDisabled
										rightDisabled={
											this.state.validationEnabled &&
											(!this.state.validColor || !this.state.validEmoji)
										}
										onRightClick={() => this.handleSave()}
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

IdentificationPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	updateUserColorSelection: PropTypes.func.isRequired,
	updateUserEmojiSelection: PropTypes.func.isRequired,
	selectedEmoji: PropTypes.string.isRequired,
	selectedColor: PropTypes.shape({
		id: PropTypes.number.isRequired,
		hexValue: PropTypes.string.isRequired
	}).isRequired,
	availableColors: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			hexValue: PropTypes.string.isRequired
		})
	).isRequired,
	onboardingMaxSteps: PropTypes.number.isRequired,
	onboardingStepsConfig: PropTypes.object.isRequired
}

const mapStateToProps = state => {
	return {
		selectedEmoji: state.profile.emoji,
		selectedColor: state.profile.color,
		availableColors: state.colors.colors,
		onboardingMaxSteps: state.onboarding.onboardingMaxSteps,
		onboardingStepsConfig: state.onboarding.onboardingStepsConfig
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserColorSelection: color =>
			dispatch(updateUserColorSelection(color)),
		updateUserEmojiSelection: emoji => dispatch(updateUserEmojiSelection(emoji))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IdentificationPage)
