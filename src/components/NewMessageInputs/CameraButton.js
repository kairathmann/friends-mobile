import PropTypes from 'prop-types'
import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import CameraMainShape from '../../assets/images/camera_main_shape.png'
import CameraPlusShape from '../../assets/images/camera_plus_shape.png'
import UserColorAwareComponent from '../UserColorAwareComponent'

export default class CameraButton extends React.Component {
	shouldComponentUpdate = () => {
		return false
	}

	render() {
		return (
			<UserColorAwareComponent>
				{color => (
					<TouchableOpacity
						style={styles.cameraButtonContainer}
						onPress={this.props.onPress}
					>
						<Image source={CameraMainShape} style={styles.cameraMainShape} />
						<Image
							source={CameraPlusShape}
							tintColor={color}
							style={styles.cameraPlusShape}
						/>
					</TouchableOpacity>
				)}
			</UserColorAwareComponent>
		)
	}
}

const styles = EStyleSheet.create({
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
	}
})

CameraButton.propTypes = {
	onPress: PropTypes.func.isRequired
}
