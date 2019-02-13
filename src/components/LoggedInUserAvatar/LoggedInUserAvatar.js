import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import UserAvatar from '../UserAvatar'

class LoggedInUserAvatar extends React.Component {
	shouldComponentUpdate = nextProps => {
		return (
			nextProps.emoji !== this.props.emoji ||
			nextProps.color !== this.props.color
		)
	}

	render() {
		return <UserAvatar {...this.props} />
	}
}

LoggedInUserAvatar.defaultProps = {
	circleSize: 120,
	emojiSize: 50
}

LoggedInUserAvatar.propTypes = {
	emoji: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	circleSize: PropTypes.number.isRequired,
	emojiSize: PropTypes.number.isRequired
}

const mapStateToProps = state => {
	return {
		color: `#${state.profile.color.hexValue}`,
		emoji: state.profile.emoji
	}
}

export default connect(
	mapStateToProps,
	null
)(LoggedInUserAvatar)
