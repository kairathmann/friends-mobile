import { Container, Content, Icon, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { Image, StatusBar, TouchableOpacity, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation'
import {
	createFontStyle,
	FONTS,
	FONTS_STYLES,
	styles as commonStyles
} from '../../../styles'
import I18n from '../../../../locales/i18n'
import * as COLORS from '../../../styles/colors'
import LoggedInUserAvatar from '../../../components/LoggedInUserAvatar'
import YourProfileIcon from '../../../assets/images/your_profile_icon.png'
import { PAGES_NAMES } from '../../../navigation/pages'
import { logOutUser } from '../../common-scenarios'

const ChevronIcon = () => (
	<Icon style={styles.cardIcon} type={'MaterialIcons'} name={'chevron-right'} />
)

const BigCard = ({ children, onPress }) => (
	<TouchableOpacity style={styles.bigCard} onPress={onPress}>
		<View style={styles.cardChildrenContainer}>{children}</View>
	</TouchableOpacity>
)

const SmallCard = ({ children, onPress }) => (
	<TouchableOpacity style={styles.smallCard} onPress={onPress}>
		<View style={styles.cardChildrenContainer}>{children}</View>
	</TouchableOpacity>
)

BigCard.propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func.isRequired
}

SmallCard.propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func.isRequired
}

class ProfilePage extends React.Component {
	renderYourProfileCard = () => (
		<BigCard
			onPress={() => {
				this.props.navigation.navigate(PAGES_NAMES.EDIT_PROFILE_PAGE)
			}}
		>
			<Image
				source={YourProfileIcon}
				resizeMode="contain"
				style={styles.bigCardIcon}
			/>
			<View style={styles.flexFull}>
				<Text style={styles.bigCardText}>
					{I18n.t('profile_page.your_profile').toUpperCase()}
				</Text>
			</View>
			<ChevronIcon />
		</BigCard>
	)

	renderSettingsSection = () => (
		<View style={styles.settingsContainer}>{this.renderYourProfileCard()}</View>
	)

	renderTermsOfServiceCard = () => (
		<SmallCard
			onPress={() => {
				this.props.navigation.navigate(PAGES_NAMES.TERMS)
			}}
		>
			<View style={styles.flexFull}>
				<Text style={styles.smallCardText}>
					{I18n.t('profile_page.terms_of_service')}
				</Text>
			</View>
			<ChevronIcon />
		</SmallCard>
	)

	renderPrivacyPolicyCard = () => (
		<View style={styles.termsPolicyCardSpacing}>
			<SmallCard
				onPress={() => {
					this.props.navigation.navigate(PAGES_NAMES.POLICY)
				}}
			>
				<View style={styles.flexFull}>
					<Text style={styles.smallCardText}>
						{I18n.t('profile_page.privacy_policy')}
					</Text>
				</View>
				<ChevronIcon />
			</SmallCard>
		</View>
	)

	renderSignOutCard = () => (
		<View style={styles.signOutSpacing}>
			<SmallCard
				onPress={() => {
					this.props.logOutUser()
				}}
			>
				<View style={styles.flexFull}>
					<Text style={styles.smallCardText}>
						{I18n.t('profile_page.sign_out')}
					</Text>
				</View>
			</SmallCard>
		</View>
	)

	renderTermsPrivacySection = () => (
		<View style={styles.termsPolicyContainer}>
			{this.renderTermsOfServiceCard()}
			{this.renderPrivacyPolicyCard()}
		</View>
	)

	renderUserProfileHeader = (userFirstName, userCity) => (
		<View style={styles.userInfoContainer}>
			<LoggedInUserAvatar circleSize={80} emojiSize={20} />
			<View style={styles.userDetailsContainer}>
				<Text style={styles.userNameText}>{userFirstName}</Text>
				<Text style={styles.userCityText}>{userCity}</Text>
			</View>
		</View>
	)

	render() {
		const { firstName, city } = this.props
		return (
			<React.Fragment>
				<StatusBar
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<Content contentContainerStyle={commonStyles.scrollableContent}>
							{this.renderUserProfileHeader(firstName, city)}
							{this.renderSettingsSection()}
							{this.renderTermsPrivacySection()}
							{this.renderSignOutCard()}
						</Content>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

ProfilePage.propTypes = {
	navigation: PropTypes.object.isRequired,
	firstName: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	logOutUser: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
	userInfoContainer: {
		flexGrow: 0,
		flexDirection: 'row',
		marginTop: 64,
		marginLeft: 24
	},
	settingsContainer: {
		marginTop: 24
	},
	userDetailsContainer: {
		flex: 1,
		flexDirection: 'column',
		marginLeft: 24,
		justifyContent: 'center'
	},
	userNameText: {
		...createFontStyle(FONTS.LATO, FONTS_STYLES.BOLD),
		fontSize: 28,
		color: 'white'
	},
	userCityText: {
		...createFontStyle(FONTS.LATO),
		fontSize: 16,
		letterSpacing: 0.25,
		color: 'white'
	},
	bigCard: {
		flex: 1,
		backgroundColor: '#242937',
		borderRadius: 4,
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 20,
		paddingBottom: 20
	},
	bigCardIcon: {
		width: 32,
		height: 32,
		marginLeft: 20,
		marginRight: 30,
		tintColor: 'rgba(255,255,255,0.8)'
	},
	bigCardText: {
		...createFontStyle(FONTS.TITILLIUM, FONTS_STYLES.SEMI_BOLD),
		color: 'white',
		fontSize: 16,
		letterSpacing: 1.25
	},
	smallCard: {
		height: 48,
		flex: 1,
		backgroundColor: 'rgba(62, 68, 101, 0.3)',
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 12,
		paddingBottom: 12
	},
	smallCardText: {
		...createFontStyle(FONTS.LATO),
		marginLeft: 20,
		color: 'white',
		fontSize: 17,
		letterSpacing: 0.5
	},
	cardIcon: {
		color: '$greyColor'
	},
	cardChildrenContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	termsPolicyContainer: {
		marginTop: 38
	},
	termsPolicyCardSpacing: {
		marginTop: 5
	},
	flexFull: {
		flex: 1
	},
	signOutSpacing: {
		marginTop: 28
	}
})

const mapStateToProps = state => {
	return {
		firstName: state.profile.firstName,
		city: state.profile.city
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logOutUser: () => dispatch(logOutUser())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfilePage)
