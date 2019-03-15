import { Icon, View } from 'native-base'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

export const NavigationBottomBar = ({
	onLeftClick,
	onRightClick,
	rightDisabled,
	leftDisabled,
	rightHidden,
	leftHidden,
	rightArrowColor,
	customRightIcon,
	centerComponent
}) => (
	<View style={styles.bottom}>
		<View
			style={[
				styles.bar,
				leftHidden && !rightHidden ? styles.barOnlyRightItem : ''
			]}
		>
			{!leftHidden && (
				<TouchableOpacity
					onPress={leftDisabled ? () => {} : onLeftClick}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<Icon
						type={'MaterialIcons'}
						name={'arrow-back'}
						style={[styles.leftArrow, leftDisabled && styles.disabled]}
					/>
				</TouchableOpacity>
			)}
			{centerComponent}
			{!rightHidden ? (
				<TouchableOpacity
					onPress={rightDisabled ? () => {} : onRightClick}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
				>
					<Icon
						type={'MaterialIcons'}
						name={customRightIcon ? customRightIcon : 'arrow-forward'}
						style={[
							styles.rightArrow,
							rightArrowColor ? { color: rightArrowColor } : '',
							rightDisabled && styles.disabled
						]}
					/>
				</TouchableOpacity>
			) : (
				<View style={{ width: 28 }} />
			)}
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
	barOnlyRightItem: {
		justifyContent: 'flex-end'
	},
	leftArrow: {
		color: 'white'
	},
	rightArrow: {
		alignSelf: 'flex-end',
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
	leftDisabled: false,
	rightHidden: false,
	leftHidden: false
}

NavigationBottomBar.propTypes = {
	onLeftClick: PropTypes.func,
	onRightClick: PropTypes.func,
	rightDisabled: PropTypes.bool,
	leftDisabled: PropTypes.bool,
	rightHidden: PropTypes.bool,
	leftHidden: PropTypes.bool,
	rightArrowColor: PropTypes.string,
	customRightIcon: PropTypes.string,
	centerComponent: PropTypes.node
}
