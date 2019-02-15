import { TouchableOpacity, View } from 'react-native'
import { Icon } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class ColorCircle extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.selected !== this.props.selected
	}

	render() {
		const { color, selected, onPress } = this.props
		return (
			<TouchableOpacity
				style={[
					styles.container,
					{ backgroundColor: `#${color}` },
					selected ? styles.selected : ''
				]}
				onPress={onPress}
			>
				{selected === true && (
					<View style={styles.iconContainer}>
						<Icon style={styles.icon} type={'MaterialIcons'} name={'check'} />
					</View>
				)}
			</TouchableOpacity>
		)
	}
}

ColorCircle.propTypes = {
	color: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	container: {
		width: 64,
		height: 64,
		borderRadius: 32
	},
	selected: {
		borderColor: '#E2E0E0',
		borderWidth: 4
	},
	iconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		color: 'white'
	}
})
