import { Icon, Input } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SINGLE_TEXT_MESSAGE_CHAR_LIMIT } from '../../enums'
import { createFontStyle, FONTS } from '../../styles'

export default class TextInput extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.textMessageValue !== this.props.textMessageValue
	}

	handleTextChange = event => {
		const newText = event.nativeEvent.text
		const { onTextMessageChange } = this.props
		if (onTextMessageChange) {
			onTextMessageChange(newText)
		}
	}

	render() {
		return (
			<View style={styles.messageInputContainer}>
				<Input
					style={styles.textInput}
					multiline
					numberOfLines={2}
					maxLength={SINGLE_TEXT_MESSAGE_CHAR_LIMIT}
					onChange={this.handleTextChange}
					value={this.props.textMessageValue}
				/>
				<View style={styles.emojiButtonContainer}>
					<Icon
						type="FontAwesome"
						name="smile-o"
						style={styles.emojiButton}
						onPress={this.props.onShowEmojiClick}
					/>
				</View>
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	messageInputContainer: {
		flexDirection: 'row',
		flex: 1,
		backgroundColor: '$darkColor',
		borderRadius: 17,
		minHeight: 34,
		maxHeight: 80
	},
	textInput: {
		flex: 1,
		...createFontStyle(FONTS.LATO),
		paddingLeft: 11,
		paddingTop: 8,
		paddingBottom: 8,
		paddingRight: 20,
		color: 'white',
		letterSpacing: 0.25,
		fontSize: 14,
		minHeight: 20,
		maxHeight: 50
	},
	emojiButtonContainer: {
		justifyContent: 'flex-end'
	},
	emojiButton: {
		color: 'white',
		fontSize: 20,
		marginRight: 20,
		paddingBottom: 7
	}
})

TextInput.defaultProps = {
	textMessageValue: '',
	onShowEmojiClick: () => {}
}

TextInput.propTypes = {
	textMessageValue: PropTypes.string,
	onTextMessageChange: PropTypes.func,
	onShowEmojiClick: PropTypes.func
}
