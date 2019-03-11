import { Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

import { createFontStyle } from '../../styles'
import { LATO } from '../../styles/fonts'

export default class Question extends React.PureComponent {
	render() {
		return <Text style={styles.text}>{this.props.questionText}</Text>
	}
}

const styles = EStyleSheet.create({
	text: {
		...createFontStyle(LATO),
		color: 'white',
		fontSize: 16,
		letterSpacing: 0.5
	}
})

Question.propTypes = {
	questionText: PropTypes.string.isRequired
}
