import moment from 'moment'
import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import i18n from '../../../locales/i18n'
import { createFontStyle } from '../../styles'
import { LATO, TITILLIUM } from '../../styles/fonts'
import { BOLD } from '../../styles/fontStyles'

export default function PastRound(props) {
	return (
		<View style={styles.pastRound}>
			<View>
				<Text style={styles.roundName}>{`Round - ${props.round.id}`}</Text>
				<Text style={styles.date}>{`${moment(props.round.from).format(
					'DD.MM.YYYY'
				)} - ${
					props.round.to ? moment(props.round.to).format('DD.MM.YYYY') : '...'
				}`}</Text>
			</View>
			<Text style={styles.status}>
				{i18n.t(`commons.${props.round.status}`).toUpperCase()}
			</Text>
		</View>
	)
}

PastRound.defaultProps = {
	status: 'concluded'
}

PastRound.propTypes = {
	round: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		from: PropTypes.string.isRequired,
		to: PropTypes.string.isRequired,
		status: PropTypes.string
	})
}

const styles = EStyleSheet.create({
	pastRound: {
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#242937',
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 0,
		marginTop: 8,
		borderRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	roundName: {
		...createFontStyle(LATO, BOLD),
		fontSize: 28,
		color: 'white',
		marginBottom: 4
	},
	date: {
		...createFontStyle(),
		lineHeight: 18,
		fontSize: 14,
		letterSpacing: 0.25,
		color: 'rgba(255, 255, 255, 0.8)'
	},
	status: {
		...createFontStyle(TITILLIUM),
		lineHeight: 16,
		fontSize: 15,
		letterSpacing: 1.25,
		color: 'rgba(255, 255, 255, 0.8)'
	}
})
