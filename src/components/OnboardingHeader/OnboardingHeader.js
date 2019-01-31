import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import * as FONTS from '../../styles/fonts'
import * as FONTS_STYLES from '../../styles/fontStyles'

export function OnboardingHeader({ leftText, pageNumber, totalPage }) {
	return (
		<View style={styles.onboardingHeader}>
			<Text style={styles.leftText}>{leftText.toUpperCase()}</Text>
			<Text style={styles.rightText}>{`${pageNumber}/${totalPage} `}</Text>
		</View>
	)
}

const styles = EStyleSheet.create({
	onboardingHeader: {
		padding: 16,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	leftText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'white',
		fontSize: 18,
		letterSpacing: 1.25
	},
	rightText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: '$greyColor',
		fontSize: 18,
		letterSpacing: 1.25
	}
})

OnboardingHeader.propTypes = {
	leftText: PropTypes.string.isRequired,
	pageNumber: PropTypes.number.isRequired,
	totalPage: PropTypes.number.isRequired
}
