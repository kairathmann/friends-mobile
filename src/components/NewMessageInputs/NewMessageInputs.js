import PropTypes from 'prop-types'
import React from 'react'
import { Keyboard, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import EmojiPickerModal from '../EmojiPickerModal'
import { CHAT_TYPES } from '../../enums'
import TextInput from './TextInput'
import SendButton from './SendButton'

export default class NewMessageInputs extends React.Component {
	state = {
		showEmojiPicker: false
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return (
			nextProps.sendButtonDisabled !== this.props.sendButtonDisabled ||
			nextProps.textMessageValue !== this.props.textMessageValue ||
			nextState.showEmojiPicker !== this.state.showEmojiPicker
		)
	}

	showEmojiKeyboard = () => {
		this.setState({ showEmojiPicker: true })
	}

	hideEmojiKeyboard = () => {
		this.setState({ showEmojiPicker: false })
	}

	onCustomEmojiClick = customEmoji => {
		const { textMessageValue, onTextMessageChange } = this.props
		const emojiCharacter = customEmoji.char
		if (onTextMessageChange) {
			onTextMessageChange(textMessageValue + emojiCharacter)
		}
		this.setState({
			showEmojiPicker: false
		})
	}

	handleTextChange = newText => {
		const { onTextMessageChange } = this.props
		if (onTextMessageChange) {
			onTextMessageChange(newText)
		}
	}

	handleOnTextMessageSendClick = () => {
		Keyboard.dismiss()
		this.props.onTextMessageSend(this.props.textMessageValue)
	}

	render() {
		const { sendButtonDisabled } = this.props
		const { showEmojiPicker } = this.state
		return (
			<View style={styles.container}>
				<TextInput
					textMessageValue={this.props.textMessageValue}
					onTextMessageChange={this.handleTextChange}
					onShowEmojiClick={this.showEmojiKeyboard}
				/>
				<SendButton
					disabled={sendButtonDisabled}
					onPress={this.handleOnTextMessageSendClick}
				/>
				<EmojiPickerModal
					isVisible={showEmojiPicker}
					onEmojiSelected={this.onCustomEmojiClick}
					onClose={this.hideEmojiKeyboard}
				/>
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	container: {
		minHeight: 56,
		maxHeight: 100,
		padding: 12,
		flexDirection: 'row',
		backgroundColor: '$primaryBackgroundColor',
		alignItems: 'center',
		justifyContent: 'center'
	}
})

NewMessageInputs.defaultProps = {
	chatType: CHAT_TYPES.EVERYTHING,
	textMessageValue: '',
	sendButtonDisabled: false
}

NewMessageInputs.propTypes = {
	onTextMessageSend: PropTypes.func.isRequired,
	chatType: PropTypes.oneOf([
		CHAT_TYPES.EVERYTHING,
		CHAT_TYPES.LONG_TEXT,
		CHAT_TYPES.TEXT,
		CHAT_TYPES.VIDEO
	]).isRequired,
	textMessageValue: PropTypes.string,
	onTextMessageChange: PropTypes.func,
	sendButtonDisabled: PropTypes.bool
}
