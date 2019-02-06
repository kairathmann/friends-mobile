import _ from 'lodash'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import ColorCircle from '../ColorCircle'

export default class ColorSelector extends React.Component {
	shouldComponentUpdate = nextProps => {
		return nextProps.selectedColor !== this.props.selectedColor
	}

	onColorClick = clickedColor => {
		if (clickedColor !== this.props.selectedColor) {
			this.props.onSelectionChange(clickedColor)
		}
	}

	render() {
		const { colors, colorsPerRow, selectedColor } = this.props
		const splittedColorsToDrawByRow = _.chunk(colors, colorsPerRow)
		return (
			<View style={styles.container}>
				{splittedColorsToDrawByRow.map((singleRow, index) => {
					return (
						<View
							key={`color-selector-row-${index}`}
							style={[styles.rowContainer, styles.rowSpace]}
						>
							{singleRow.map(singleColor => (
								<View
									key={`color-picker-color-${singleColor}`}
									style={styles.signleColorCircle}
								>
									<ColorCircle
										color={singleColor}
										selected={singleColor === selectedColor}
										onPress={() => this.onColorClick(singleColor)}
									/>
								</View>
							))}
						</View>
					)
				})}
			</View>
		)
	}
}

ColorSelector.defaultProps = {
	colorsPerRow: 4
}

ColorSelector.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string).isRequired,
	selectedColor: PropTypes.string.isRequired,
	onSelectionChange: PropTypes.func.isRequired,
	colorsPerRow: PropTypes.number.isRequired
}

const styles = EStyleSheet.create({
	container: {
		flex: 1,
		alignSelf: 'center'
	},
	rowContainer: {
		flexDirection: 'row',
		flex: 1
	},
	rowSpace: {
		marginBottom: 20
	},
	signleColorCircle: {
		paddingLeft: 8,
		paddingRight: 8
	}
})
