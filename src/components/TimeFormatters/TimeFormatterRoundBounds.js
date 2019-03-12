import React from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import { LATO } from '../../styles/fonts'
import { getRoundBounds } from '../../common/time'

class TimeFormatterRoundBounds extends React.Component {
	render() {
		const [from, to] = getRoundBounds()
		const sameMonth = from.month() === to.month()
		const sameYear = from.year() === to.year()
		if (sameMonth) {
			return (
				<View>
					<Text style={styles.date}>
						{from.format('MMMM')} {from.format('Do')} - {to.format('Do')}
					</Text>
				</View>
			)
		} else if (!sameYear) {
			return (
				<View>
					<Text style={styles.date}>
						{from.format('MMMM YYYY Do')} - {to.format('MMMM YYYY Do')}
					</Text>
				</View>
			)
		} else {
			return (
				<View>
					<Text style={styles.date}>
						{from.format('MMMM')} {from.format('Do')} - {to.format('MMMM')}{' '}
						{to.format('Do')}
					</Text>
				</View>
			)
		}
	}
}

const styles = EStyleSheet.create({
	date: {
		...createFontStyle(LATO),
		fontSize: 16,
		textAlign: 'center',
		letterSpacing: 0.5,
		color: 'white',
		paddingTop: 30
	}
})

export default TimeFormatterRoundBounds
