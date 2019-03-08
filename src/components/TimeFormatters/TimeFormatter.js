import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import Moment from 'react-moment'
import MomentPropTypes from 'react-moment-proptypes'
import EStyleSheet from 'react-native-extended-stylesheet'
import { createFontStyle } from '../../styles'
import { LATO } from '../../styles/fonts'
import { COMMON_DATE_FORMAT } from '../../common/time'

class TimeFormatter extends React.Component {
	render() {
		const { style, dateTime } = this.props
		return (
			<Moment
				style={[componentStyles.date, style]}
				element={Text}
				format={COMMON_DATE_FORMAT}
			>
				{dateTime}
			</Moment>
		)
	}
}

TimeFormatter.defaultProps = {
	style: {}
}

TimeFormatter.propTypes = {
	style: PropTypes.shape({}),
	dateTime: MomentPropTypes.momentString.isRequired
}

const componentStyles = EStyleSheet.create({
	date: {
		...createFontStyle(LATO),
		color: 'white'
	}
})

export default TimeFormatter
