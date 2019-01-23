import PropTypes from 'prop-types'
import React from 'react'
import { Button as NativeBaseButton, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import { FONTS, FONTS_STYLES, createFontStyle } from '../../styles'

const Button = ({
	text,
	onPress,
	disabled,
	buttonStyle,
	textStyle,
	nativeProps
}) => (
	<NativeBaseButton
		disabled={disabled}
		style={[styles.button, buttonStyle || '', disabled ? styles.disabled : '']}
		onPress={onPress}
		{...nativeProps}
	>
		<Text
			style={textStyle ? [styles.buttonText, textStyle] : styles.buttonText}
		>
			{text.toUpperCase()}
		</Text>
	</NativeBaseButton>
)

Button.propTypes = {
	text: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	buttonStyle: PropTypes.object,
	textStyle: PropTypes.object,
	nativeProps: PropTypes.object
}

const styles = EStyleSheet.create({
	button: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 48,
		justifyContent: 'center',
		width: '100%'
	},
	disabled: {
		opacity: 0.6
	},
	buttonText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		fontSize: 15,
		letterSpacing: 1.25,
		lineHeight: 20,
		color: 'white',
		justifyContent: 'center'
	}
})

export default Button
