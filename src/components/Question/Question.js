import PropTypes from 'prop-types'
import React from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import Answer from '../Answer/Answer'

export default class QuestionItem extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.selectedAnswer !== this.props.selectedAnswer
	}

	changeAnswer = answer => {
		this.props.onChangeAnswer(answer)
	}

	render() {
		const { text, answers, selectedAnswer } = this.props
		return (
			<View>
				<Text style={styles.text}>{text}</Text>
				{answers.map(ans => (
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
		fontSize: 20,
		marginBottom: 16
	}
})

QuestionItem.propTypes = {
	text: PropTypes.string.isRequired,
	answers: PropTypes.array.isRequired,
	selectedAnswer: PropTypes.number,
	onChangeAnswer: PropTypes.func.isRequired
}
