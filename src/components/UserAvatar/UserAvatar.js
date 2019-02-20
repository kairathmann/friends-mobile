import { View } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { styles as commonStyles } from '../../styles'

export default class UserAvatar extends React.Component {
	shouldComponentUpdate = nextProps => {
		return (
			nextProps.emoji !== this.props.emoji ||
			nextProps.color !== this.props.color
		)
	}

	render() {
		const { emoji, color, circleSize, emojiSize, borderWidth } = this.props
		const containerStyle = {
			width: circleSize,
			height: circleSize,
			borderRadius: Math.floor(circleSize / 2),
			backgroundColor: color
		}
		const borderStyle = {
			borderColor: '#E2E0E0',
			borderWidth: borderWidth
		}
		const emojiStyle = {
			fontSize: emojiSize
		}
		return (
			<View style={[containerStyle, borderStyle]}>
				<View style={commonStyles.emojiContainer}>
					<Text style={emojiStyle}>{emoji}</Text>
				</View>
			</View>
		)
	}
}

UserAvatar.defaultProps = {
	circleSize: 120,
	emojiSize: 32,
	borderWidth: 4
}

UserAvatar.propTypes = {
	emoji: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	circleSize: PropTypes.number.isRequired,
	emojiSize: PropTypes.number.isRequired,
	borderWidth: PropTypes.number
}
