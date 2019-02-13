import { SafeAreaView } from 'react-navigation'
import { Modal, View } from 'react-native'
import { Button, Icon } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import EmojiInput from 'react-native-emoji-input'

const BackButton = ({ onPress }) => (
	<View style={styles.buttonContainer}>
		<View style={styles.iconContainer}>
			<Button transparent onPress={onPress}>
				<Icon style={styles.buttonIcon} name="arrow-back" />
			</Button>
		</View>
	</View>
)

BackButton.propTypes = {
	onPress: PropTypes.func.isRequired
}

export const EmojiPickerModal = ({ isVisible, onEmojiSelected, onClose }) => (
	<Modal
		animationType="slide"
		transparent={false}
		visible={isVisible}
		onRequestClose={onClose}
		onDismiss={onClose}
		hardwareAccelerated={true}
		supportedOrientations={['portrait']}
	>
		<SafeAreaView style={styles.safeAreaView}>
			<BackButton onPress={onClose} />
			<EmojiInput
				onEmojiSelected={onEmojiSelected}
				enableFrequentlyUsedEmoji={false}
				includeOnlySubsets={['6.0', '6.1']}
				includeOnlySingleCharacterEmojis
			/>
		</SafeAreaView>
	</Modal>
)

EmojiPickerModal.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	onEmojiSelected: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	buttonContainer: {
		height: 48,
		paddingBottom: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center'
	},
	iconContainer: {
		flex: 1
	},
	buttonIcon: {
		color: 'black',
		fontSize: 32
	},
	safeAreaView: {
		flex: 1,
		backgroundColor: '#E3E1EC'
	}
})

export default EmojiPickerModal
