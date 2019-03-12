import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { View, Text } from 'react-native'
import { createFontStyle } from '../../styles'

class SystemCard extends React.PureComponent {
	render() {
		return (
			<View style={styles.systemCardContainer}>
				<View>
					{this.props.title.length > 0 && (
						<View style={styles.systemCardTitleView}>
							<Text style={[styles.systemCardTextBase, styles.systemCardTitle]}>
								{this.props.title}
							</Text>
						</View>
					)}
					<Text style={[styles.systemCardTextBase, styles.systemCardText]}>
						{this.props.text}
					</Text>
				</View>
			</View>
		)
	}
}

SystemCard.defaultProps = {
	title: ''
}

SystemCard.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string.isRequired
}

const styles = EStyleSheet.create({
	systemCardContainer: {
		backgroundColor: '$darkColor',
		borderRadius: 4,
		marginTop: 12,
		marginBottom: 12,
		marginRight: 16,
		marginLeft: 16,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 32,
		paddingRight: 32,
		justifyContent: 'center',
		alignItems: 'center'
	},
	systemCardTitleView: {
		paddingBottom: 16
	},
	systemCardTextBase: {
		color: 'white',
		letterSpacing: 0.25,
		textAlign: 'center',
		...createFontStyle()
	},
	systemCardTitle: {
		fontSize: 14
	},
	systemCardText: {
		fontSize: 20
	}
})

export default SystemCard
