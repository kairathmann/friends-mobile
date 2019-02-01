import { Platform } from 'react-native'
import * as fonts from './fonts'

const FONTS_MAPPING = {
	[fonts.TITILLIUM]: {
		weights: {
			Bold: '700',
			SemiBold: '600',
			Normal: '400'
		}
	},
	[fonts.LATO]: {
		weights: {
			Normal: '400',
			Bold: '700'
		}
	}
}

const createFontStyle = (family = fonts.LATO, weight = 'Regular') => {
	const fontMappingForFont = FONTS_MAPPING[family]
	if (Platform.OS === 'android') {
		const mappingWeight = fontMappingForFont.weights[weight] ? weight : ''
		const fontFamilyName = family + (mappingWeight ? `-${mappingWeight}` : '')
		return { fontFamily: fontFamilyName }
	} else {
		return {
			fontFamily: family,
			fontStyle: 'normal',
			fontWeight: fontMappingForFont.weights[weight] || '400'
		}
	}
}

export { createFontStyle }
