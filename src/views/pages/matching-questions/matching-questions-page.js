import { Container, Tab, Tabs, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import i18n from '../../../../locales/i18n'
import I18n from '../../../../locales/i18n'
import Question from '../../../components/Question/Question'
import { createLoadingSelector } from '../../../store/utils/selectors'
import { styles as commonStyles, createFontStyle, FONTS } from '../../../styles'
import * as COLORS from '../../../styles/colors'
import { LUMINOS_ACCENT } from '../../../styles/colors'
import { PAGES_NAMES } from '../../../navigation/pages'
import UnansweredQuestionWizard from '../../../components/UnansweredQuestionWizard'

class MatchingQuestionsPage extends React.Component {
	onQuestionTouch = question => {
		this.props.navigation.navigate(
			PAGES_NAMES.QUESTION_PAGE_PROFILE_EDIT_VIEW,
			{ question }
		)
	}

	render() {
		const { answered, unanswered } = this.props
		return (
			<React.Fragment>
				<StatusBar
					translucent={false}
					barStyle="light-content"
					backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
				/>
				<SafeAreaView style={commonStyles.safeAreaView}>
					<Container style={commonStyles.content}>
						<View style={styles.tabsContainer}>
							<Tabs
								style={{ backgroundColor: 'transparent', borderBottomWidth: 0 }}
								tabBarUnderlineStyle={{ height: 0 }}
								tabContainerStyle={{
									borderBottomWidth: 1,
									borderBottomColor: '#0f0f0f'
								}}
								onChangeTab={() => {}}
								tabBarPosition={'overlayTop'}
							>
								<Tab
									style={{ backgroundColor: 'transparent' }}
									textStyle={{ color: 'white' }}
									activeTextStyle={{ color: 'white' }}
									activeTabStyle={styles.activeTabStyle}
									tabStyle={styles.tabStyle}
									heading={I18n.t('tabs.questions').toUpperCase()}
								>
									<ScrollView
										contentContainerStyle={commonStyles.scrollableContent}
									>
										{unanswered.length === 0 && (
											<Text style={styles.emptyListText}>
												{i18n.t('matching_questions.no_questions')}
											</Text>
										)}
										<UnansweredQuestionWizard />
									</ScrollView>
								</Tab>
								<Tab
									style={{ backgroundColor: 'transparent' }}
									textStyle={{ color: 'white' }}
									activeTextStyle={{ color: 'white' }}
									activeTabStyle={styles.activeTabStyle}
									tabStyle={styles.tabStyle}
									heading={I18n.t('tabs.questions_answered').toUpperCase()}
								>
									<ScrollView
										contentContainerStyle={commonStyles.scrollableContent}
									>
										<View style={styles.questionsListContainer}>
											{answered.map(q => (
												<TouchableOpacity
													key={q.id}
													style={styles.questionContainer}
													onPress={() => this.onQuestionTouch(q)}
												>
													<Question
														answers={q.answers}
														text={q.text}
														answered
														selectedAnswer={q.lastAnswer}
														onChangeAnswer={() => this.onQuestionTouch(q)}
													/>
												</TouchableOpacity>
											))}
										</View>
									</ScrollView>
								</Tab>
							</Tabs>
						</View>
					</Container>
				</SafeAreaView>
			</React.Fragment>
		)
	}
}

const styles = EStyleSheet.create({
	activeTabStyle: {
		backgroundColor: '$primaryBackgroundColor',
		paddingLeft: 0,
		paddingRight: 0,
		color: LUMINOS_ACCENT,
		borderBottomWidth: 2,
		borderBottomColor: 'white'
	},
	tabStyle: {
		backgroundColor: '$primaryBackgroundColor',
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent'
	},
	questionContainer: {
		paddingTop: 24,
		paddingBottom: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '$darkColor',
		marginLeft: 16,
		marginRight: 16,
		marginTop: 0,
		marginBottom: 8,
		borderRadius: 4
	},
	emptyListText: {
		...createFontStyle(FONTS.LATO),
		color: 'white',
		opacity: 0.8,
		letterSpacing: 0.25,
		fontSize: 14,
		paddingLeft: 32,
		paddingRight: 32,
		paddingTop: 32,
		textAlign: 'center'
	},
	saveText: {
		...createFontStyle(FONTS.LATO),
		color: 'white'
	},
	tabsContainer: {
		flex: 9
	},
	tranparent: {
		backgroundColor: 'transparent'
	},
	questionsListContainer: {
		marginTop: 16
	}
})

MatchingQuestionsPage.propTypes = {
	isSavingUnansweredQuestion: PropTypes.bool.isRequired,
	navigation: PropTypes.object.isRequired,
	answered: PropTypes.array.isRequired,
	unanswered: PropTypes.array.isRequired
}

const mapStateToProps = state => {
	return {
		isSavingUnansweredQuestion: createLoadingSelector([
			'WIZARD_SAVE_UNANSWERED'
		])(state),
		answered: state.profile.questions.answered,
		unanswered: state.profile.questions.unanswered
	}
}

export default connect(mapStateToProps)(MatchingQuestionsPage)
