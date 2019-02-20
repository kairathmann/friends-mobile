import { Text, View } from 'native-base'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import i18n from '../../../locales/i18n'

export default function RoundMissed() {
	return (
		<View style={styles.missedContainer}>
			<Text style={styles.emoji}>😳</Text>
			<Text style={styles.textBig}>{i18n.t('home.missed_big')}</Text>
			<Text style={styles.textSmall}>{i18n.t('home.missed_small')}</Text>
		</View>
	)
}

const styles = EStyleSheet.create({
	missedContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 32
	},
	emoji: {
		fontSize: 51
	},
	textBig: {
		marginTop: 16,
		fontSize: 35,
		letterSpacing: 0.25,
		textAlign: 'center',
		color: 'white'
	},
	textSmall: {
		marginTop: 42,
		lineHeight: 24,
		fontSize: 16,
		letterSpacing: 0.5,
		textAlign: 'center',
		color: 'white'
	}
})
