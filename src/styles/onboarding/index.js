import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../fontStyleMaker'
import * as FONTS from '../fonts'
import * as FONTS_STYLES from '../fontStyles'
import BaseInfoStyles from './baseinfo'
import IdentificationPageStyles from './identification'

const common = {
	descriptionContainerNoMargin: {
		flex: 1,
		justifyContent: 'flex-start',
		marginLeft: 20,
		marginRight: 20
	},
	descriptionContainerMarginTop: {
		flex: 1,
		justifyContent: 'flex-start',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 60
	},
	descriptionContainerMarginBottom: {
		flex: 1,
		justifyContent: 'flex-start',
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 32
	},
	pageHeading: {
		marginLeft: 16,
		marginRight: 16,
		marginBottom: 30,
		paddingTop: 24
	},
	pageBody: {
		marginLeft: 16,
		marginRight: 16
	},
	formContainer: {
		margin: 16
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
	paddingLeft: {
		paddingLeft: 8
	}
}

const commonStylesCreated = EStyleSheet.create(common)
const BaseInfoStylesCreated = EStyleSheet.create(BaseInfoStyles)
const IdentificationPageStylesCreated = EStyleSheet.create(
	IdentificationPageStyles
)

export {
	commonStylesCreated as CommonOnboardingStyles,
	BaseInfoStylesCreated as BaseInfoStyles,
	IdentificationPageStylesCreated as IdentificationPageStyles
}
