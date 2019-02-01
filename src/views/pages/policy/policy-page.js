import PropTypes from 'prop-types'
import React from 'react'
import { Text, ScrollView, StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { COLORS } from '../../../styles'

const PolicyPage = () => (
	<React.Fragment>
		<StatusBar
			barStyle="light-content"
			backgroundColor={COLORS.LUMINOS_BACKGROUND_COLOR}
			translucent={false}
		/>
		<ScrollView>
			<Text style={styles.headerText}>Privacy Policy</Text>
			<Text style={styles.normalText}>Last updated: 19.12.2018</Text>
			<Text style={styles.normalText}>
				This Privacy Policy describes how Gravity Analytics Limited,
				collectively referred to as &quot;Meetluna.com&quot; (or &quot;we&quot;
				or “us” or “our”) collects, uses, and handles your data when you use our
				website, products and services (“Services”). Please take the time to
				carefully read through this policy. As you use our Services, we want to
				be clear how Meetluna.com uses your information and how your privacy is
				protected. By using the Services, you consent to the data practices
				detailed in this policy. This Privacy Policy does not apply to services
				offered by other companies or other sites linked from our Services.
			</Text>
			<Text style={styles.headerText}>What Information is Collected</Text>
			<Text style={styles.normalText}>
				When you use our Services, we may collect information you send us or
				information we receive from your use of our Services. We may collect
				information in the following ways:
			</Text>
			<Text style={styles.indentedNormalText}>
				Information you give us. We may collect information that you provide us
				through a web form, such as when you create a Meetluna.com Profile, or
				when you otherwise correspond with us regarding our Services, such as
				when you contact our customer support team. The information you provide
				us includes your email address (such that we can send you email) and
				optionally an Ethereum wallet address or a QTUM wallet address (such
				that you can receive LSTR tokens from Meetluna.com). Additionally Name,
				Date of Birth, Gender, Location and Sexual Orientation are required to
				create a profile and to be later discovered on the platform. The
				complete list of collected information is as follows:
			</Text>
			<Text style={styles.indentedNormalText}>- Email</Text>
			<Text style={styles.indentedNormalText}>- Name</Text>
			<Text style={styles.indentedNormalText}>- Date of Birth (DOB)</Text>
			<Text style={styles.indentedNormalText}>- Gender</Text>
			<Text style={styles.indentedNormalText}>- Sexual Orientation</Text>
			<Text style={styles.indentedNormalText}>- User Tagline</Text>
			<Text style={styles.indentedNormalText}>- User Description</Text>
			<Text style={styles.indentedNormalText}>- User uploaded image</Text>
			<Text style={styles.indentedNormalText}>
				- Inbox size - preferred new daily messages
			</Text>
			<Text style={styles.indentedNormalText}>
				- Messages - We collect received &amp; sent messages
			</Text>
			<Text style={styles.indentedNormalText}>
				- Amount of token in the user wallet
			</Text>
			<Text style={styles.indentedNormalText}>
				- The user withdrawal address
			</Text>
			<Text style={styles.indentedNormalText}>
				In addition, to create an account on Meetluna.com, you must provide us
				with your name and email address, and agree to our Terms of Use and this
				Privacy Policy, which governs how we treat your information. You may
				provide additional information when creating a Meetluna.com account,
				such as linking to your Facebook, Google, LinkedIn, Twitter or other
				social accounts, to help build your Meetluna.com Profile. You understand
				and acknowledge that by creating a Meetluna.com account, we and others
				will be able to identify you by your Meetluna.com Profile.
			</Text>
			<Text style={styles.indentedNormalText}>
				Device information. We may collect information about devices you use to
				access the Services and how you use the Services, such as your IP
				address and which websites you visited before accessing our Services.
			</Text>
			<Text style={styles.indentedNormalText}>
				Logs. Our servers automatically record information created by your use
				of our Services to help us diagnose and fix technical issues, and to
				improve the the overall quality and user experience of our Services.
				Logs may include information such as your IP address, browser type,
				operating system, details of how you used our Services (such as your
				commands at the command line), diagnostic information related to the
				Services (such as crash activity reports), the referring web page, pages
				visited, location, your mobile carrier, device and application IDs,
				search terms, and cookie information.
			</Text>
			<Text style={styles.indentedNormalText}>
				Cookies. We use technologies like cookies and pixel tags to gather
				information about how you are interacting with the Services, which may
				include identifying your IP address, browser type, and referring page.
			</Text>
			<Text style={styles.headerText}>How is Collected Information Used</Text>
			<Text style={styles.normalText}>
				We collect and use information from you in order for us to provide,
				protect, and improve our Services, and to provide you with a
				personalized experience when using our Services. For example, when you
				provide Meetluna.com with your email address, we may send you updates on
				new Services and security notices.
			</Text>
			<Text style={styles.normalText}>
				Much of the information you provide us through our Services is
				information that is designed to be made public, such as your
				meetluna.com Profile information, including your name, photo, age,
				location, description and meetluna.com username.
			</Text>
			<Text style={styles.normalText}>
				If you elect to donate your earnings to charity or a nonprofit,
				meetluna.com will share with that charity or nonprofit information
				required for tax and other compliance reporting purposes which may
				include, but is not limited to, your name, email, and mailing address.
			</Text>
			<Text style={styles.indentedHeaderText}>
				Some specific examples of how Meetluna.com may use your personal data
				are:
			</Text>
			<Text style={styles.indentedNormalText}>
				- to provide you with information about how you are using email;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to customize, analyze, adjust and improve the site and services to
				better meet your needs;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to facilitate communication between Meetluna.com and you;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to facilitate communication between you and other users;
			</Text>
			<Text style={styles.indentedNormalText}>
				- if you provide us with information about other software and services
				that you use, we may use your personal data to try to synchronize your
				emails with such other software and services;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to provide you with information that may interest you, such as our
				newsletters or emails about our products and services (this information
				contains a subscriber link allowing you to opt out);
			</Text>
			<Text style={styles.indentedNormalText}>
				- to provide you with marketing and promotional information about
				products and services we believe may interest you (this information
				contains a subscriber link allowing you to opt out);
			</Text>
			<Text style={styles.indentedNormalText}>
				- to administer a survey (if you consent to participate in the survey
				via a response email);
			</Text>
			<Text style={styles.indentedNormalText}>
				- to send you a message in your Inbox (should you choose to accept it);
			</Text>
			<Text style={styles.indentedNormalText}>
				- in a customer testimonial posted on the site;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to enforce Meetluna.com’s agreements with you;
			</Text>
			<Text style={styles.indentedNormalText}>
				- to provide you with important administrative information regarding the
				site and services, such as changes to this Privacy Policy, our Terms of
				Use and our other policies;
			</Text>
			<Text style={styles.indentedNormalText}>
				- And to prevent fraud and other prohibited or illegal activities.
			</Text>
			<Text style={styles.headerText}>How We Use Cookies</Text>
			<Text style={styles.normalText}>
				Like most online businesses, we use cookies and web beacons on our
				websites and marketing-related emails to gather and analyze non-personal
				information such as the visitor’s IP address, browser type, ISP,
				referring page, operating system, date / time, and basic geographic
				information. We use these technologies to provide, improve and protect
				our Services, for example to:
			</Text>
			<Text style={styles.normalText}>
				- Customize our Services, such as remembering your username for the next
				time you use our Services;
			</Text>
			<Text style={styles.normalText}>
				- Measure product and marketing effectiveness;
			</Text>
			<Text style={styles.normalText}>
				- Collect information about your computing device to mitigate risk, help
				prevent fraud and promote trust and safety
			</Text>
			<Text style={styles.normalText}>
				You may set your browser to not accept cookies, but this may result in
				the Services not functioning properly for you.
			</Text>
			<Text style={styles.headerText}>Information We Share</Text>
			<Text style={styles.normalText}>
				We do not sell, exchange, transfer, or give your personal information to
				any other company or individual for any reason except as set forth
				below:
			</Text>
			<Text style={styles.normalText}>
				- We will share personal information with companies or individuals when
				we have your consent to do so;
			</Text>
			<Text style={styles.normalText}>
				- We may provide personal information to our trusted services providers
				to process it for us to assist us in providing Services to you, and only
				based on our instructions and in adherence with this Privacy Policy and
				applicable confidentiality and security measures;
			</Text>
			<Text style={styles.normalText}>
				- If we are involved in a merger or acquisition, your information may be
				transferred as part of that transaction. In such event, we will require
				that your personal information be protected in accordance with this
				Privacy Policy. We will notify you of any change in applicable policy.
			</Text>
			<Text style={styles.normalText}>
				- We will share personal information with law enforcement or other third
				parties if we: (1) are compelled to do so to comply with any applicable
				law or legal process; or (2) believe in good faith that disclosure is
				necessary to prevent physical harm, illegal activity, or harm to the
				rights, property, or safety of Meetluna.com or our users.
			</Text>
			<Text style={styles.normalText}>
				We may share non-personally identifiable information publicly and with
				our partners. For example, we may share anonymized analytics information
				that reveal general trends about our Services.
			</Text>
			<Text style={styles.headerText}>How Do We Protect Your Information?</Text>
			<Text style={styles.normalText}>
				Throughout this policy, we use the term &quot;personal information&quot;
				to describe information that can be associated with a specific person
				and can be used to identify that person. We do not consider personal
				information to include information that has been anonymized so that it
				does not identify a specific user.
			</Text>
			<Text style={styles.normalText}>
				meetluna.com takes reasonable precautions, as described herein, to
				protect your information from loss, misuse, unauthorized access,
				disclosure, alteration, and destruction. We may store, process and
				transmit information in locations around the world -- we may process
				your personal information on a server located outside the country you
				live. Some information may also be stored locally on devices you use to
				interact with Meetluna.com’s Services.
			</Text>
			<Text style={styles.normalText}>
				We protect information by maintaining physical, electronic and
				procedural safeguards in compliance with applicable US federal and state
				regulations. We use firewalls and data encryption, we enforce physical
				access controls to our buildings and files, and we limit access to
				personal information only to those employees who need to know that
				information in order to process it for us.
			</Text>
			<Text style={styles.headerText}>Data Retention</Text>
			<Text style={styles.normalText}>
				We store information about your use of our Services for as long as we
				need it to provide you the Services. Note that we may retain your
				personal information as necessary in order to comply with our legal
				obligations, resolve disputes, or enforce our agreements to the extent
				permitted by law.
			</Text>
			<Text style={styles.headerText}>Changes To This Privacy Policy</Text>
			<Text style={styles.normalText}>
				We may amend this Privacy Policy at any time by posting the most current
				version on our website. If the changes materially reduce your rights, we
				will provide a more prominent notice (for example, for certain Services
				we will send email notification of significant changes). We recommend
				checking this page frequently for changes.
			</Text>
			<Text style={styles.headerText}>Contact Us</Text>
			<Text style={styles.normalText}>
				If you have questions or concerns regarding this policy or would like to
				access, change or delete your personal information, contact us on our
				support page or by emailing us at support@meetluna.com.
			</Text>
			<Text style={styles.normalText}>
				To create an account on meetluna.com, you must provide us with your name
				and email address, and agree to our Terms of Use and this Privacy
				Policy, which governs how we treat your information. You may provide
				additional information when creating a meetluna.com account, such as
				linking to your Facebook, LinkedIn, Google, or Twitter accounts, to help
				build your meetluna.com Profile. You understand and acknowledge that by
				creating a meetluna.com account, we and others will be able to identify
				you by your Meetluna.com Profile.
			</Text>
		</ScrollView>
	</React.Fragment>
)

PolicyPage.propTypes = {
	navigation: PropTypes.object.isRequired
}

const styles = EStyleSheet.create({
	headerText: {
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 16
	},
	indentedHeaderText: {
		textAlign: 'center',
		marginLeft: 32,
		marginTop: 16,
		marginBottom: 16
	},
	normalText: {
		color: '#383838',
		marginBottom: 16,
		textAlign: 'left',
		fontWeight: '300'
	},
	indentedNormalText: {
		color: '#383838',
		marginLeft: 32,
		marginBottom: 16,
		textAlign: 'left',
		fontWeight: '300'
	}
})

export default PolicyPage
