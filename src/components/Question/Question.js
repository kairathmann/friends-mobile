import PropTypes from 'prop-types'
import React from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import Answer from '../Answer/Answer'

export default class QuestionItem extends React.Component {
	shouldComponentUpdate = nextProps => {
		return (
			nextProps.selectedAnswer !== this.props.selectedAnswer ||
			nextProps.answered !== this.props.answered
		)
	}

	changeAnswer = answer => {
		this.props.onChangeAnswer(answer)
	}

	render() {
		const {
			text,
			answers,
			selectedAnswer,
			answered,
			fullScreenMode
		} = this.props

		const answersToShow = answered
			? answers.filter(an => an.id === selectedAnswer)
			: answers

		return (
			<View>
				<Text
					style={[
						styles.text,
						fullScreenMode
							? styles.fullScreenSizeModeText
							: styles.regularModeTex
					]}
				>
					{text}
				</Text>
				{answersToShow.map(ans => (
					<Answer
						key={ans.id}
						isSelected={ans.id === selectedAnswer}
						text={ans.text}
						onSelect={() => this.changeAnswer(ans)}
					/>
				))}
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	text: {
		...createFontStyle(),
		color: 'white',
		marginBottom: 16
	},
	regularModeText: {
		fontSize: 20
	},
	fullScreenSizeModeText: {
		fontSize: 36
	}
})

QuestionItem.propTypes = {
	text: PropTypes.string.isRequired,
	answers: PropTypes.array.isRequired,
	selectedAnswer: PropTypes.number,
	onChangeAnswer: PropTypes.func.isRequired,
	answered: PropTypes.bool.isRequired,
	fullScreenMode: PropTypes.bool
}

QuestionItem.defaultProps = {
	answered: false,
	fullScreenMode: false
}
