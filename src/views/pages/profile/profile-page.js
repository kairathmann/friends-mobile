import { Container, Content } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'

class ProfilePage extends React.Component {
	render() {
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<Container style={commonStyles.content}>
					<Content contentContainerStyle={commonStyles.scrollableContent} />
				</Container>
			</React.Fragment>
		)
	}
}

ProfilePage.propTypes = {
	navigation: PropTypes.object
}

export default ProfilePage
