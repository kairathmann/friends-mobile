import { Button as NativeBaseButton, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle, FONTS, FONTS_STYLES } from '../../styles'

const Button = ({
	text,
	onPress,
	disabled,
	buttonStyle,
	textStyle,
	uppercase,
	nativeProps
}) => {
	let extraButtonStyles = ''
	if (buttonStyle) {
		extraButtonStyles = Array.isArray(buttonStyle) ? buttonStyle : [buttonStyle]
	}

	let extraTextStyles = ''
	if (textStyle) {
		extraTextStyles = Array.isArray(textStyle) ? textStyle : [textStyle]
	}

	return (
		<NativeBaseButton
			disabled={disabled}
			style={[
				styles.button,
				...extraButtonStyles,
				disabled ? styles.disabled : ''
			]}
			onPress={onPress}
			{...nativeProps}
		>
			<Text
				uppercase={uppercase}
				style={[styles.buttonText, ...extraTextStyles]}
			>
				{text}
			</Text>
		</NativeBaseButton>
	)
}

Button.defaultProps = {
	uppercase: true
}

Button.propTypes = {
	text: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	nativeProps: PropTypes.object,
	uppercase: PropTypes.bool
}

const styles = EStyleSheet.create({
	button: {
		elevation: 0,
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
