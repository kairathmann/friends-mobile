import _ from 'lodash'
import { Text } from 'native-base'
import { TouchableWithoutFeedback, View } from 'react-native'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

import {
	MIN_RATING_FEEDBACK_VALUE,
	MAX_RATING_FEEDBACK_VALUE
} from '../../enums'
import I18n from '../../../locales/i18n'
import { createFontStyle } from '../../styles'
import { SEMI_BOLD } from '../../styles/fontStyles'
import { LATO, TITILLIUM } from '../../styles/fonts'
import Question from './Question'

export default class RatingQuestion extends React.PureComponent {
	changeSelectedAnswer = newValue => {
		this.props.onAnswerChange(newValue)
	}

	renderSingleRating = (value, onPress, selected) => (
		<TouchableWithoutFeedback
			key={`single-rating-value-${value}`}
			onPress={onPress}
		>
			<View
				style={[
					styles.ratingComponent,
					value === MIN_RATING_FEEDBACK_VALUE
						? styles.firstRatingComponent
						: '',
					value === MAX_RATING_FEEDBACK_VALUE ? styles.lastRatingComponent : '',
					selected ? styles.ratingComponentSelected : ''
				]}
			>
				<Text style={[styles.text, selected ? styles.textSelected : '']}>
					{value}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	)

	renderRatingSelection = () => {
		const { selectedAnswer } = this.props
		return (
			<View style={styles.ratingsContainer}>
				{_.range(
					MIN_RATING_FEEDBACK_VALUE,
					MAX_RATING_FEEDBACK_VALUE + 1,
					1
				).map(value =>
					this.renderSingleRating(
						value,
						() => this.changeSelectedAnswer(value),
						selectedAnswer === value
					)
				)}
			</View>
		)
	}

	renderTextHintsForRating = () => (
		<View style={styles.ratingHintsContainer}>
			<View style={styles.hintTextLeft}>
				<Text style={styles.hintText}>
					{I18n.t('feedback_components.rating_answer_low_hint')}
				</Text>
			</View>
			<View style={styles.hintTextRight}>
				<Text style={styles.hintText}>
					{I18n.t('feedback_components.rating_answer_high_hint')}
				</Text>
			</View>
		</View>
	)

	render() {
		const { questionText } = this.props
		return (
			<View style={styles.container}>
				<Question questionText={questionText} />
				<View style={styles.containerInner}>
					{this.renderRatingSelection()}
					{this.renderTextHintsForRating()}
				</View>
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
	ratingsContainer: {
		justifyContent: 'center',
		paddingTop: 32,
		flexDirection: 'row'
	},
	ratingComponent: {
		width: 62,
		height: 48,
		borderWidth: 1,
		borderColor: '$greyColor',
		justifyContent: 'center',
		alignItems: 'center'
	},
	ratingComponentSelected: {
		backgroundColor: '$greyColor'
	},
	firstRatingComponent: {
		borderBottomLeftRadius: 40,
		borderTopLeftRadius: 40
	},
	lastRatingComponent: {
		borderBottomRightRadius: 40,
		borderTopRightRadius: 40
	},
	text: {
		...createFontStyle(TITILLIUM, SEMI_BOLD),
		fontSize: 17,
		textAlign: 'center',
		letterSpacing: 1.25,
		color: '$greyColor'
	},
	textSelected: {
		color: 'black'
	},
	ratingHintsContainer: {
		marginTop: 8,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	hintText: {
		...createFontStyle(LATO),
		fontSize: 12,
		letterSpacing: 0.4,
		color: 'white'
	},
	hintTextLeft: {
		alignSelf: 'flex-start'
	},
	hintTextRight: {
		alignSelf: 'flex-end'
	}
})

RatingQuestion.propTypes = {
	questionText: PropTypes.string.isRequired,
	selectedAnswer: PropTypes.number,
	onAnswerChange: PropTypes.func.isRequired
}
