import { Icon, Input } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { Keyboard, Image, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import CameraMainShape from '../../assets/images/camera_main_shape.png'
import CameraPlusShape from '../../assets/images/camera_plus_shape.png'
import UserColorAwareComponent from '../UserColorAwareComponent'
import { SINGLE_TEXT_MESSAGE_CHAR_LIMIT, CHAT_TYPES } from '../../enums'
import { createFontStyle, FONTS } from '../../styles'

export default class NewMessageInputs extends React.Component {
	state = {
		//TODO: Supply this from outside as prop
		textMessageValue: '',
		showEmojiPicker: false
	}

	handleTextChange = event => {
		const newText = event.nativeEvent.text
		if (newText !== this.state.textMessageValue) {
			this.setState({ textMessageValue: newText })
		}
	}

	handleOnTextMessageSendClick = () => {
		Keyboard.dismiss()
		this.props.onTextMessageSend(this.state.textMessageValue)
		//TODO: Don't do that - this shoudl stay as long as message is not deliver succesfully to the server
		this.setState({ textMessageValue: '' })
	}

	renderArrows = () => (
		<View style={styles.arrowsContainer}>
			<Icon
				type="MaterialIcons"
				name="keyboard-arrow-up"
				style={styles.singleArrow}
			/>
			<Icon
				type="MaterialIcons"
				name="keyboard-arrow-down"
				style={styles.singleArrow}
			/>
		</View>
	)

	renderTextInput = () => (
		<View style={styles.textInputContainer}>
			<Input
				style={styles.textInput}
				multiline
				numberOfLines={1}
				maxLength={SINGLE_TEXT_MESSAGE_CHAR_LIMIT}
				onChange={this.handleTextChange}
				value={this.state.textMessageValue}
			/>
		</View>
	)

	// when we able to provide viddeos
	renderCameraButton = () => (
		<UserColorAwareComponent>
			{color => (
				<View style={styles.cameraButtonContainer}>
					<Image source={CameraMainShape} style={styles.cameraMainShape} />
					<Image
						source={CameraPlusShape}
						tintColor={color}
						style={styles.cameraPlusShape}
					/>
				</View>
			)}
		</UserColorAwareComponent>
	)

	renderSendButton = () => (
		<UserColorAwareComponent>
			{color => (
				<View style={styles.cameraButtonContainer}>
					<Icon
						name={'send'}
						onPress={this.handleOnTextMessageSendClick}
						style={[
							styles.sendTextMessageIcon,
							this.state.textMessageValue === ''
								? styles.sendTextMessageIconFaded
								: styles.sendTextMessageIconVisible,
							{ color }
						]}
					/>
				</View>
			)}
		</UserColorAwareComponent>
	)

	render() {
		return (
			<View style={styles.container}>
				{this.renderArrows()}
				{this.renderTextInput()}
				{this.renderSendButton()}
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	container: {
		minHeight: 56,
		padding: 12,
		flexDirection: 'row',
		backgroundColor: '$primaryBackgroundColor',
		alignItems: 'center',
		justifyContent: 'center'
	},
	arrowsContainer: {
		justifyContent: 'center'
	},
	singleArrow: {
		color: 'white',
		fontSize: 20
	},
	textInputContainer: {
		flex: 1,
		marginLeft: 22,
		borderRadius: 17,
		height: 34,
		backgroundColor: '$darkColor'
	},
	cameraButtonContainer: {
		marginLeft: 20
	},
	cameraMainShape: {
		width: 32,
		height: 32
	},
	cameraPlusShape: {
		position: 'absolute',
		top: 1,
		right: 2,
		width: 9,
		height: 9
	},
	sendTextMessageIcon: {
		fontSize: 32
	},
	sendTextMessageIconVisible: {
		opacity: 1.0
	},
	sendTextMessageIconFaded: {
		opacity: 0.25
	},
	textInput: {
		flex: 1,
		...createFontStyle(FONTS.LATO),
		paddingLeft: 11,
		paddingTop: 8,
		paddingBottom: 8,
		paddingRight: 11,
		color: 'white',
		letterSpacing: 0.25,
		fontSize: 14,
		lineHeight: 18
	}
})

NewMessageInputs.propTypes = {
	onTextMessageSend: PropTypes.func.isRequired,
	chatType: PropTypes.oneOf([
		CHAT_TYPES.EVERYTHING,
		CHAT_TYPES.LONG_TEXT,
		CHAT_TYPES.TEXT,
		CHAT_TYPES.VIDEO
	])
}
