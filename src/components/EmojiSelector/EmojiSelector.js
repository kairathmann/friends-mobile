import _ from 'lodash'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import EmojiCircle from '../EmojiCircle'
import EmojiPickerModal from '../EmojiPickerModal'
import { styles as commonStyles } from '../../styles'

export default class EmojiSelectorCustom extends React.Component {
	state = {
		// if upon mounting there is already selected emoji
		// and emoji is not part of default set then we need to render it as already custom selected emoji
		customSelectedEmoji:
			this.props.selectedEmoji !== '' &&
			this.props.preselectedEmojis.indexOf(this.props.selectedEmoji) === -1
				? this.props.selectedEmoji
				: '',
		showEmojiSelector: false
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return (
			nextProps.selectedEmoji !== this.props.selectedEmoji ||
			nextState.customSelectedEmoji !== this.state.customSelectedEmoji ||
			nextState.showEmojiSelector !== this.state.showEmojiSelector
		)
	}

	showEmojiKeyboard = () => {
		this.setState({ showEmojiSelector: true })
	}

	hideEmojiKeyboard = () => {
		this.setState({ showEmojiSelector: false })
	}

	onCustomEmojiClick = customEmoji => {
		const emojiCharacter = customEmoji.char
		this.setState({ showEmojiSelector: false })
		this.onEmojiClick(emojiCharacter)
		if (emojiCharacter !== this.state.customSelectedEmoji) {
			this.setState({ customSelectedEmoji: emojiCharacter })
		}
	}

	onEmojiClick = clickedEmoji => {
		if (clickedEmoji !== this.props.selectedEmoji) {
			this.props.onSelectionChange(clickedEmoji)
		}
	}

	renderRegularEmoji = (singleEmoji, selected) => (
		<View key={`emoji-picker-${singleEmoji}`} style={styles.singleEmoji}>
			<EmojiCircle
				emoji={singleEmoji}
				selected={selected}
				onPress={() => this.onEmojiClick(singleEmoji)}
			/>
		</View>
	)

	renderCustomEmojiPicker = () => {
		const { customSelectedEmoji } = this.state
		const { selectedEmoji } = this.props
		return (
			<TouchableOpacity
				key={`emoji-picket-custom-emoji`}
				style={[
					commonStyles.emojiCircleSmall,
					styles.singleEmoji,
					customSelectedEmoji === selectedEmoji
						? commonStyles.emojiSelected
						: ''
				]}
				onPress={this.showEmojiKeyboard}
			>
				<View style={commonStyles.emojiContainer}>
					{customSelectedEmoji === '' ? (
						<Icon style={styles.icon} type={'MaterialIcons'} name={'add'} />
					) : (
						<Text style={commonStyles.emojiSmall}>{customSelectedEmoji}</Text>
					)}
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const { preselectedEmojis, emojisPerRow, selectedEmoji } = this.props
		const { customSelectedEmoji, showEmojiSelector } = this.state
		const preselectedEmoijsAndCustomEmoji = [
			...preselectedEmojis,
			customSelectedEmoji
		]
		const splittedEmojisToDrawByRow = _.chunk(
			preselectedEmoijsAndCustomEmoji,
			emojisPerRow
		)
		return (
			<View style={styles.container}>
				<EmojiPickerModal
					isVisible={showEmojiSelector}
					onEmojiSelected={this.onCustomEmojiClick}
					onClose={this.hideEmojiKeyboard}
				/>
				{splittedEmojisToDrawByRow.map((singleRow, rowIndex) => {
					return (
						<View
							key={`emoji-selector-row-${rowIndex}`}
							style={[styles.rowContainer, styles.rowSpace]}
						>
							{singleRow.map((singleEmoji, childIndex) => {
								const isItLastItemInLastRow =
									splittedEmojisToDrawByRow.length === rowIndex + 1 &&
									singleRow.length === childIndex + 1
								if (isItLastItemInLastRow) {
									return this.renderCustomEmojiPicker()
								} else {
									return this.renderRegularEmoji(
										singleEmoji,
										selectedEmoji === singleEmoji
									)
								}
							})}
						</View>
					)
				})}
			</View>
		)
	}
}

EmojiSelectorCustom.defaultProps = {
	emojisPerRow: 4
}

EmojiSelectorCustom.propTypes = {
	preselectedEmojis: PropTypes.arrayOf(PropTypes.string).isRequired,
	selectedEmoji: PropTypes.string.isRequired,
	emojisPerRow: PropTypes.number.isRequired,
	onSelectionChange: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	container: {
		flex: 1,
		alignSelf: 'center'
	},
	rowContainer: {
		flexDirection: 'row',
		flex: 1
	},
	rowSpace: {
		marginBottom: 20
	},
	singleEmoji: {
		marginLeft: 8,
		marginRight: 8
	},
	icon: {
		color: '$greyColor'
	}
})
