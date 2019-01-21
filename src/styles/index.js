import EStyleSheet from 'react-native-extended-stylesheet'
import * as COLORS from './colors'

const styles = EStyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: 'white'
	},
	underline: {
		textDecorationLine: 'underline'
	},
	errorText: {
		color: 'red',
		textAlign: 'center'
	}
})

export { COLORS, styles }
