import EStyleSheet from 'react-native-extended-stylesheet'
import * as COLORS from './colors'
import * as FONTS from './fonts'
import * as FONTS_STYLES from './fontStyles'
import { createFontStyle } from './fontStyleMaker'
import { defaultFontTypes } from './defaultFontTypes'
import {
	CommonOnboardingStyles,
	BaseInfoStyles,
	IdentificationPageStyles
} from './onboarding'

const styles = EStyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: '$primaryBackgroundColor'
	},
	safeAreaView: {
		flex: 1,
		backgroundColor: '$primaryBackgroundColor'
	},
	scrollableContent: {
		flexGrow: 1
	},
	underline: {
		textDecorationLine: 'underline'
	},
	textCenter: {
		textAlign: 'center'
	},
	errorText: {
		color: '$errorColor',
		textAlign: 'center'
	},
	emojiCircleSmall: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: '$darkColor'
	},
	emojiContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emojiSmall: {
		fontSize: 26
	},
	emojiSelected: {
		backgroundColor: '#424755'
	}
})

export {
	createFontStyle,
	defaultFontTypes,
	COLORS,
	FONTS,
	FONTS_STYLES,
	styles,
	BaseInfoStyles,
	CommonOnboardingStyles,
	IdentificationPageStyles
}
