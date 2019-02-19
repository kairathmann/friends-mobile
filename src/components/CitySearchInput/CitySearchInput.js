import algoliasearch from 'algoliasearch'
import debounce from 'lodash/debounce'
import { Spinner, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { LayoutAnimation } from 'react-native'
import Config from 'react-native-config'
import EStyleSheet from 'react-native-extended-stylesheet'
import I18n from '../../../locales/i18n'
import TextInput from '../TextInput/TextInput'
import { CITY_MAX_LENGTH } from '../../enums'
import { LUMINOS_ACCENT } from '../../styles/colors'

const places = algoliasearch.initPlaces(
	Config.APP_ALGOLIA_APP_ID,
	Config.APP_ALGOLIA_API_KEY
)

const DEBOUNCE_TIMEOUT_MS = 2500

class CitySearchInput extends React.Component {
	state = {
		city: this.props.city || '',
		cityError: false,
		cityLoading: false
	}

	__isMounted = false

	callOnCitySearchError = () => {
		if (this.__isMounted) {
			this.props.onSearchEndError()
		}
	}

	callOnCitySearchSuccess = city => {
		if (this.__isMounted) {
			this.props.onSearchEndSuccess(city)
		}
	}

	handleCityChange = city => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
		this.props.onSearchStart()
		this.setState(
			{
				city,
				cityLoading: true
			},
			this.askForPlaces
		)
	}

	askForPlaces = debounce(() => {
		const { city } = this.state
		places.search(
			{
				query: this.state.city,
				type: 'city',
				hitsPerPage: 3,
				getRankingInfo: true
			},
			(err, res) => {
				if (err) {
					this.callOnCitySearchError()
					if (this.__isMounted) {
						this.setState({
							cityLoading: false,
							cityError: true
						})
					}
					return
				}
				const foundExactMatches = res.hits.filter(
					h => h._rankingInfo.nbExactWords === city.split(' ').length
				)
				if (foundExactMatches.length > 0) {
					this.callOnCitySearchSuccess(city)
				} else {
					this.callOnCitySearchError()
				}
				if (this.__isMounted) {
					this.setState({
						cityError: foundExactMatches.length === 0,
						cityLoading: false
					})
				}
			}
		)
	}, DEBOUNCE_TIMEOUT_MS)

	componentDidMount() {
		this.__isMounted = true
		// need to check it in componentDidMount because handleCityChange is using setState
		// and calling setState inside constructor is forbidden as component is not mounted yet then
		if (this.state.city !== '' && this.props.validateOnMount) {
			this.handleCityChange(this.state.city)
		}
	}

	componentWillUnmount() {
		this.__isMounted = false
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.fullFlex}>
					<TextInput
						label={I18n.t('onboarding.city_warning')}
						value={this.state.city}
						placeholder={I18n.t('onboarding.city_placeholder')}
						status={this.state.cityError ? 'error' : 'normal'}
						errorMessage={
							this.state.cityError ? I18n.t('onboarding.city_error') : ''
						}
						containerStyle={styles.flexGrow}
						maxLength={CITY_MAX_LENGTH}
						onChange={text => this.handleCityChange(text)}
					/>
				</View>
				{this.state.cityLoading && (
					<Spinner color={LUMINOS_ACCENT} style={styles.spinner} />
				)}
			</View>
		)
	}
}

const styles = EStyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: 12,
		marginLeft: 8,
		marginRight: 8
	},
	spinner: {
		paddingLeft: 8
	},
	fullFlex: {
		flex: 1
	},
	flexGrow: {
		flexGrow: 1
	}
})

CitySearchInput.defaultProps = {
	validateOnMount: false
}

CitySearchInput.propTypes = {
	onSearchStart: PropTypes.func.isRequired,
	onSearchEndError: PropTypes.func.isRequired,
	onSearchEndSuccess: PropTypes.func.isRequired,
	validateOnMount: PropTypes.bool,
	city: PropTypes.string
}

export default CitySearchInput
