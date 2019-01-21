import { Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import Config from 'react-native-config'
import SplashScreen from 'react-native-splash-screen'

class WelcomePage extends React.Component {
  componentDidMount () {
    this.props.startup()
  }

  componentWillMount() {
    SplashScreen.hide();
  }



  render () {
    return (
      <Text>
        Welcome to Luminos
        { Config.APP_AXIOS_BASE_URL}
      </Text>
    )
  }
}

WelcomePage.defaultProps = {
  startup: () => {}
}

WelcomePage.propTypes = {
  navigation: PropTypes.object,
  startup: PropTypes.func.isRequired
}

// const mapDispatchToProps = dispatch => {
//   return {
//     startup: () => dispatch(startup())
//   }
// }

export default WelcomePage//connect(
//   null,
//   mapDispatchToProps
// )(WelcomePage)
