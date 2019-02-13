import { TouchableOpacity, View } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { styles as commonStyles } from '../../styles'

export default class EmojiCircle extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.selected !== this.props.selected
	}

	render() {
		const { emoji, selected, onPress } = this.props
		return (
			<TouchableOpacity
				style={[
					commonStyles.emojiCircleSmall,
					selected ? commonStyles.emojiSelected : ''
				]}
				onPress={onPress}
			>
				<View style={commonStyles.emojiContainer}>
					<Text style={commonStyles.emojiSmall}>{emoji}</Text>
				</View>
			</TouchableOpacity>
		)
	}
}

EmojiCircle.propTypes = {
	emoji: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired
}
