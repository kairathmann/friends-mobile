import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { defaultFontTypes } from '../../styles'

export function OnboardingHeader({ leftText, pageNumber, totalPage }) {
	return (
		<View style={styles.onboardingHeader}>
			<View style={styles.leftSpace} />
			<Text style={defaultFontTypes.H6}>{leftText}</Text>
			<Text
				style={[defaultFontTypes.Subtitle1, styles.rightText]}
			>{`${pageNumber}/${totalPage} `}</Text>
		</View>
	)
}

const styles = EStyleSheet.create({
	onboardingHeader: {
		padding: 16,
		height: 60,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	leftSpace: {
		width: 44
	},
	rightText: {
		width: 44,
		textAlign: 'right'
	}
})

OnboardingHeader.propTypes = {
	leftText: PropTypes.string.isRequired,
	pageNumber: PropTypes.number.isRequired,
	totalPage: PropTypes.number.isRequired
}
