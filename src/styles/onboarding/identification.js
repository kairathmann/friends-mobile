import { createFontStyle } from '../fontStyleMaker'
import * as FONTS from '../fonts'

export default {
	descriptionContainer: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: 25,
		marginRight: 25,
		marginTop: 32,
		marginBottom: 32
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
	spaceBetweenSections: {
		marginBottom: 30
	},
	userAvatarContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	userAvatarTextHeader: {
		marginTop: 20,
		flex: 1,
		alignSelf: 'flex-start'
	}
}
