import { Icon, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

export const NavigationBottomBar = ({
	onLeftClick,
	onRightClick,
	rightDisabled,
	leftDisabled
}) => (
	<View style={styles.bottom}>
		<View style={styles.bar}>
			<Icon
				onPress={leftDisabled ? () => {} : onLeftClick}
				type={'MaterialIcons'}
				name={'arrow-back'}
				style={[styles.leftArrow, leftDisabled && styles.disabled]}
			/>
			<Icon
				onPress={rightDisabled ? () => {} : onRightClick}
				type={'MaterialIcons'}
				name={'arrow-forward'}
				style={[styles.rightArrow, rightDisabled && styles.disabled]}
			/>
		</View>
	</View>
)

const styles = EStyleSheet.create({
	bar: {
		padding: 16,
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row'
	},
	leftArrow: {
		color: 'white'
	},
	rightArrow: {
		color: '#58e2c2'
	},
	disabled: {
		opacity: 0.5
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end'
	}
})

NavigationBottomBar.defaultProps = {
	rightDisabled: false,
	leftDisabled: false
}

NavigationBottomBar.propTypes = {
	onLeftClick: PropTypes.func,
	onRightClick: PropTypes.func,
	rightDisabled: PropTypes.bool,
	leftDisabled: PropTypes.bool
}
