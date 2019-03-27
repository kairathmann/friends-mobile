import EStyleSheet from 'react-native-extended-stylesheet'
import { COLORS } from '../src/styles'

EStyleSheet.build({
	$rem: 16,
	$voidColor: COLORS.LUMINOS_VOID,
	$starlightColor: COLORS.LUMINOS_STARLIGHT,
	$primaryBackgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR,
	$errorColor: COLORS.LUMINOS_ERROR,
	$greyColor: COLORS.LUMINOS_GREY,
	$strongGreyColor: COLORS.LUMINOS_STRONG_GREY,
	$darkColor: COLORS.LUMINOS_DARK
})
