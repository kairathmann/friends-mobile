import { createFontStyle } from '../fontStyleMaker'

export default {
	avatarContainer: {
		marginTop: 24,
		marginLeft: 24,
		marginRight: 24
	},
	completeText: {
		fontSize: 15
	},
	lato: {
		...createFontStyle()
	}
}
