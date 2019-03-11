import { View } from 'react-native'
import { Spinner as NativeBaseSpinner } from 'native-base'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

class Spinner extends React.PureComponent {
	render() {
		const { show } = this.props
		return (
			<React.Fragment>
				{show && (
					<View style={styles.spinnerContainer}>
						<View style={styles.spinnerBackground}>
							<NativeBaseSpinner color="white" style={styles.spinner} />
						</View>
					</View>
				)}
			</React.Fragment>
		)
	}
}

Spinner.defaultProps = {
	show: false
}

Spinner.propTypes = {
	show: PropTypes.bool
}

const styles = EStyleSheet.create({
	spinnerContainer: {
		flex: 1,
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'transparent'
	},
	spinnerBackground: {
		borderRadius: 8,
		height: 60,
		width: 60,
		backgroundColor: 'rgba(0,0,0,0.6)'
	},
	spinner: {
		height: 60,
		width: 60
	}
})

const mapStateToProps = state => {
	return {
		show: state.global.showSpinner
	}
}

const ConnectedGlobalSpinner = connect(
	mapStateToProps,
	null
)(Spinner)
export { ConnectedGlobalSpinner, Spinner }
