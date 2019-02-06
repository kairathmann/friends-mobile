import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

const UserColorAwareComponent = ({ children, color }) => (
	<React.Fragment>{children(`#${color.hexValue}`)}</React.Fragment>
)

UserColorAwareComponent.propTypes = {
	children: PropTypes.func.isRequired,
	color: PropTypes.shape({
		hexValue: PropTypes.string.isRequired
	})
}

const mapStateToProps = state => {
	return {
		color: state.profile.color
	}
}

export default connect(
	mapStateToProps,
	null
)(UserColorAwareComponent)
