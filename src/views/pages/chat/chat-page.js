import { Container } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { styles as commonStyles } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import ConversationWaitroom from '../../../components/ConversationWaitroom/ConversationWaitroom'

class ChatPage extends React.Component {
	render() {
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<ConversationWaitroom pastChats={true} />
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

ChatPage.propTypes = {
	navigation: PropTypes.object
}

export default ChatPage
