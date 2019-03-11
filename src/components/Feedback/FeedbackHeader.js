import { View } from 'react-native'
import { Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

import UserColorAwareComponent from '../UserColorAwareComponent'
import { createFontStyle } from '../../styles'
import { LATO, TITILLIUM } from '../../styles/fonts'
import { SEMI_BOLD } from '../../styles/fontStyles'
import I18n from '../../../locales/i18n'

export default class FeedbackHeader extends React.PureComponent {
	render() {
		const { opened, onCancelClick, onSubmitClick } = this.props
		return (
			<View style={styles.mainContainer}>
				<View style={styles.leftSideTextContainer}>
					<Text
						style={[
							styles.leftSideTextBase,
							opened ? styles.leftSideTextOpened : styles.leftSideTextClosed
						]}
					>
						{opened
							? I18n.t('feedback_components.submit_feedback_lowercase')
							: I18n.t('feedback_components.question')}
					</Text>
				</View>
				<View style={styles.rightSideTextContainer}>
					<UserColorAwareComponent>
						{color => (
							<Text
								style={[
									styles.rightSideTextBase,
									opened
										? styles.rightSideTextOpened
										: { ...styles.rightSideTextClosed, color }
								]}
								onPress={opened ? onCancelClick : onSubmitClick}
							>
								{opened
									? I18n.t('commons.cancel').toUpperCase()
									: I18n.t('feedback_components.submit_feedback_uppercase')}
							</Text>
						)}
					</UserColorAwareComponent>
				</View>
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	mainContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: 16
	},
	leftSideTextContainer: {
		flexWrap: 'wrap',
		flex: 1
	},
	rightSideTextContainer: {
		flexWrap: 'wrap',
		flex: 1
	},
	leftSideTextBase: {
		...createFontStyle(LATO)
	},
	leftSideTextClosed: {
		letterSpacing: 0.5,
		fontSize: 16,
		color: '$greyColor'
	},
	leftSideTextOpened: {
		letterSpacing: 0.25,
		fontSize: 20,
		color: '$greyColor'
	},
	rightSideTextBase: {
		...createFontStyle(TITILLIUM, SEMI_BOLD),
		textAlign: 'right',
		letterSpacing: 1.25
	},
	rightSideTextClosed: {
		fontSize: 16,
		textAlign: 'center'
	},
	rightSideTextOpened: {
		fontSize: 18,
		color: '$greyColor'
	}
})

FeedbackHeader.defaultProps = {
	opened: false,
	onSubmitClick: () => {},
	onCancelClick: () => {}
}

FeedbackHeader.propTypes = {
	opened: PropTypes.bool,
	onSubmitClick: PropTypes.func,
	onCancelClick: PropTypes.func
}
