import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../fontStyleMaker'
import * as FONTS from '../fonts'
import * as FONTS_STYLES from '../fontStyles'
import BaseInfoStyles from './baseinfo'
import IdentificationPageStyles from './identification'

const common = {
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
	}
}

const commonStylesCreared = EStyleSheet.create(common)
const BaseInfoStylesCreated = EStyleSheet.create(BaseInfoStyles)
const IdentificationPageStylesCreated = EStyleSheet.create(
	IdentificationPageStyles
)

export {
	commonStylesCreared as CommonOnboardingStyles,
	BaseInfoStylesCreated as BaseInfoStyles,
	IdentificationPageStylesCreated as IdentificationPageStyles
}
