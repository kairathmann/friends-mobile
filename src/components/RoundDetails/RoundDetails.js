import moment from 'moment'
import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import i18n from '../../../locales/i18n'
import LoggedInUserAvatar from '../LoggedInUserAvatar'

export default function RoundDetails({ round, onResignClick }) {
	return (
		<View style={styles.contentContainer}>
			{round.subscribed && (
				<View style={styles.upcomingContainer}>
					<View style={styles.upcomingTop}>
						<Text style={[styles.subheader, { flex: 1, marginRight: 10 }]}>
							{i18n.t('home.upcoming_title')}
						</Text>
						<LoggedInUserAvatar
							circleSize={50}
							emojiSize={15}
							borderWidth={2}
						/>
					</View>
					<View style={styles.upcomingBottom}>
						<Text style={styles.upcomingDate}>
							{moment(round.from).fromNow(true)}
						</Text>
						<TouchableOpacity onPress={onResignClick}>
							<Text style={styles.declineText}>
								{i18n.t('home.upcoming_resign')}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
			<View style={styles.topContainer}>
				<View style={{ flex: 1 }}>
					<Text style={styles.title}>{`${i18n.t('home.downtime')} Round #${
						round.id
					} `}</Text>
				</View>
				<View style={styles.avatar} />
			</View>
			<Text style={styles.subheader}>{i18n.t('home.date')}</Text>
			<Text style={styles.date}>{`${moment(round.from).format('MMM Do')} - ${
				round.to ? moment(round.to).format('MMM Do') : '...'
			}`}</Text>
			<Text style={styles.description}>{round.description}</Text>
		</View>
	)
}

RoundDetails.propTypes = {
	round: PropTypes.object.isRequired,
	onResignClick: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	contentContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding: 16
	},
	topContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 30
	},
	subheader: {
		lineHeight: 24,
		fontSize: 16,
		letterSpacing: 0.5,
		color: 'white',
		textAlign: 'left'
	},
	avatar: {
		width: 53,
		height: 53,
		borderWidth: 3,
		borderRadius: 26,
		borderColor: '#e2e0e0',
		backgroundColor: '#58e2c2'
	},
	description: {
		lineHeight: 24,
		fontSize: 16,
		letterSpacing: 0.5,
		color: 'white',
		textAlign: 'left',
		marginBottom: 12
	},
	date: {
		fontSize: 36,
		letterSpacing: 0.25,
		color: 'white',
		marginBottom: 30,
		textAlign: 'left'
	},
	upcomingDate: {
		fontSize: 36,
		letterSpacing: 0.25,
		color: 'white',
		textAlign: 'left',
		flex: 1
	},
	title: {
		fontSize: 36,
		letterSpacing: 0.25,
		color: 'white'
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
	},
	upcomingContainer: {
		width: '100%',
		flex: 1,
		backgroundColor: '$darkColor',
		borderRadius: 4,
		padding: 16,
		marginBottom: 32
	},
	upcomingTop: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 18
	},
	upcomingBottom: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	declineText: {
		lineHeight: 16,
		fontSize: 12,
		letterSpacing: 0.4,
		textDecorationLine: 'underline',
		color: '$greyColor'
	}
})
