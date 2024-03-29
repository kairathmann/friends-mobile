import moment from 'moment'
import { Root } from 'native-base'
import React from 'react'
import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Provider } from 'react-redux'
import configureApi from './src/config/config'
import { AppStackNavigatorWithGlobalSupport } from './src/navigation/pages'
import configuredStore from './src/store'
import { pushService } from './src/services'

import { COLORS } from './src/styles'

configureApi()
const store = configuredStore

moment.locale('en')

const width = Dimensions.get('window').width
EStyleSheet.build({
	$rem: width > 340 ? 18 : 16,
	$voidColor: COLORS.LUMINOS_VOID,
	$starlightColor: COLORS.LUMINOS_STARLIGHT,
	$primaryBackgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR,
	$errorColor: COLORS.LUMINOS_ERROR,
	$greyColor: COLORS.LUMINOS_GREY,
	$strongGreyColor: COLORS.LUMINOS_STRONG_GREY,
	$darkColor: COLORS.LUMINOS_DARK
})

export default class App extends React.Component {
	componentWillUnmount() {
		pushService.cleanUp()
	}

	render() {
		return (
			<Provider store={store}>
				<Root>
					<AppStackNavigatorWithGlobalSupport />
				</Root>
			</Provider>
		)
	}
}
