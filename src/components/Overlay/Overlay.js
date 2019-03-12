import React from 'react'
import PropTypes from 'prop-types'
import EStyleSheet from 'react-native-extended-stylesheet'
import { TouchableOpacity, Animated } from 'react-native'

class Overlay extends React.Component {
	componentDidUpdate(prevProps) {
		const { visible, animationDurationMs, useAnmiation } = this.props
		if (prevProps.visible !== visible) {
			const desiredOpacityValue = visible ? this.props.opacity : 0
			if (useAnmiation) {
				Animated.timing(this.opacity, {
					toValue: desiredOpacityValue,
					duration: animationDurationMs,
					useNativeDriver: true
				}).start()
			} else {
				this.opacity = desiredOpacityValue
			}
		}
	}

	opacity = new Animated.Value(0)
	render() {
		const { clickEventsEnabled, onPress, backgroundColor } = this.props
		return (
			<Animated.View
				pointerEvents={clickEventsEnabled ? 'auto' : 'none'}
				style={[
					styles.overlayContainer,
					{
						opacity: this.opacity,
						backgroundColor
					}
				]}
			>
				<TouchableOpacity style={styles.overlayContainer} onPress={onPress} />
			</Animated.View>
		)
	}
}

Overlay.defaultProps = {
	opacity: 0.5,
	animationDurationMs: 200,
	backgroundColor: 'black',
	useAnmiation: true
}

Overlay.propTypes = {
	visible: PropTypes.bool.isRequired,
	opacity: PropTypes.number,
	animationDurationMs: PropTypes.number,
	onPress: PropTypes.func.isRequired,
	backgroundColor: PropTypes.string,
	useAnmiation: PropTypes.bool,
	clickEventsEnabled: PropTypes.bool.isRequired
}

const styles = EStyleSheet.create({
	overlayContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	}
})

export default Overlay
