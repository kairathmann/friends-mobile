import PropTypes from 'prop-types'
import React from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import moment from 'moment'
import { createFontStyle, FONTS } from '../../styles'

export default class TextMessage extends React.PureComponent {
	renderTimeDivider = () => (
		<View style={styles.dividerContainer}>
			<Text style={styles.divider}>
				{moment(this.props.timestamp).format('ddd, HH:mm')}
			</Text>
		</View>
	)

	renderMessage = () => {
		const {
			isLoggedUserMessage,
			nextMessageBelongsToTheSameUser,
			text
		} = this.props
		const finalMessageContainerStyle = [styles.messageContainerBase]
		finalMessageContainerStyle.push(
			nextMessageBelongsToTheSameUser
				? styles.messageOwnNext
				: styles.messageNotOwnNext
		)
		return (
			<View
				style={
					isLoggedUserMessage
						? styles.messageContainerCurrentUser
						: styles.messageContainerDifferentUser
				}
			>
				<View style={finalMessageContainerStyle}>
					<Text style={styles.text}>{text}</Text>
				</View>
			</View>
		)
	}

	render() {
		const { isTheSameDayAsPrevious } = this.props
		return (
			<View>
				{!isTheSameDayAsPrevious && this.renderTimeDivider()}
				{this.renderMessage()}
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	dividerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginTop: 16,
		marginBottom: 16
	},
	divider: {
		...createFontStyle(FONTS.LATO),
		lineHeight: 16,
		fontSize: 13,
		letterSpacing: 0.1,
		color: '$greyColor'
	},
	messageContainerBase: {
		paddingLeft: 17,
		paddingRight: 16,
		paddingTop: 8,
		paddingBottom: 8,
		minHeight: 40,
		flexDirection: 'row',
		maxWidth: '80%',
		borderRadius: 20,
		backgroundColor: '$darkColor'
	},
	messageContainerCurrentUser: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: 15
	},
	messageContainerDifferentUser: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginLeft: 17
	},
	messageOwnNext: {
		marginBottom: 4
	},
	messageNotOwnNext: {
		marginBottom: 16
	},
	text: {
		...createFontStyle(FONTS.LATO),
		fontSize: 16,
		lineHeight: 24,
		color: 'white',
		letterSpacing: 0.5
	}
})

TextMessage.propTypes = {
	text: PropTypes.string.isRequired,
	isTheSameDayAsPrevious: PropTypes.bool.isRequired,
	isLoggedUserMessage: PropTypes.bool.isRequired,
	timestamp: PropTypes.string.isRequired,
	nextMessageBelongsToTheSameUser: PropTypes.bool.isRequired
}
