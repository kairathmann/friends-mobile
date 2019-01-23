import EStyleSheet from 'react-native-extended-stylesheet'
import * as COLORS from './colors'
import * as FONTS from './fonts'
import * as FONTS_STYLES from './fontStyles'
import { createFontStyle } from './fontStyleMaker'

const styles = EStyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR
	},
	scrollableContent: {
		flexGrow: 1
	},
	underline: {
		textDecorationLine: 'underline'
	},
	errorText: {
		color: 'red',
		textAlign: 'center'
	}
})

export { createFontStyle, COLORS, FONTS, FONTS_STYLES, styles }
