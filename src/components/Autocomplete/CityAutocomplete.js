import React from 'react'
import PropTypes from 'prop-types'
import { TouchableWithoutFeedback } from 'react-native'
import { Text, Spinner } from 'native-base'
import debounce from 'lodash/debounce'
import EStyleSheet from 'react-native-extended-stylesheet'
import Config from 'react-native-config'
import Autocomplete from './Autocomplete'
import TextInput from '../TextInput/TextInput'
import { CITY_MAX_LENGTH } from '../../enums'
import I18n from '../../../locales/i18n'
import { createFontStyle } from '../../styles'

import mbxClient from '@mapbox/mapbox-sdk'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'

const DEBOUNCE_TIMEOUT_MS = 1500

const baseClient = mbxClient({ accessToken: Config.APP_MAPBOX_KEY })
const geocodingService = mbxGeocoding(baseClient)

class CityAutocomplete extends React.Component {
	state = {
		query: this.props.locationFullName,
		data: [],
		cityLoading: false,
		latestValid: this.props.locationFullName
	}

	onChangeText = city => {
		this.setState(
			{
				query: city,
				data: []
			},
			this.queryMapbox
		)
	}

	onLocationSelect = location => {
		this.setState(
			{
				query: location.fullName,
				data: [],
				latestValid: location.fullName
			},
			() => this.props.onLocationSelect(location)
		)
	}

	onCitySearchStart = () => {
		this.setState({ cityLoading: true })
	}

	onCitySearchEndError = () => {
		this.setState({ cityLoading: false, cityError: true })
	}

	onCitySearchEndSuccess = () => {
		this.setState({ cityLoading: false, cityError: false })
	}

	parseMapboxResponse = response => {
		// https://github.com/mapbox/mapbox-sdk-js/blob/master/docs/classes.md#mapiresponse
		return response.body.features.map(place => ({
			name: place.text,
			fullName: place['place_name'],
			latitude: place.geometry.coordinates[0],
			longitude: place.geometry.coordinates[1],
			mapboxId: place.id
		}))
	}

	queryMapbox = debounce(async () => {
		if (this.state.query.length === 0) return
		this.onCitySearchStart()
		try {
			const request = {
				query: this.state.query,
				types: ['place']
			}
			const response = await geocodingService.forwardGeocode(request).send()
			if (response.statusCode !== 200) {
				return this.onCitySearchEndError()
			}
			const places = this.parseMapboxResponse(response)
			this.setState({
				data: places
			})
			this.onCitySearchEndSuccess()
		} catch (err) {
			this.onCitySearchEndError()
		}
	}, DEBOUNCE_TIMEOUT_MS)

	renderItem = ({ item }) => {
		return (
			<TouchableWithoutFeedback onPress={() => this.onLocationSelect(item)}>
				<Text
					style={styles.dropdownItem}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{item.fullName}
				</Text>
			</TouchableWithoutFeedback>
		)
	}

	render() {
		const { query, data, cityLoading, latestValid } = this.state
		return (
			<Autocomplete
				data={data}
				renderItem={this.renderItem}
				maxItems={3}
				itemHeight={50}
				inputContainerStyle={styles.dropdownInput}
				listContainerStyle={[{ top: -33 }]}
				onOverlayClick={() => {
					this.queryMapbox.cancel()
					this.setState({
						query: latestValid
					})
				}}
				renderTextInput={props => (
					<TextInput
						{...props}
						label={I18n.t('onboarding.city_warning')}
						value={query}
						placeholder={I18n.t('onboarding.city_placeholder')}
						status={this.state.cityError ? 'error' : 'normal'}
						errorMessage={
							this.state.cityError ? I18n.t('onboarding.city_error') : ''
						}
						maxLength={CITY_MAX_LENGTH}
						onChange={text => this.onChangeText(text)}
						showLoader={cityLoading}
						renderLoader={() => <Spinner style={{ height: 1 }} color="white" />}
					/>
				)}
			/>
		)
	}
}

const styles = EStyleSheet.create({
	dropdownItem: {
		...createFontStyle(),
		color: 'white',
		margin: 16,
		backgroundColor: '$darkColor'
	},
	dropdownInput: {
		padding: 8
	}
})

CityAutocomplete.defaultTypes = {
	locationFullName: ''
}

CityAutocomplete.propTypes = {
	locationFullName: PropTypes.string,
	onLocationSelect: PropTypes.func.isRequired
}

export default CityAutocomplete
