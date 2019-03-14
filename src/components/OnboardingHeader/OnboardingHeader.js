import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { defaultFontTypes } from '../../styles'

export function OnboardingHeader({
	leftText,
	rightText,
	pageNumber,
	totalPage,
	styles
}) {
	return (
		<View style={[innerStyles.onboardingHeader, styles.onboardingHeader]}>
			<View style={innerStyles.leftSpace} />
			<Text
				style={[defaultFontTypes.H6, innerStyles.leftText, styles.leftText]}
			>
				{leftText}
			</Text>
			<Text
				style={[
					defaultFontTypes.Subtitle1,
					innerStyles.rightText,
					styles.rightText
				]}
			>
				{rightText.length === 0 ? `${pageNumber}/${totalPage} ` : rightText}
			</Text>
		</View>
	)
}

const innerStyles = EStyleSheet.create({
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

OnboardingHeader.defaultProps = {
	leftText: '',
	rightText: '',
	styles: {}
}

OnboardingHeader.propTypes = {
	styles: PropTypes.shape({
		onboardingHeader: PropTypes.shape({}),
		leftText: PropTypes.shape({}),
		rightText: PropTypes.shape({})
	}),
	leftText: PropTypes.string,
	rightText: PropTypes.string,
	pageNumber: PropTypes.number,
	totalPage: PropTypes.number
}
