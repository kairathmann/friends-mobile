/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
// import React from 'react'
// import { View } from 'react-native'
import { createStackNavigator,
  createAppContainer } from 'react-navigation'

// import { navigationService } from '../services'
import WelcomePage from '../views/pages/welcome/welcome-page'

export const PAGES_NAMES = {
  WELCOME_PAGE: 'WELCOME_PAGE'
}

const AppStackNavigator = createStackNavigator({
  WELCOME_PAGE: {
    screen: WelcomePage,
    navigationOptions: () => ({
      header: null
    })
  }
})

// const AppStackNavigatorWithGlobalSupport = () => createAppContainer(AppStackNavigator)
  {/*<View style={ { flex: 1 } } forceInset={ { top: 'always' } }>*/}
    {/*<AppStackNavigator*/}
      {/*ref={ navigatorRef => {*/}
        {/*navigationService.setTopLevelNavigator(navigatorRef)*/}
      {/*} }*/}
      {/*styles={ { position: 'absolute' } }*/}
    {/*/>*/}
  {/*</View>*/}
// )


export const AppStackNavigatorWithGlobalSupport = createAppContainer(AppStackNavigator)
