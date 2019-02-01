import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import * as FONTS from '../../styles/fonts'
import Button from '../Button/Button'

export default function Answer({ text, isSelected, onSelect }) {
	return (
		<Button
			text={text}
			uppercase={false}
			buttonStyle={[
				styles.answer,
				isSelected ? styles.selected : styles.unselected
			]}
			onPress={onSelect}
			textStyle={{
				...createFontStyle(FONTS.LATO),
				color: isSelected ? 'black' : 'white',
				fontSize: 16
			}}
		/>
	)
}

const styles = EStyleSheet.create({
	answer: {
		height: '100%',
		borderWidth: 1,
		borderRadius: 16,
		borderColor: 'white',
		flex: 1,
		justifyContent: 'center',
		marginBottom: 8,
		paddingBottom: 14,
		paddingTop: 14
	},
	selected: {
		backgroundColor: 'white'
	},
	unselected: {
		backgroundColor: 'transparent'
	}
})

Answer.propTypes = {
	text: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	onSelect: PropTypes.func.isRequired
}
