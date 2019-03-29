import EStyleSheet from 'react-native-extended-stylesheet'
import { COLORS } from '../src/styles'
import 'react-native'
import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'

Enzyme.configure({ adapter: new Adapter() })

const exposedProperties = ['window', 'navigator', 'document']

global.window = window
global.document = window.document

Object.keys(document.defaultView).forEach(property => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property)
		global[property] = document.defaultView[property]
	}
})

global.navigator = {
	userAgent: 'node.js'
}

// Muting errors due to warning propagation via it, which doesn't make sense to us
console.error = jest.fn()

EStyleSheet.build({
	$rem: 16,
	$voidColor: COLORS.LUMINOS_VOID,
	$starlightColor: COLORS.LUMINOS_STARLIGHT,
	$primaryBackgroundColor: COLORS.LUMINOS_BACKGROUND_COLOR,
	$errorColor: COLORS.LUMINOS_ERROR,
	$greyColor: COLORS.LUMINOS_GREY,
	$strongGreyColor: COLORS.LUMINOS_STRONG_GREY,
	$darkColor: COLORS.LUMINOS_DARK
})
