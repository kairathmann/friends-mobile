import { createFontStyle } from '../fontStyleMaker'

export default {
	avatarContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 32
	},
	completeText: {
		fontSize: 15
	},
	lato: {
		...createFontStyle()
	}
}
