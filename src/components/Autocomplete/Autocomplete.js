/*
	The MIT License (MIT)

	Copyright (c) 2015 Laurence

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	
	https://github.com/mrlaessig/react-native-autocomplete-input
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	FlatList,
	Text,
	TextInput,
	View,
	Keyboard,
	ViewPropTypes as RNViewPropTypes
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import Overlay from '../Overlay'

const ViewPropTypes = RNViewPropTypes || View.propTypes

class Autocomplete extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hideResults: this.props.data.length === 0
		}
		this.resultList = null
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.hideResults !== nextProps.hideResults
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.data.length === 0 && prevState.hideResults) {
			this.setState({ hideResults: false })
		}
	}

	renderResultList() {
		const {
			listStyle,
			renderItem,
			keyboardShouldPersistTaps,
			onEndReached,
			onEndReachedThreshold,
			data,
			itemHeight,
			maxItems,
			keyExtractor
		} = this.props

		const height = Math.min(itemHeight * data.length, maxItems * itemHeight)
		return (
			<FlatList
				nestedScrollEnabled={true}
				ref={resultList => {
					this.resultList = resultList
				}}
				data={data}
				keyboardShouldPersistTaps={keyboardShouldPersistTaps}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				onEndReached={onEndReached}
				onEndReachedThreshold={onEndReachedThreshold}
				style={[listStyle, styles.list, { height }]}
			/>
		)
	}

	renderTextInput() {
		const { onEndEditing, renderTextInput, style } = this.props
		const props = {
			style: [styles.input, style],
			ref: ref => (this.textInput = ref),
			onEndEditing: e => onEndEditing && onEndEditing(e),
			...this.props
		}

		return renderTextInput(props)
	}

	render() {
		const { hideResults } = this.state
		const {
			containerStyle,
			inputContainerStyle,
			listContainerStyle,
			onStartShouldSetResponderCapture
		} = this.props
		return (
			<View style={[styles.container, containerStyle]}>
				{!hideResults && (
					<View style={styles.overlayWrapper}>
						<Overlay
							visible={!hideResults}
							onPress={() => {
								Keyboard.dismiss()
								this.setState({ hideResults: !hideResults })
								this.props.onOverlayClick()
							}}
							clickEventsEnabled={true}
							opacity={0}
						/>
					</View>
				)}
				<View style={[styles.inputContainer, inputContainerStyle]}>
					{this.renderTextInput()}
				</View>
				{!hideResults && (
					<View
						style={[styles.resultsWrapper, ...listContainerStyle]}
						onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
					>
						{this.renderResultList()}
					</View>
				)}
			</View>
		)
	}
}

Autocomplete.propTypes = {
	...TextInput.propTypes,
	/**
	 * These styles will be applied to the container which
	 * surrounds the autocomplete component.
	 */
	containerStyle: ViewPropTypes.style,
	/**
	 * Assign an array of data objects which should be
	 * rendered in respect to the entered text.
	 */
	data: PropTypes.array,
	/*
	 * These styles will be applied to the container which surrounds
	 * the textInput component.
	 */
	inputContainerStyle: ViewPropTypes.style,
	/*
	 * Set `keyboardShouldPersistTaps` to true if RN version is <= 0.39.
	 */
	keyboardShouldPersistTaps: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool
	]),
	/*
	 * These styles will be applied to the container which surrounds
	 * the result list.
	 */
	listContainerStyle: ViewPropTypes.style,
	/**
	 * These style will be applied to the result list.
	 */
	listStyle: ViewPropTypes.style,
	/**
	 * method for intercepting swipe on ListView. Used for ScrollView support on Android
	 */
	onStartShouldSetResponderCapture: PropTypes.func,
	/**
	 * `renderItem` will be called to render the data objects
	 * which will be displayed in the result view below the
	 * text input.
	 */
	renderItem: PropTypes.func,
	/**
	 * renders custom TextInput. All props passed to this function.
	 */
	renderTextInput: PropTypes.func,
	/**
	 * `onOverlayClick`: called when user clicks anywhere outside input / list
	 */
	onOverlayClick: PropTypes.func
}

Autocomplete.defaultProps = {
	data: [],
	defaultValue: '',
	keyboardShouldPersistTaps: 'always',
	onStartShouldSetResponderCapture: () => false,
	renderItem: rowData => <Text>{rowData}</Text>,
	renderTextInput: props => <TextInput {...props} />,
	keyExtractor: (item, index) => index.toString(),
	onOverlayClick: () => {}
}

const styles = EStyleSheet.create({
	resultsWrapper: {
		zIndex: 9000,
		backgroundColor: '$darkColor',
		borderRadius: 4,
		marginLeft: 10,
		marginRight: 10
	},
	container: {
		flex: 1
	},
	overlayWrapper: {
		position: 'absolute',
		top: -1000,
		left: -16,
		right: -16,
		bottom: -1000
	},
	input: {
		backgroundColor: '$primaryBackgroundColor',
		height: 40,
		paddingLeft: 3
	},
	inputContainer: {
		marginBottom: 0
	},
	list: {
		zIndex: 9000,
		overflow: 'scroll'
	}
})

export default Autocomplete
