import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Container, Content, Text, View } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import ColorSelector from '../../../components/ColorSelector'
import { NavigationBottomBar } from '../../../components/NavigationBottomBar/NavigationBottomBar'
import { OnboardingHeader } from '../../../components/OnboardingHeader/OnboardingHeader'
import { createFontStyle, styles as commonStyles } from '../../../styles'
import UserColorAwareComponent from '../../../components/UserColorAwareComponent'
import * as COLORS from '../../../styles/colors'
import * as FONTS from '../../../styles/fonts'
import * as FONTS_STYLES from '../../../styles/fontStyles'
import { updateUserColorSelection } from './scenario-actions'
import { PAGES_NAMES } from '../../../navigation/pages'

class IdentificationPage extends React.Component {
	state = {
		validColor: true,
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

	validateForm = () => {
		this.setState({
			phoneNumberValid: this.validateColor(this.props.selectedColor)
		})
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
			const { selectedColor } = this.props
			const validColor = this.validateColor(selectedColor)
			if (validColor) {
				this.props.navigation.navigate(PAGES_NAMES.BASEINFO_PAGE)
			} else {
				this.setState({ validColor })
			}
		})
	}

	renderColorPickers = () => (
		<View>
			<Text style={[styles.text, styles.textHeader, styles.space]}>
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

	renderContent = () => (
		<View style={styles.formContainer}>{this.renderColorPickers()}</View>
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
								pageNumber={1}
								leftText={I18n.t('onboarding.sign_up')}
								totalPage={3}
							/>
							<View style={styles.descriptionContainer}>
								<Text style={styles.headerText}>
									{I18n.t('onboarding.identification_page_title')}
								</Text>
								<Text style={[styles.descriptionText]}>
									{I18n.t('onboarding.identification_page_description')}
								</Text>
							</View>
							{this.renderContent()}
							<UserColorAwareComponent>
								{color => (
									<NavigationBottomBar
										leftDisabled
										rightDisabled={
											this.state.validationEnabled && !this.state.validColor
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

const styles = EStyleSheet.create({
	descriptionContainer: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: 25,
		marginRight: 25
	},
	headerText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'center',
		color: 'white',
		fontSize: 40,
		letterSpacing: 1
	},
	descriptionText: {
		...createFontStyle(FONTS.LATO),
		textAlign: 'center',
		color: 'white',
		marginTop: 15,
		fontSize: 14,
		lineHeight: 18,
		letterSpacing: 1
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
	space: {
		marginBottom: 12
	},
	formContainer: {
		margin: 16
	}
})

IdentificationPage.propTypes = {
	navigation: PropTypes.object.isRequired,
	updateUserColorSelection: PropTypes.func.isRequired,
	selectedColor: PropTypes.shape({
		id: PropTypes.number.isRequired,
		hexValue: PropTypes.string.isRequired
	}).isRequired,
	availableColors: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			hexValue: PropTypes.string.isRequired
		})
	).isRequired
}

const mapStateToProps = state => {
	return {
		selectedColor: state.profile.color,
		availableColors: state.colors.colors
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserColorSelection: color => dispatch(updateUserColorSelection(color))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IdentificationPage)
