import 'moment/locale/de'
import 'moment/locale/pl'
import React from 'react'
import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Provider } from 'react-redux'
import configureApi from './src/config/config'
import { AppStackNavigatorWithGlobalSupport } from './src/navigation/pages'
import { register as registerForPushNotifications } from './src/services/pushNotificationService'
import configuredStore from './src/store'

import { COLORS } from './src/styles'

configureApi()
const store = configuredStore

const width = Dimensions.get('window').width
EStyleSheet.build({
  $rem: width > 340 ? 18 : 16,
  $primaryColor: COLORS.LUNA_PRIMARY_COLOR,
  $primaryBackgroundColor: COLORS.LUNA_BACKGROUND_COLOR,
  $lunaNotificationCircle: COLORS.LUNA_NOTIFICATION_CIRCLE_COLOR
})

export default class App extends React.Component {
  componentDidMount () {
    registerForPushNotifications(configuredStore)
  }

  render () {
    return (
      <Provider store={ store }>
        <AppStackNavigatorWithGlobalSupport/>
      </Provider>
    )
  }
}
