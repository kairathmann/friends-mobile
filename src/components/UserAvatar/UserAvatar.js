import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
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
		const { emoji, color, circleSize, emojiSize } = this.props
		const containerStyle = {
			width: circleSize,
			height: circleSize,
			borderRadius: Math.floor(circleSize / 2),
			backgroundColor: color
		}
		const emojiStyle = {
			fontSize: emojiSize
		}
		return (
			<View style={[containerStyle, styles.border]}>
				<View style={commonStyles.emojiContainer}>
					<Text style={emojiStyle}>{emoji}</Text>
				</View>
			</View>
		)
	}
}

UserAvatar.defaultProps = {
	circleSize: 120,
	emojiSize: 32
}

UserAvatar.propTypes = {
	emoji: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	circleSize: PropTypes.number.isRequired,
	emojiSize: PropTypes.number.isRequired
}

const styles = EStyleSheet.create({
	border: {
		borderColor: '#E2E0E0',
		borderWidth: 4
	}
})
