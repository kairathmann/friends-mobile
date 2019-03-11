import React from 'react'
import { Animated, ScrollView, TouchableOpacity, View } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import EStyleSheet from 'react-native-extended-stylesheet'
import Overlay from '../Overlay'
import { ALERT_STATUS } from './enums'
import { createFontStyle, FONTS, FONTS_STYLES } from '../../styles'
import I18n from '../../../locales/i18n'

class Alert extends React.Component {
	state = {
		status: ALERT_STATUS.CLOSED
	}

	opacity = new Animated.Value(0)

	componentDidUpdate(prevProps) {
		const { visible } = this.props
		if (prevProps.visible !== visible) {
			if (visible) {
				this.showAlert()
			} else {
				this.dismissAlert()
			}
		}
	}

	changeAlertStatus = (status, callback) => {
		const { animationDurationMs, useAnmiation } = this.props
		const desiredOpacityValue = status === ALERT_STATUS.CLOSED ? 0 : 1
		const temporaryAlertStatus =
			status === ALERT_STATUS.CLOSED
				? ALERT_STATUS.CLOSING
				: ALERT_STATUS.OPENING
		if (useAnmiation) {
			this.setState({ status: temporaryAlertStatus })
			Animated.timing(this.opacity, {
				toValue: desiredOpacityValue,
				duration: animationDurationMs,
				useNativeDriver: true
			}).start()
			setTimeout(() => {
				this.setState({ status }, () => {
					if (callback) {
						callback()
					}
				})
			}, animationDurationMs)
		} else {
			this.opacity = desiredOpacityValue
			this.setState({ status }, () => {
				if (callback) {
					callback()
				}
			})
		}
	}

	dismissAlert = () => {
		const { onDismiss } = this.props
		const { status } = this.state
		if (status === ALERT_STATUS.OPENED || status === ALERT_STATUS.OPENING) {
			this.changeAlertStatus(ALERT_STATUS.CLOSED, onDismiss)
		}
	}

	showAlert = () => {
		const { status } = this.state
		if (status === ALERT_STATUS.CLOSED || status === ALERT_STATUS.CLOSING) {
			this.changeAlertStatus(ALERT_STATUS.OPENED)
		}
	}

	onOverlayClick = () => {
		const { closeOnOverlayClick } = this.props
		if (closeOnOverlayClick) {
			this.dismissAlert()
		}
	}

	render() {
		const { status } = this.state
		const {
			opacity,
			animationDurationMs,
			overlayBackgroundColor,
			useAnmiation,
			title,
			message,
			actionButtonCallback,
			actionButtonText,
			actionButtonStyle
		} = this.props
		const showOverlay =
			status === ALERT_STATUS.OPENING || status === ALERT_STATUS.OPENED
		const enableOverlayClicks = status === ALERT_STATUS.OPENED
		return (
			<View
				style={[
					styles.overlayContainer,
					status === ALERT_STATUS.CLOSED ? styles.hidden : ''
				]}
			>
				<Overlay
					visible={showOverlay}
					opacity={opacity}
					animationDurationMs={animationDurationMs}
					onPress={this.onOverlayClick}
					backgroundColor={overlayBackgroundColor}
					useAnmiation={useAnmiation}
					clickEventsEnabled={enableOverlayClicks}
				/>
				<Animated.View
					style={[
						styles.dialog,
						{
							opacity: this.opacity
						}
					]}
				>
					<View style={styles.titleTextContainer}>
						<Text style={styles.titleText}>{title}</Text>
					</View>
					<ScrollView contentContainerStyle={styles.messageTextContainer}>
						<Text style={styles.messageText}>{message}</Text>
					</ScrollView>
					<View style={styles.buttonsContainer}>
						<TouchableOpacity onPress={this.dismissAlert} style={styles.button}>
							<Text style={styles.buttonText}>
								{I18n.t('commons.cancel').toUpperCase()}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={actionButtonCallback}
							style={styles.button}
						>
							<Text style={[styles.buttonText, actionButtonStyle]}>
								{actionButtonText.toUpperCase()}
							</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		)
	}
}

Alert.defaultProps = {
	useAnmiation: true,
	animationDurationMs: 200,
	closeOnOverlayClick: true,
	opacity: 0.5,
	overlayBackgroundColor: 'black',
	actionButtonStyle: {}
}

Alert.propTypes = {
	visible: PropTypes.bool.isRequired,
	onDismiss: PropTypes.func,
	useAnmiation: PropTypes.bool,
	animationDurationMs: PropTypes.number,
	closeOnOverlayClick: PropTypes.bool,
	opacity: PropTypes.number,
	overlayBackgroundColor: PropTypes.string,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	actionButtonCallback: PropTypes.func.isRequired,
	actionButtonText: PropTypes.string.isRequired,
	actionButtonStyle: PropTypes.object
}

const styles = EStyleSheet.create({
	overlayContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000
	},
	dialog: {
		width: 280,
		maxHeight: 300,
		backgroundColor: '$darkColor',
		borderRadius: 4
	},
	hidden: {
		top: -10000,
		left: 0,
		height: 0,
		width: 0
	},
	titleTextContainer: {
		marginTop: 23,
		marginLeft: 24,
		marginRight: 24,
		marginBottom: 9
	},
	titleText: {
		...createFontStyle(FONTS.LATO),
		color: 'white',
		fontSize: 21,
		letterSpacing: 0.25
	},
	messageTextContainer: {
		flexGrow: 1,
		marginLeft: 24,
		marginRight: 24
	},
	messageText: {
		...createFontStyle(FONTS.LATO),
		color: '$strongGreyColor',
		fontSize: 17,
		letterSpacing: 0.5
	},
	buttonsContainer: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	button: {
		marginRight: 8,
		padding: 8
	},
	buttonText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'white',
		fontSize: 15,
		textAlign: 'center',
		letterSpacing: 1.25
	}
})

export default Alert
