import { Icon } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import UserColorAwareComponent from '../UserColorAwareComponent'

export default class SendButton extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.disabled !== this.props.disabled
	}

	handlePress = () => {
		const { onPress, disabled } = this.props
		if (disabled) {
			return
		}
		onPress()
	}

	render() {
		const { disabled } = this.props
		return (
			<UserColorAwareComponent>
				{color => (
					<View style={styles.sendButtonContainer}>
						<Icon
							type="MaterialIcons"
							name={'send'}
							onPress={this.handlePress}
							style={[
								styles.sendTextMessageIcon,
								disabled
									? styles.sendTextMessageIconFaded
									: styles.sendTextMessageIconVisible,
								{ color }
							]}
						/>
					</View>
				)}
			</UserColorAwareComponent>
		)
	}
}

const styles = EStyleSheet.create({
	sendButtonContainer: {
		marginLeft: 20
	},
	sendTextMessageIcon: {
		fontSize: 32
	},
	sendTextMessageIconVisible: {
		opacity: 1.0
	},
	sendTextMessageIconFaded: {
		opacity: 0.25
	}
})

SendButton.defaultProps = {
	disabled: false
}

SendButton.propTypes = {
	disabled: PropTypes.bool,
	onPress: PropTypes.func.isRequired
}
