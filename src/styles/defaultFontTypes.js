import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from './fontStyleMaker'
import * as FONTS from './fonts'
import * as FONTS_STYLES from './fontStyles'

const defaultFontTypes = EStyleSheet.create({
	H4: {
		...createFontStyle(),
		textAlign: 'left',
		color: 'white',
		fontSize: 36,
		letterSpacing: 0.25,
		lineHeight: 44
	},
	H6: {
		...createFontStyle(),
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
		lineHeight: 24,
		letterSpacing: 0.25
	},
	Body1: {
		...createFontStyle(),
		color: 'white',
		fontSize: 16,
		lineHeight: 24,
		textAlign: 'left',
		letterSpacing: 0.5
	},
	Body2: {
		...createFontStyle(),
		textAlign: 'left',
		color: '$greyColor',
		fontSize: 14,
		lineHeight: 22,
		letterSpacing: 0.25
	},
	Subtitle1: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: '$greyColor',
		fontSize: 18,
		letterSpacing: 0.25
	},
	Overline: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'white',
		fontSize: 12,
		lineHeight: 16,
		textAlign: 'left',
		letterSpacing: 2
	}
})

export { defaultFontTypes }
