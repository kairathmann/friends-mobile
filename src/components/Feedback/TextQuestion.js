import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import I18n from '../../../locales/i18n'
import { SINGLE_FEEDBACK_TEXT_MESSAGE_CHAR_LIMIT } from '../../enums'
import TextInput from '../TextInput/TextInput'
import Question from './Question'

export default class TextQuestion extends React.PureComponent {
	changeEnteredAnswer = newText => {
		this.props.onAnswerChange(newText)
	}

	renderTextBox = () => {
		const { answerText } = this.props
		return (
			<View style={styles.textBoxContainer}>
				<TextInput
					blurOnSubmit={false}
					multiline={true}
					numberOfLines={5}
					placeholder={I18n.t('feedback_components.text_fields_placeholder')}
					inputStyle={styles.textBoxCustomInputStyle}
					value={answerText}
					onChange={this.changeEnteredAnswer}
					containerStyle={styles.textBoxInnerContainerCustomStyle}
					maxLength={SINGLE_FEEDBACK_TEXT_MESSAGE_CHAR_LIMIT}
				/>
			</View>
		)
	}

	render() {
		const { questionText } = this.props
		return (
			<View style={styles.container}>
				<Question questionText={questionText} />
				<View style={styles.containerInner}>{this.renderTextBox()}</View>
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	containerInner: {
		alignSelf: 'center',
		width: 310
	},
	textBoxContainer: {
		paddingTop: 32
	},
	textBoxCustomInputStyle: {
		minHeight: 100,
		textAlignVertical: 'top'
	},
	textBoxInnerContainerCustomStyle: {
		alignItems: 'flex-start',
		height: 128
	}
})

TextQuestion.propTypes = {
	questionText: PropTypes.string.isRequired,
	answerText: PropTypes.string,
	onAnswerChange: PropTypes.func.isRequired
}
