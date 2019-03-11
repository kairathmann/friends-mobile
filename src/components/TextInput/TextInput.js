import { Input, Item, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'

export default class TextInput extends React.Component {
	render() {
		const {
			placeholder,
			prefix,
			value,
			errorMessage,
			label,
			keyboardType,
			containerStyle,
			centerInput,
			status,
			blurOnSubmit,
			returnKeyType,
			getRef,
			onSubmitEditing,
			maxLength,
			onChange
		} = this.props
		let mergedContainerStyle = [styles.container]
		if (containerStyle) {
			const customStylesWrapped = Array.isArray(containerStyle)
				? containerStyle
				: [containerStyle]
			mergedContainerStyle = [...mergedContainerStyle, ...customStylesWrapped]
		}
		if (status === 'error') {
			mergedContainerStyle.push(styles.errorContainer)
		}
		return (
			<View>
				<Item style={mergedContainerStyle} regular>
					{prefix.length > 0 && (
						<Text
							style={[
								styles.basePrefix,
								value.length > 0 ? styles.prefix : styles.emptyPrefix
							]}
						>
							{prefix}
						</Text>
					)}
					<Input
						value={value}
						onChangeText={event => onChange(event)}
						style={[styles.input, centerInput ? styles.centerInput : '']}
						placeholder={placeholder}
						keyboardType={keyboardType}
						blurOnSubmit={blurOnSubmit}
						returnKeyType={returnKeyType}
						ref={getRef}
						onSubmitEditing={onSubmitEditing}
						maxLength={maxLength}
					/>
				</Item>
				{errorMessage ? (
					<Text style={styles.errorText}>{errorMessage}</Text>
				) : null}
				{label ? <Text style={styles.labelText}>{label}</Text> : null}
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	container: {
		borderRadius: 8,
		borderColor: '$greyColor',
		padding: 16,
		paddingRight: 16,
		paddingTop: 8,
		paddingBottom: 8
	},
	input: {
		color: 'white',
		fontSize: 16,
		...createFontStyle()
	},
	centerInput: {
		textAlign: 'center',
		paddingRight: 0,
		paddingLeft: 0
	},
	basePrefix: {
		fontSize: 16,
		marginRight: -5,
		...createFontStyle()
	},
	emptyPrefix: {
		color: '#575757'
	},
	prefix: {
		color: 'white'
	},
	errorContainer: {
		borderColor: '$errorColor'
	},
	errorText: {
		...createFontStyle(),
		color: '$errorColor',
		marginTop: 4,
		marginBottom: 8,
		marginLeft: 16,
		fontSize: 12
	},
	labelText: {
		...createFontStyle(),
		color: '$strongGreyColor',
		marginTop: 4,
		marginBottom: 8,
		marginLeft: 16,
		fontSize: 12
	}
})

TextInput.defaultProps = {
	prefix: '',
	keyboardType: 'default',
	status: 'normal',
	blurOnSubmit: true,
	returnKeyType: 'done',
	centerInput: false,
	getRef: () => {},
	onSubmitEditing: () => {}
}

TextInput.propTypes = {
	prefix: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	errorMessage: PropTypes.string,
	label: PropTypes.string,
	keyboardPad: PropTypes.string,
	containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	centerInput: PropTypes.bool,
	keyboardType: PropTypes.string,
	status: PropTypes.oneOf(['normal', 'ok', 'error']).isRequired,
	blurOnSubmit: PropTypes.bool.isRequired,
	returnKeyType: PropTypes.string.isRequired,
	getRef: PropTypes.func,
	onSubmitEditing: PropTypes.func,
	maxLength: PropTypes.number
}
