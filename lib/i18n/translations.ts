export type Language = 'en' | 'es';

export type TranslationKey = 
  // Header
  | 'header.home'
  | 'header.nosotros'
  | 'header.dashboard'
  | 'header.speakerDashboard'
  | 'header.speakers'
  | 'header.login'
  | 'header.signup'
  | 'header.profile'
  | 'header.logout'
  | 'header.discover'
  | 'header.speaker'
  | 'header.loginStudent'
  | 'header.loginSpeaker'
  
  // Home Page
  | 'home.badge'
  | 'home.title.line1'
  | 'home.title.line2'
  | 'home.title.line3'
  | 'home.cta.explore'
  | 'home.reviews'
  | 'home.popularSpeakers'
  | 'home.popularSpeakersDesc'
  | 'home.filter.all'
  | 'home.filter.literature'
  | 'home.filter.architecture'
  | 'home.filter.engineering'
  | 'home.filter.business'
  | 'home.filter.cooking'
  | 'home.viewAll'
  | 'home.howItWorks.badge'
  | 'home.howItWorks.title'
  | 'home.howItWorks.step1'
  | 'home.howItWorks.step2'
  | 'home.howItWorks.step3'
  | 'home.howItWorks.step4'
  | 'home.whyDifferent.badge'
  | 'home.whyDifferent.title'
  | 'home.whyDifferent.point1'
  | 'home.whyDifferent.point2'
  | 'home.whyDifferent.point3'
  | 'home.becomeSpeaker.title'
  | 'home.becomeSpeaker.titleSpeaker'
  | 'home.becomeSpeaker.point1'
  | 'home.becomeSpeaker.point2'
  | 'home.becomeSpeaker.point3'
  | 'home.becomeSpeaker.cta'
  | 'home.hero.subtitle'
  | 'home.becomeSpeaker.subtitle'
  | 'home.becomeSpeaker.steps.step1.label'
  | 'home.becomeSpeaker.steps.step2.label'
  | 'home.becomeSpeaker.steps.step3.label'
  
  // Speakers Page
  | 'speakers.title'
  | 'speakers.subtitle'
  | 'speakers.search.placeholder'
  | 'speakers.noResults.title'
  | 'speakers.noResults.description'
  | 'speakers.noResults.reset'
  | 'speakers.card.book'
  | 'home.speakerCard.age'
  | 'home.speakerCard.book'
  | 'home.speakerCard.free'
  | 'home.footer.links'
  | 'home.footer.terms'
  | 'home.footer.privacy'
  | 'home.footer.copyright'
  
  // Auth
  | 'auth.signup.title'
  | 'auth.signup.createAccount'
  | 'auth.signup.google'
  | 'auth.signup.facebook'
  | 'auth.signup.or'
  | 'auth.signup.firstName'
  | 'auth.signup.lastName'
  | 'auth.signup.email'
  | 'auth.signup.password'
  | 'auth.signup.submit'
  | 'auth.signup.loading'
  | 'auth.signup.hasAccount'
  | 'auth.signup.login'
  | 'auth.signup.validate.firstNameRequired'
  | 'auth.signup.validate.firstNameMin'
  | 'auth.signup.validate.firstNameInvalid'
  | 'auth.signup.validate.lastNameRequired'
  | 'auth.signup.validate.lastNameMin'
  | 'auth.signup.validate.lastNameInvalid'
  | 'auth.signup.validate.emailRequired'
  | 'auth.signup.validate.emailInvalid'
  | 'auth.signup.validate.passwordRequired'
  | 'auth.signup.validate.passwordMin'
  | 'auth.signup.validate.passwordLetter'
  | 'auth.signup.validate.passwordNumber'
  | 'auth.signup.validate.termsRequired'
  | 'auth.signup.termsText'
  | 'auth.signup.termsLink'
  | 'auth.signup.termsAnd'
  | 'auth.signup.privacyLink'
  | 'auth.terms.modal.title'
  | 'auth.terms.modal.description'
  | 'auth.terms.modal.content'
  | 'auth.terms.modal.accept'
  | 'auth.terms.modal.accepting'
  | 'auth.terms.error'
  | 'auth.common.back'
  | 'auth.common.continue'
  | 'auth.common.select'
  | 'auth.common.fullName'
  | 'auth.common.fullNamePlaceholder'
  | 'auth.common.emailPlaceholder'
  | 'auth.common.passwordPlaceholder'
  | 'auth.common.passwordCreatePlaceholder'
  | 'auth.errors.loginFailed'
  | 'auth.errors.loginUnknown'
  | 'auth.errors.registerFailed'
  | 'auth.validation.fullNameRequired'
  | 'auth.validation.emailRequired'
  | 'auth.validation.emailInvalid'
  | 'auth.validation.passwordRequired'
  | 'auth.validation.gmailRequired'
  | 'auth.validation.birthDateRequired'
  | 'auth.validation.cityRequired'
  | 'auth.validation.bioRequired'
  | 'auth.validation.photoRequired'
  
  // Student Auth Page
  | 'auth.student.title'
  | 'auth.student.subtitle'
  | 'auth.student.login.submitting'
  | 'auth.student.register.submit'
  
  // Speaker Auth Page
  | 'auth.speaker.title'
  | 'auth.speaker.subtitle'
  | 'auth.speaker.login.submitting'
  | 'auth.speaker.register.step1.emailLabel'
  | 'auth.speaker.register.step1.emailPlaceholder'
  | 'auth.speaker.register.step1.emailHint'
  | 'auth.speaker.register.step1.submit'
  | 'auth.speaker.register.step2.birthDateLabel'
  | 'auth.speaker.register.step2.cityLabel'
  | 'auth.speaker.register.step2.cityPlaceholder'
  | 'auth.speaker.register.step2.bioLabel'
  | 'auth.speaker.register.step2.bioPlaceholder'
  | 'auth.speaker.register.step2.photoLabel'
  | 'auth.speaker.register.step2.photoUpload'
  | 'auth.speaker.register.step2.photoHint'
  | 'auth.speaker.register.step2.photoSelect'
  | 'auth.speaker.register.step2.back'
  | 'auth.speaker.register.step2.submit'
  | 'auth.speaker.register.step2.submitting'
  
  // Terms and Conditions Page
  | 'terms.title'
  | 'terms.section1.title'
  | 'terms.section1.paragraph1'
  | 'terms.section2.title'
  | 'terms.section2.paragraph1'
  | 'terms.section2.paragraph2'
  | 'terms.section3.title'
  | 'terms.section3.paragraph1'
  | 'terms.section4.title'
  | 'terms.section4.intro'
  | 'terms.section4.item1'
  | 'terms.section4.item2'
  | 'terms.section4.item3'
  | 'terms.section4.paragraph1'
  | 'terms.section5.title'
  | 'terms.section5.paragraph1'
  | 'terms.section5.intro'
  | 'terms.section5.item1'
  | 'terms.section5.item2'
  | 'terms.section5.item3'
  | 'terms.section5.paragraph2'
  | 'terms.section6.title'
  | 'terms.section6.part1'
  | 'terms.section6.link1'
  | 'terms.section6.part2'
  | 'terms.section6.link2'
  | 'terms.section6.paragraph2'
  | 'terms.section7.title'
  | 'terms.section7.paragraph1'
  | 'terms.section8.title'
  | 'terms.section8.paragraph1'
  | 'terms.section9.title'
  | 'terms.section9.paragraph1'
  | 'terms.section10.title'
  | 'terms.section10.paragraph1'
  
  // Privacy Policy Page
  | 'privacy.title'
  | 'privacy.lastUpdated'
  | 'privacy.section1.title'
  | 'privacy.section1.paragraph1.part1'
  | 'privacy.section1.paragraph1.link'
  | 'privacy.section1.paragraph1.part2'
  | 'privacy.section1.paragraph2'
  | 'privacy.section1.paragraph3'
  | 'privacy.section1.emailLabel'
  | 'privacy.section1.emailText'
  | 'privacy.section2.title'
  | 'privacy.section2.paragraph1'
  | 'privacy.section2.item1'
  | 'privacy.section2.item2'
  | 'privacy.section2.item3'
  | 'privacy.section2.item4'
  | 'privacy.section2.item5'
  | 'privacy.section2.item6'
  | 'privacy.section2.item7'
  | 'privacy.section2.item8'
  | 'privacy.section2.note'
  | 'privacy.section3.title'
  | 'privacy.section3.paragraph1'
  | 'privacy.section3.primaryHeading'
  | 'privacy.section3.primaryItem1'
  | 'privacy.section3.primaryItem2'
  | 'privacy.section3.primaryItem3'
  | 'privacy.section3.primaryItem4'
  | 'privacy.section3.secondaryHeading'
  | 'privacy.section3.secondaryItem1'
  | 'privacy.section3.secondaryItem2'
  | 'privacy.section3.paragraph2.part1'
  | 'privacy.section3.paragraph2.link'
  | 'privacy.section3.paragraph2.part2'
  | 'privacy.section4.title'
  | 'privacy.section4.paragraph1'
  | 'privacy.section4.paragraph2'
  | 'privacy.section5.title'
  | 'privacy.section5.paragraph1'
  | 'privacy.section5.paragraph2'
  | 'privacy.section6.title'
  | 'privacy.section6.paragraph1'
  | 'privacy.section6.emailLabel'
  | 'privacy.section6.emailText'
  | 'privacy.section6.paragraph2'
  | 'privacy.section7.title'
  | 'privacy.section7.paragraph1'
  | 'privacy.section7.paragraph2'
  | 'privacy.section8.title'
  | 'privacy.section8.paragraph1'
  | 'privacy.section9.title'
  | 'privacy.section9.paragraph1'
  | 'privacy.section9.paragraph2.part1'
  | 'privacy.section9.paragraph2.link'
  | 'privacy.section9.paragraph2.part2'
  | 'privacy.section10.title'
  | 'privacy.section10.paragraph1'
  
  | 'auth.signin.title'
  | 'auth.signin.email'
  | 'auth.signin.password'
  | 'auth.signin.submit'
  | 'auth.signin.loading'
  | 'auth.signin.noAccount'
  | 'auth.signin.signup'
  | 'auth.roleSelection.title'
  | 'auth.roleSelection.subtitle'
  | 'auth.roleSelection.student'
  | 'auth.roleSelection.speaker'
  
  // Speakers Page
  | 'speakers.title'
  | 'speakers.subtitle'
  | 'speakers.search.placeholder'
  | 'speakers.filter.title'
  | 'speakers.filter.allTopics'
  | 'speakers.filter.business'
  | 'speakers.filter.technology'
  | 'speakers.filter.health'
  | 'speakers.filter.education'
  | 'speakers.filter.arts'
  | 'speakers.filter.sports'
  | 'speakers.filter.travel'
  | 'speakers.filter.food'
  | 'speakers.filter.science'
  | 'speakers.filter.entertainment'
  | 'speakers.results.count'
  | 'speakers.results.countPlural'
  | 'speakers.card.new'
  | 'speakers.card.reviews'
  | 'speakers.card.sessions'
  | 'speakers.noResults'
  | 'speakers.clearFilters'
  | 'speakers.noResults.title'
  | 'speakers.noResults.description'
  | 'speakers.noResults.reset'
  | 'speakers.card.book'
  
  // Speaker Dashboard
  | 'dashboard.title'
  | 'dashboard.subtitle'
  | 'dashboard.errors.loginRequired'
  | 'dashboard.errors.loadFailed'
  | 'dashboard.errors.saveFailed'
  | 'dashboard.errors.availabilityFailed'
  | 'dashboard.errors.avatarFailed'
  | 'dashboard.errors.cancelFailed'
  | 'dashboard.errors.calendarInitFailed'
  | 'dashboard.errors.calendarConnectFailed'
  | 'dashboard.errors.calendarDisconnectFailed'
  | 'dashboard.profile.title'
  | 'dashboard.profile.description'
  | 'dashboard.profile.bio'
  | 'dashboard.profile.bioPlaceholder'
  | 'dashboard.profile.noBio'
  | 'dashboard.profile.save'
  | 'dashboard.profile.saving'
  | 'dashboard.calendar.title'
  | 'dashboard.calendar.description'
  | 'dashboard.calendar.connected'
  | 'dashboard.calendar.expires'
  | 'dashboard.calendar.notConnected'
  | 'dashboard.calendar.notConnectedDesc'
  | 'dashboard.calendar.connect'
  | 'dashboard.calendar.connecting'
  | 'dashboard.calendar.disconnect'
  | 'dashboard.calendar.disconnecting'
  | 'dashboard.availability.title'
  | 'dashboard.availability.description'
  | 'dashboard.availability.daysActive'
  | 'dashboard.availability.to'
  | 'dashboard.availability.save'
  | 'dashboard.availability.saving'
  | 'dashboard.availability.days.monday'
  | 'dashboard.availability.days.tuesday'
  | 'dashboard.availability.days.wednesday'
  | 'dashboard.availability.days.thursday'
  | 'dashboard.availability.days.friday'
  | 'dashboard.availability.days.saturday'
  | 'dashboard.availability.days.sunday'
  | 'dashboard.sessions.upcoming.title'
  | 'dashboard.sessions.upcoming.count'
  | 'dashboard.sessions.upcoming.none'
  | 'dashboard.sessions.past.title'
  | 'dashboard.sessions.past.count'
  | 'dashboard.sessions.past.none'
  | 'dashboard.sessions.with'
  | 'dashboard.sessions.topics'
  | 'dashboard.sessions.icebreaker'
  | 'dashboard.sessions.rate'
  | 'dashboard.sessions.cancel'
  | 'dashboard.sessions.reason'
  | 'dashboard.reviews.received.title'
  | 'dashboard.reviews.received.count'
  | 'dashboard.reviews.received.none'
  | 'dashboard.reviews.received.from'
  | 'dashboard.reviews.given.title'
  | 'dashboard.reviews.given.count'
  | 'dashboard.reviews.given.none'
  | 'dashboard.reviews.given.for'
  | 'dashboard.cancel.title'
  | 'dashboard.cancel.confirm'
  | 'dashboard.cancel.reasonLabel'
  | 'dashboard.cancel.reasonPlaceholder'
  | 'dashboard.cancel.reasonOptional'
  | 'dashboard.cancel.policy'
  | 'dashboard.cancel.policy24h'
  | 'dashboard.cancel.policyNotify'
  | 'dashboard.cancel.policyAvailable'
  | 'dashboard.cancel.warning'
  | 'dashboard.cancel.keep'
  | 'dashboard.cancel.cancelling'
  | 'dashboard.cancel.confirmButton'

  // Speaker Signup
  | 'speakerSignup.title'
  | 'speakerSignup.tagline'
  | 'speakerSignup.accountSetup'
  | 'speakerSignup.step'
  | 'speakerSignup.back'
  | 'speakerSignup.step1.title'
  | 'speakerSignup.step1.description'
  | 'speakerSignup.step1.firstName'
  | 'speakerSignup.step1.firstNamePlaceholder'
  | 'speakerSignup.step1.lastName'
  | 'speakerSignup.step1.lastNamePlaceholder'
  | 'speakerSignup.step1.email'
  | 'speakerSignup.step1.emailPlaceholder'
  | 'speakerSignup.step1.mail'
  | 'speakerSignup.step1.validate.firstNameRequired'
  | 'speakerSignup.step1.validate.firstNameMin'
  | 'speakerSignup.step1.validate.firstNameInvalid'
  | 'speakerSignup.step1.validate.lastNameRequired'
  | 'speakerSignup.step1.validate.lastNameMin'
  | 'speakerSignup.step1.validate.lastNameInvalid'
  | 'speakerSignup.step1.validate.emailRequired'
  | 'speakerSignup.step1.validate.emailInvalid'
  | 'speakerSignup.step2.title'
  | 'speakerSignup.step2.description'
  | 'speakerSignup.step2.selected'
  | 'speakerSignup.step3.title'
  | 'speakerSignup.step3.description'
  | 'speakerSignup.step3.mornings'
  | 'speakerSignup.step3.afternoon'
  | 'speakerSignup.step3.nights'
  | 'speakerSignup.step3.other'
  | 'speakerSignup.step4.title'
  | 'speakerSignup.step4.description'
  | 'speakerSignup.step4.selectImage'
  | 'speakerSignup.step5.title'
  | 'speakerSignup.step5.description'
  | 'speakerSignup.step5.password'
  | 'speakerSignup.step5.passwordPlaceholder'
  | 'speakerSignup.step5.confirmPassword'
  | 'speakerSignup.step5.confirmPasswordPlaceholder'
  | 'speakerSignup.step5.hint'
  | 'speakerSignup.step5.validate.passwordRequired'
  | 'speakerSignup.step5.validate.passwordMin'
  | 'speakerSignup.step5.validate.passwordLetter'
  | 'speakerSignup.step5.validate.passwordNumber'
  | 'speakerSignup.step5.validate.confirmRequired'
  | 'speakerSignup.step5.validate.passwordsMatch'
  | 'speakerSignup.skip'
  | 'speakerSignup.next'
  | 'speakerSignup.createAccount'
  | 'speakerSignup.creating'
  | 'speakerSignup.error.passwordsMatch'
  | 'speakerSignup.error.createFailed'
  | 'speakerSignup.hasAccount'
  | 'speakerSignup.login'

  // Learner Dashboard
  | 'learnerDashboard.title'
  | 'learnerDashboard.subtitle'
  | 'learnerDashboard.errors.loginRequired'
  | 'learnerDashboard.errors.loadFailed'
  | 'learnerDashboard.errors.saveFailed'
  | 'learnerDashboard.errors.avatarFailed'
  | 'learnerDashboard.errors.cancelFailed'
  | 'learnerDashboard.profile.title'
  | 'learnerDashboard.profile.description'
  | 'learnerDashboard.profile.firstName'
  | 'learnerDashboard.profile.firstNamePlaceholder'
  | 'learnerDashboard.profile.lastName'
  | 'learnerDashboard.profile.lastNamePlaceholder'
  | 'learnerDashboard.profile.bio'
  | 'learnerDashboard.profile.bioPlaceholder'
  | 'learnerDashboard.profile.noBio'
  | 'learnerDashboard.profile.save'
  | 'learnerDashboard.profile.saving'
  | 'learnerDashboard.profile.upcoming'
  | 'learnerDashboard.profile.completed'
  | 'learnerDashboard.sessions.upcoming.title'
  | 'learnerDashboard.sessions.upcoming.count'
  | 'learnerDashboard.sessions.upcoming.none'
  | 'learnerDashboard.sessions.upcoming.with'
  | 'learnerDashboard.sessions.upcoming.topics'
  | 'learnerDashboard.sessions.upcoming.icebreaker'
  | 'learnerDashboard.sessions.upcoming.join'
  | 'learnerDashboard.sessions.upcoming.cancel'
  | 'learnerDashboard.sessions.past.title'
  | 'learnerDashboard.sessions.past.count'
  | 'learnerDashboard.sessions.past.none'
  | 'learnerDashboard.sessions.past.with'
  | 'learnerDashboard.sessions.past.rate'
  | 'learnerDashboard.sessions.past.cancellationReason'
  | 'learnerDashboard.cancel.title'
  | 'learnerDashboard.cancel.policy'
  | 'learnerDashboard.cancel.policy24h'
  | 'learnerDashboard.cancel.policyHoursAway'
  | 'learnerDashboard.cancel.policyLessThanHour'
  | 'learnerDashboard.cancel.policyMayNotEligible'
  | 'learnerDashboard.cancel.policyNotify'
  | 'learnerDashboard.cancel.sessionDetails'
  | 'learnerDashboard.cancel.reasonLabel'
  | 'learnerDashboard.cancel.reasonPlaceholder'
  | 'learnerDashboard.cancel.keep'
  | 'learnerDashboard.cancel.cancelling'
  | 'learnerDashboard.cancel.confirm'

  // Speaker Profile/Detail Page
  | 'speakerProfile.backToSpeakers'
  | 'speakerProfile.notFound'
  | 'speakerProfile.reviews'
  | 'speakerProfile.review'
  | 'speakerProfile.sessions'
  | 'speakerProfile.completed'
  | 'speakerProfile.new'
  | 'speakerProfile.about'
  | 'speakerProfile.topicsInterests'
  | 'speakerProfile.bookSession'
  | 'speakerProfile.bookSession.title'
  | 'speakerProfile.bookSession.success.title'
  | 'speakerProfile.bookSession.success.message'
  | 'speakerProfile.bookSession.availability'
  | 'speakerProfile.bookSession.notAvailable'
  | 'speakerProfile.bookSession.sessionTitle'
  | 'speakerProfile.bookSession.sessionTitlePlaceholder'
  | 'speakerProfile.bookSession.date'
  | 'speakerProfile.bookSession.dateAvailable'
  | 'speakerProfile.bookSession.dateNotAvailable'
  | 'speakerProfile.bookSession.time'
  | 'speakerProfile.bookSession.timeHint'
  | 'speakerProfile.bookSession.topics'
  | 'speakerProfile.bookSession.topic1'
  | 'speakerProfile.bookSession.topic2'
  | 'speakerProfile.bookSession.topicsMax'
  | 'speakerProfile.bookSession.allFieldsRequired'
  | 'speakerProfile.bookSession.maxTopics'
  | 'speakerProfile.bookSession.confirmBooking'
  | 'speakerProfile.bookSession.booking'
  | 'speakerProfile.bookSession.failed'
  | 'speakerProfile.bookSession.unavailableDay'
  | 'speakerProfile.bookSession.timeNotInRange'
  | 'speakerProfile.bookSession.anonymous'
  | 'speakerProfile.bookSession.noReviews'

  // About Page
  | 'about.hero.badge'
  | 'about.hero.title'
  | 'about.hero.subtitle'
  | 'about.story.title'
  | 'about.story.p1'
  | 'about.story.p2'
  | 'about.mission.title'
  | 'about.mission.p1'
  | 'about.mission.point1'
  | 'about.mission.point2'
  | 'about.mission.point3'
  | 'about.mission.cards.warm.title'
  | 'about.mission.cards.warm.description'
  | 'about.mission.cards.diverse.title'
  | 'about.mission.cards.diverse.description'
  | 'about.mission.cards.flexible.title'
  | 'about.mission.cards.flexible.description'
  | 'about.community.badge'
  | 'about.community.title'
  | 'about.community.subtitle'
  | 'about.community.card1.title'
  | 'about.community.card1.subtitle'
  | 'about.community.card2.title'
  | 'about.community.card2.subtitle'
  | 'about.community.card3.title'
  | 'about.community.card3.subtitle'
  | 'about.community.card4.title'
  | 'about.community.card4.subtitle'
  | 'about.faq.title'
  | 'about.faq.q1'
  | 'about.faq.a1'
  | 'about.faq.q2'
  | 'about.faq.a2'
  | 'about.faq.q3'
  | 'about.faq.a3'
  | 'about.faq.q4'
  | 'about.faq.a4'
  | 'about.faq.q5'
  | 'about.faq.a5'
  | 'about.faq.more'
  | 'about.cta.title'
  | 'about.cta.subtitle'
  | 'about.cta.button'

export type Translations = Record<TranslationKey, string>;

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    'header.home': 'Home',
    'header.nosotros': 'About Us',
    'header.dashboard': 'Dashboard',
    'header.speakerDashboard': 'Speaker Dashboard',
    'header.speakers': 'Speakers',
    'header.login': 'Sign In',
    'header.signup': 'Sign Up',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.discover': 'Discover',
    'header.speaker': 'Speaker',
    'header.loginStudent': 'Student',
    'header.loginSpeaker': 'Speaker',
    
    // Home Page
    'home.badge': 'Never stop learning',
    'home.title.line1': 'Practice your English by connecting',
    'home.title.line2': 'with people who have',
    'home.title.line3': 'a lot to share',
    'home.cta.explore': 'Explore Speakers',
    'home.reviews': '( 10k+ Reviews )',
    'home.popularSpeakers': 'Popular Speakers',
    'home.popularSpeakersDesc': 'Improve your speaking while chatting with a senior native language speaker',
    'home.filter.all': 'All',
    'home.filter.literature': 'Literature',
    'home.filter.architecture': 'Architecture',
    'home.filter.engineering': 'Engineering',
    'home.filter.business': 'Business',
    'home.filter.cooking': 'Cooking',
    'home.viewAll': 'View All',
    'home.howItWorks.badge': 'Practice your speaking',
    'home.howItWorks.title': 'How does it work?',
    'home.howItWorks.step1': 'Choose your Speaker: Explore their profiles.',
    'home.howItWorks.step2': 'Select date and time.',
    'home.howItWorks.step3': 'Practice and Connect: Enjoy authentic conversation.',
    'home.howItWorks.step4': 'The speakers have chosen their most favorite topics.',
    'home.whyDifferent.badge': 'You contribute while learning',
    'home.whyDifferent.title': 'Why Aurora is different',
    'home.whyDifferent.point1': 'You learn with purpose: Your practice helps reduce loneliness in seniors and makes them feel useful.',
    'home.whyDifferent.point2': 'Real conversations: No scripts, just people and genuine moments.',
    'home.whyDifferent.point3': 'Mutual impact: They help you improve your English, you give them company and connection.',
    'home.becomeSpeaker.title': 'Become a',
    'home.becomeSpeaker.titleSpeaker': 'speaker',
    'home.becomeSpeaker.point1': 'Register as a speaker.',
    'home.becomeSpeaker.point2': 'Define your available schedules.',
    'home.becomeSpeaker.point3': 'Start conversing and sharing stories.',
    'home.becomeSpeaker.cta': 'BECOME A SPEAKER',
    'home.hero.subtitle': 'Practice your English by connecting with people who have a lot to share.',
    'home.becomeSpeaker.subtitle': 'Share your stories, connect with eager learners, and make a meaningful impact.',
    'home.becomeSpeaker.steps.step1.label': 'Step 1',
    'home.becomeSpeaker.steps.step2.label': 'Step 2',
    'home.becomeSpeaker.steps.step3.label': 'Step 3',
    'home.speakerCard.age': 'years old',
    'home.speakerCard.book': 'Book',
    'home.speakerCard.free': 'Free',
    'home.footer.links': 'Links',
    'home.footer.terms': 'Terms and Conditions',
    'home.footer.privacy': 'Privacy Policy',
    'home.footer.copyright': '© 2025 Aurora. All rights reserved',
    
    // Auth
    'auth.signup.title': 'Aurora',
    'auth.signup.createAccount': 'Create Account',
    'auth.signup.google': 'Sign up with Google',
    'auth.signup.facebook': 'Sign up with Facebook',
    'auth.signup.or': '- OR -',
    'auth.signup.firstName': 'First Name',
    'auth.signup.lastName': 'Last Name',
    'auth.signup.email': 'Email Address',
    'auth.signup.password': 'Password',
    'auth.signup.submit': 'Create Account',
    'auth.signup.loading': 'Creating account...',
    'auth.signup.hasAccount': 'Already have an account?',
    'auth.signup.login': 'Log in',
    'auth.signup.validate.firstNameRequired': 'First name is required',
    'auth.signup.validate.firstNameMin': 'First name must be at least 2 characters',
    'auth.signup.validate.firstNameInvalid': 'First name can only contain letters, spaces, hyphens, and apostrophes',
    'auth.signup.validate.lastNameRequired': 'Last name is required',
    'auth.signup.validate.lastNameMin': 'Last name must be at least 2 characters',
    'auth.signup.validate.lastNameInvalid': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    'auth.signup.validate.emailRequired': 'Email is required',
    'auth.signup.validate.emailInvalid': 'Please enter a valid email address',
    'auth.signup.validate.passwordRequired': 'Password is required',
    'auth.signup.validate.passwordMin': 'Password must be at least 8 characters',
    'auth.signup.validate.passwordLetter': 'Password must contain at least one letter',
    'auth.signup.validate.passwordNumber': 'Password must contain at least one number',
    'auth.signup.validate.termsRequired': 'You must accept the Terms and Conditions and Privacy Policy to continue',
    'auth.signup.termsText': 'I have read and accept the',
    'auth.signup.termsLink': 'Terms and Conditions',
    'auth.signup.termsAnd': 'and the',
    'auth.signup.privacyLink': 'Privacy Policy',
    'auth.terms.modal.title': 'Terms and Privacy Policy Acceptance Required',
    'auth.terms.modal.description': 'To continue using Aurora, please review and accept our Terms and Conditions and Privacy Policy.',
    'auth.terms.modal.content': 'As a new requirement, all users (including existing users) must accept our updated Terms and Conditions and Privacy Policy to continue using the platform. Please read the documents carefully and accept them below.',
    'auth.terms.modal.accept': 'Accept and Continue',
    'auth.terms.modal.accepting': 'Accepting...',
    'auth.terms.error': 'Failed to accept terms. Please try again.',
    'auth.common.back': 'Back',
    'auth.common.continue': 'Continue',
    'auth.common.select': 'Select',
    'auth.common.fullName': 'Full Name',
    'auth.common.fullNamePlaceholder': 'Enter your full name',
    'auth.common.emailPlaceholder': 'Enter your email address',
    'auth.common.passwordPlaceholder': 'Enter your password',
    'auth.common.passwordCreatePlaceholder': 'Create a secure password',
    'auth.errors.loginFailed': 'We could not sign you in',
    'auth.errors.loginUnknown': 'Something went wrong while signing in',
    'auth.errors.registerFailed': 'We could not complete the registration',
    'auth.validation.fullNameRequired': 'Full name is required',
    'auth.validation.emailRequired': 'Email is required',
    'auth.validation.emailInvalid': 'Please enter a valid email address',
    'auth.validation.passwordRequired': 'Password is required',
    'auth.validation.gmailRequired': 'Please use a Gmail account (@gmail.com)',
    'auth.validation.birthDateRequired': 'Birth date is required',
    'auth.validation.cityRequired': 'City is required',
    'auth.validation.bioRequired': 'A short description is required',
    'auth.validation.photoRequired': 'Please upload a photo',
    'auth.student.title': 'Learner',
    'auth.student.subtitle': 'Sign in or create your account',
    'auth.student.login.submitting': 'Signing in...',
    'auth.student.register.submit': 'Continue',
    'auth.speaker.title': 'Speaker',
    'auth.speaker.subtitle': 'Sign in or create your speaker account',
    'auth.speaker.login.submitting': 'Signing in...',
    'auth.speaker.register.step1.emailLabel': 'Email (Gmail)',
    'auth.speaker.register.step1.emailPlaceholder': 'example@gmail.com',
    'auth.speaker.register.step1.emailHint': 'Must be a Gmail account (@gmail.com)',
    'auth.speaker.register.step1.submit': 'Continue',
    'auth.speaker.register.step2.birthDateLabel': 'Birth date',
    'auth.speaker.register.step2.cityLabel': 'City of residence',
    'auth.speaker.register.step2.cityPlaceholder': 'e.g. Miami, FL',
    'auth.speaker.register.step2.bioLabel': 'Short description',
    'auth.speaker.register.step2.bioPlaceholder': 'Tell us a little about yourself...',
    'auth.speaker.register.step2.photoLabel': 'Photo',
    'auth.speaker.register.step2.photoUpload': 'Upload photo',
    'auth.speaker.register.step2.photoHint': 'JPG or PNG, up to 5MB.',
    'auth.speaker.register.step2.photoSelect': 'Choose file',
    'auth.speaker.register.step2.back': 'Back',
    'auth.speaker.register.step2.submit': 'Create Account',
    'auth.speaker.register.step2.submitting': 'Creating account...',
    
    // Terms and Conditions Page
    'terms.title': 'Terms and Conditions of Use – Aurora',
    'terms.section1.title': '1. Acceptance of the Terms',
    'terms.section1.paragraph1': 'By accessing or using the Aurora platform (hereinafter, “the Platform”), the user agrees to comply with and be legally bound by these Terms and Conditions of Use. If you do not agree, you must refrain from using the Platform.',
    'terms.section2.title': '2. Description of the Service',
    'terms.section2.paragraph1': 'Aurora is a digital platform that connects advanced English students with older adults in order to encourage language practice through virtual conversations.',
    'terms.section2.paragraph2': 'Aurora does not provide formal educational or therapeutic services and does not guarantee academic or personal outcomes.',
    'terms.section3.title': '3. User Registration',
    'terms.section3.paragraph1': 'To access the Platform, the user must provide truthful, complete, and updated information. The user is responsible for maintaining the confidentiality of their access credentials and for all activities carried out under their account.',
    'terms.section4.title': '4. User Conduct',
    'terms.section4.intro': 'The user agrees to:',
    'terms.section4.item1': 'Maintain respectful and appropriate behavior during conversations.',
    'terms.section4.item2': 'Avoid harassing, discriminating, spreading hate, or sharing inappropriate content.',
    'terms.section4.item3': 'Refrain from using the Platform for commercial, political, religious, or unlawful purposes.',
    'terms.section4.paragraph1': 'Aurora reserves the right to suspend or delete accounts that violate these rules without prior notice.',
    'terms.section5.title': '5. Limitation of Liability',
    'terms.section5.paragraph1': 'Aurora acts solely as a technological intermediary between users.',
    'terms.section5.intro': 'Aurora is not responsible for:',
    'terms.section5.item1': 'The content or accuracy of conversations held between users.',
    'terms.section5.item2': 'Damages, losses, or incidents arising from user interactions inside or outside the Platform.',
    'terms.section5.item3': 'Technical failures, service interruptions, or data loss.',
    'terms.section5.paragraph2': 'Use of the Platform is undertaken at the exclusive responsibility of the user.',
    'terms.section6.title': '6. Protection of Personal Data',
    'terms.section6.part1': 'Aurora collects and processes personal data in accordance with its',
    'terms.section6.link1': 'Privacy Notice',
    'terms.section6.part2': 'available at',
    'terms.section6.link2': 'this link',
    'terms.section6.paragraph2': 'The user accepts this processing for operational purposes and to improve the service.',
    'terms.section7.title': '7. Intellectual Property',
    'terms.section7.paragraph1': 'All content on the Platform (name, logo, design, text, code, databases, and features) is the exclusive property of Aurora or is used under the appropriate licenses. Copying, modifying, or distributing such content without express authorization is prohibited.',
    'terms.section8.title': '8. Third-Party Links',
    'terms.section8.paragraph1': 'Aurora may contain links to third-party sites. We are not responsible for the content, policies, or practices of those external sites.',
    'terms.section9.title': '9. Modifications',
    'terms.section9.paragraph1': 'Aurora may modify these Terms and Conditions at any time. Changes will take effect once they are published on the Platform.',
    'terms.section10.title': '10. Governing Law',
    'terms.section10.paragraph1': 'These Terms are governed by the laws of the United Mexican States, and any dispute will be submitted to the competent courts of Mexico City, waiving any other jurisdiction that may correspond.',
    
    // Privacy Policy Page
    'privacy.title': 'Privacy Notice – Aurora',
    'privacy.lastUpdated': 'Last updated: October 19, 2025',
    'privacy.section1.title': '1. Identity and Contact of the Controller',
    'privacy.section1.paragraph1.part1': 'This Privacy Notice corresponds to Aurora, a digital initiative accessible from',
    'privacy.section1.paragraph1.link': 'https://weareaurora.tech',
    'privacy.section1.paragraph1.part2': '(hereinafter, “the Platform”), dedicated to connecting English learners with older adults to promote language practice and intergenerational connection.',
    'privacy.section1.paragraph2': 'Aurora is not yet incorporated as a legal entity; it currently operates as a project in development.',
    'privacy.section1.paragraph3': 'For any question or request related to the protection of personal data, you can contact us at:',
    'privacy.section1.emailLabel': '📩',
    'privacy.section1.emailText': 'weareaurora.tech@gmail.com',
    'privacy.section2.title': '2. Personal Data Collected',
    'privacy.section2.paragraph1': 'Aurora may collect the following personal data from users (students and older adults):',
    'privacy.section2.item1': 'First and last name',
    'privacy.section2.item2': 'Age or age range',
    'privacy.section2.item3': 'Email address',
    'privacy.section2.item4': 'Country or city of residence',
    'privacy.section2.item5': 'English level or native language',
    'privacy.section2.item6': 'Schedule preferences or interests',
    'privacy.section2.item7': 'Image, voice, or video (when videoconferencing or recording tools are used)',
    'privacy.section2.item8': 'Technical information (IP address, device, browser, cookies)',
    'privacy.section2.note': 'Aurora does not request or store financial or medical information.',
    'privacy.section3.title': '3. Purposes of Processing',
    'privacy.section3.paragraph1': 'Personal data are used for the following purposes:',
    'privacy.section3.primaryHeading': 'Primary purposes:',
    'privacy.section3.primaryItem1': 'Enable registration and access to the Platform.',
    'privacy.section3.primaryItem2': 'Facilitate the connection between students and older adults.',
    'privacy.section3.primaryItem3': 'Manage and improve the user experience.',
    'privacy.section3.primaryItem4': 'Monitor compliance with community guidelines.',
    'privacy.section3.secondaryHeading': 'Secondary (optional) purposes:',
    'privacy.section3.secondaryItem1': 'Send notifications about project updates or improvements.',
    'privacy.section3.secondaryItem2': 'Conduct satisfaction surveys or analyses.',
    'privacy.section3.paragraph2.part1': 'Users may object to the secondary purposes by sending an email to',
    'privacy.section3.paragraph2.link': 'contact@weareaurora.tech',
    'privacy.section3.paragraph2.part2': '.',
    'privacy.section4.title': '4. Data Transfers',
    'privacy.section4.paragraph1': 'Aurora does not share, sell, or rent personal data to third parties.',
    'privacy.section4.paragraph2': 'However, it may rely on technology providers (such as hosting or videoconferencing services) that process the data solely for operational purposes and under appropriate security measures.',
    'privacy.section5.title': '5. Recordings and Use of Image',
    'privacy.section5.paragraph1': 'If sessions or video calls are recorded, users will be notified in advance and may grant or deny their consent.',
    'privacy.section5.paragraph2': 'Recordings will be used only for improvement, supervision, or internal evaluation purposes and will be deleted within a reasonable period.',
    'privacy.section6.title': '6. ARCO Rights',
    'privacy.section6.paragraph1': 'Users may exercise their rights of Access, Rectification, Cancellation, and Opposition (ARCO), as well as revoke their consent for data processing, by sending a request to:',
    'privacy.section6.emailLabel': '📧',
    'privacy.section6.emailText': 'contact@weareaurora.tech',
    'privacy.section6.paragraph2': 'Aurora will respond within a maximum of 20 business days.',
    'privacy.section7.title': '7. Information Security',
    'privacy.section7.paragraph1': 'Aurora applies reasonable technical and administrative security measures to protect personal data against loss, alteration, or unauthorized access.',
    'privacy.section7.paragraph2': 'However, the user acknowledges that no system is completely infallible and uses the Platform at their own risk.',
    'privacy.section8.title': '8. Data Retention',
    'privacy.section8.paragraph1': 'Personal data will be kept only for the time necessary to fulfill the described purposes or until the user requests their deletion.',
    'privacy.section9.title': '9. Modifications',
    'privacy.section9.paragraph1': 'Aurora may update this Privacy Notice whenever necessary.',
    'privacy.section9.paragraph2.part1': 'Changes will be published on',
    'privacy.section9.paragraph2.link': 'https://weareaurora.tech',
    'privacy.section9.paragraph2.part2': 'with the corresponding update date.',
    'privacy.section10.title': '10. Acceptance',
    'privacy.section10.paragraph1': 'By registering for or using the Platform, the user acknowledges having read and accepted this Privacy Notice.',
    
    'auth.signin.title': 'Aurora',
    'auth.signin.email': 'Email Address',
    'auth.signin.password': 'Password',
    'auth.signin.submit': 'Sign In',
    'auth.signin.loading': 'Signing in...',
    'auth.signin.noAccount': "Don't have an account?",
    'auth.signin.signup': 'Sign up',
    'auth.roleSelection.title': 'Sign in to view your profile',
    'auth.roleSelection.subtitle': 'Create an account or sign in to book sessions, manage your schedule, and connect with speakers.',
    'auth.roleSelection.student': 'Sign In as Student',
    'auth.roleSelection.speaker': 'Sign In as Speaker',
    
    // Speakers Page
    'speakers.title': 'Find Your Perfect Speaker',
    'speakers.subtitle': 'Connect with native speakers to practice and improve your language skills',
    'speakers.search.placeholder': 'Search by speaker name...',
    'speakers.filter.title': 'Filter by Topic',
    'speakers.filter.allTopics': 'All Topics',
    'speakers.filter.business': 'Business',
    'speakers.filter.technology': 'Technology',
    'speakers.filter.health': 'Health',
    'speakers.filter.education': 'Education',
    'speakers.filter.arts': 'Arts',
    'speakers.filter.sports': 'Sports',
    'speakers.filter.travel': 'Travel',
    'speakers.filter.food': 'Food',
    'speakers.filter.science': 'Science',
    'speakers.filter.entertainment': 'Entertainment',
    'speakers.results.count': 'speaker found',
    'speakers.results.countPlural': 'speakers found',
    'speakers.card.new': 'New',
    'speakers.card.reviews': 'reviews',
    'speakers.card.sessions': 'completed sessions',
    'speakers.noResults': 'No speakers found matching your criteria.',
    'speakers.clearFilters': 'Clear Filters',
    'speakers.noResults.title': 'No speakers found',
    'speakers.noResults.description': 'Try adjusting your search or explore other topics to discover more voices.',
    'speakers.noResults.reset': 'Clear Search',
    'speakers.card.book': 'Book Session',
    
    // Speaker Dashboard
    'dashboard.title': 'Speaker Dashboard',
    'dashboard.subtitle': 'Manage your sessions, reviews, and profile',
    'dashboard.errors.loginRequired': 'Please log in to access your dashboard',
    'dashboard.errors.loadFailed': 'Failed to load dashboard data',
    'dashboard.errors.saveFailed': 'Failed to save profile',
    'dashboard.errors.availabilityFailed': 'Failed to save availability',
    'dashboard.errors.avatarFailed': 'Failed to upload avatar',
    'dashboard.errors.cancelFailed': 'Failed to cancel session',
    'dashboard.errors.calendarInitFailed': 'Failed to initiate Google Calendar connection',
    'dashboard.errors.calendarConnectFailed': 'Failed to connect Google Calendar',
    'dashboard.errors.calendarDisconnectFailed': 'Failed to disconnect Google Calendar',
    'dashboard.profile.title': 'Profile',
    'dashboard.profile.description': 'Manage your profile information',
    'dashboard.profile.bio': 'Bio',
    'dashboard.profile.bioPlaceholder': 'Tell us about yourself...',
    'dashboard.profile.noBio': 'No bio available',
    'dashboard.profile.save': 'Save Changes',
    'dashboard.profile.saving': 'Saving...',
    'dashboard.calendar.title': 'Google Calendar',
    'dashboard.calendar.description': 'Connect your calendar to automatically create events',
    'dashboard.calendar.connected': 'Calendar Connected',
    'dashboard.calendar.expires': 'Expires:',
    'dashboard.calendar.notConnected': 'Your calendar is not connected',
    'dashboard.calendar.notConnectedDesc': 'Connect your Google Calendar to automatically create events when learners book sessions with you.',
    'dashboard.calendar.connect': 'Connect Google Calendar',
    'dashboard.calendar.connecting': 'Connecting...',
    'dashboard.calendar.disconnect': 'Disconnect',
    'dashboard.calendar.disconnecting': 'Disconnecting...',
    'dashboard.availability.title': 'Availability',
    'dashboard.availability.description': 'Set your available days and hours',
    'dashboard.availability.daysActive': 'days active',
    'dashboard.availability.to': 'to',
    'dashboard.availability.save': 'Save Availability',
    'dashboard.availability.saving': 'Saving...',
    'dashboard.availability.days.monday': 'Monday',
    'dashboard.availability.days.tuesday': 'Tuesday',
    'dashboard.availability.days.wednesday': 'Wednesday',
    'dashboard.availability.days.thursday': 'Thursday',
    'dashboard.availability.days.friday': 'Friday',
    'dashboard.availability.days.saturday': 'Saturday',
    'dashboard.availability.days.sunday': 'Sunday',
    'dashboard.sessions.upcoming.title': 'Upcoming Sessions',
    'dashboard.sessions.upcoming.count': 'sessions scheduled',
    'dashboard.sessions.upcoming.none': 'No upcoming sessions',
    'dashboard.sessions.past.title': 'Past Sessions',
    'dashboard.sessions.past.count': 'completed and cancelled sessions',
    'dashboard.sessions.past.none': 'No past sessions',
    'dashboard.sessions.with': 'with',
    'dashboard.sessions.topics': 'Topics:',
    'dashboard.sessions.icebreaker': '💡 Icebreaker',
    'dashboard.sessions.rate': 'Rate',
    'dashboard.sessions.cancel': 'Cancel Session',
    'dashboard.sessions.reason': 'Reason:',
    'dashboard.reviews.received.title': 'Reviews Received',
    'dashboard.reviews.received.count': 'reviews',
    'dashboard.reviews.received.none': 'No reviews yet',
    'dashboard.reviews.received.from': 'from',
    'dashboard.reviews.given.title': 'Reviews Given',
    'dashboard.reviews.given.count': 'reviews',
    'dashboard.reviews.given.none': 'No reviews yet',
    'dashboard.reviews.given.for': 'for',
    'dashboard.cancel.title': 'Cancel Session',
    'dashboard.cancel.confirm': 'Are you sure you want to cancel this session?',
    'dashboard.cancel.reasonLabel': 'Cancellation Reason',
    'dashboard.cancel.reasonPlaceholder': 'Please provide a reason for cancellation (optional)...',
    'dashboard.cancel.reasonOptional': '(optional)',
    'dashboard.cancel.policy': 'Cancellation Policy:',
    'dashboard.cancel.policy24h': 'Sessions must be cancelled at least 24 hours before the scheduled time',
    'dashboard.cancel.policyNotify': 'The learner will be automatically notified',
    'dashboard.cancel.policyAvailable': 'This time slot will become available again for booking',
    'dashboard.cancel.warning': 'Warning: This session is less than 24 hours away. Cancellation may still be allowed but the learner may not have adequate notice.',
    'dashboard.cancel.keep': 'Keep Session',
    'dashboard.cancel.cancelling': 'Cancelling...',
    'dashboard.cancel.confirmButton': 'Cancel Session',

    // Speaker Signup
    'speakerSignup.title': 'Aurora',
    'speakerSignup.tagline': 'Happy & Fluent',
    'speakerSignup.accountSetup': 'Account set up',
    'speakerSignup.step': '/',
    'speakerSignup.back': 'Back',
    'speakerSignup.step1.title': 'Tell us a bit about you',
    'speakerSignup.step1.description': 'That will help us better account setup for you.',
    'speakerSignup.step1.firstName': 'First name',
    'speakerSignup.step1.firstNamePlaceholder': 'First name',
    'speakerSignup.step1.lastName': 'Last name',
    'speakerSignup.step1.lastNamePlaceholder': 'Last name',
    'speakerSignup.step1.email': 'Email address',
    'speakerSignup.step1.emailPlaceholder': 'Email address',
    'speakerSignup.step1.mail': 'Mail',
    'speakerSignup.step1.validate.firstNameRequired': 'First name is required',
    'speakerSignup.step1.validate.firstNameMin': 'First name must be at least 2 characters',
    'speakerSignup.step1.validate.firstNameInvalid': 'First name can only contain letters',
    'speakerSignup.step1.validate.lastNameRequired': 'Last name is required',
    'speakerSignup.step1.validate.lastNameMin': 'Last name must be at least 2 characters',
    'speakerSignup.step1.validate.lastNameInvalid': 'Last name can only contain letters',
    'speakerSignup.step1.validate.emailRequired': 'Email is required',
    'speakerSignup.step1.validate.emailInvalid': 'Please enter a valid email address',
    'speakerSignup.step2.title': 'What topics do you like?',
    'speakerSignup.step2.description': 'Select up to 4 topics you\'re interested in',
    'speakerSignup.step2.selected': 'Selected:',
    'speakerSignup.step3.title': 'When do you prefer to meet?',
    'speakerSignup.step3.description': 'Select your preferred meeting time',
    'speakerSignup.step3.mornings': 'Mornings',
    'speakerSignup.step3.afternoon': 'Afternoon',
    'speakerSignup.step3.nights': 'Nights',
    'speakerSignup.step3.other': 'Other',
    'speakerSignup.step4.title': 'Choose your avatar',
    'speakerSignup.step4.description': 'Please share your profile picture',
    'speakerSignup.step4.selectImage': 'Select image',
    'speakerSignup.step5.title': 'Set up your password',
    'speakerSignup.step5.description': 'Create a secure password to complete your account.',
    'speakerSignup.step5.password': 'Password',
    'speakerSignup.step5.passwordPlaceholder': 'Password',
    'speakerSignup.step5.confirmPassword': 'Confirm Password',
    'speakerSignup.step5.confirmPasswordPlaceholder': 'Confirm password',
    'speakerSignup.step5.hint': 'Must be at least 8 characters with letters and numbers',
    'speakerSignup.step5.validate.passwordRequired': 'Password is required',
    'speakerSignup.step5.validate.passwordMin': 'Password must be at least 8 characters',
    'speakerSignup.step5.validate.passwordLetter': 'Password must contain at least one letter',
    'speakerSignup.step5.validate.passwordNumber': 'Password must contain at least one number',
    'speakerSignup.step5.validate.confirmRequired': 'Please confirm your password',
    'speakerSignup.step5.validate.passwordsMatch': 'Passwords do not match',
    'speakerSignup.skip': 'Skip',
    'speakerSignup.next': 'Next',
    'speakerSignup.createAccount': 'Create Account',
    'speakerSignup.creating': 'Creating account...',
    'speakerSignup.error.passwordsMatch': 'Passwords do not match',
    'speakerSignup.error.createFailed': 'Failed to create account. Please try again.',
    'speakerSignup.hasAccount': 'Already have an account?',
    'speakerSignup.login': 'Log in',

    // Learner Dashboard
    'learnerDashboard.title': 'Learner Dashboard',
    'learnerDashboard.subtitle': 'Manage your learning sessions and track your progress',
    'learnerDashboard.errors.loginRequired': 'Please log in to access your dashboard',
    'learnerDashboard.errors.loadFailed': 'Failed to load dashboard data',
    'learnerDashboard.errors.saveFailed': 'Failed to save profile',
    'learnerDashboard.errors.avatarFailed': 'Failed to upload avatar',
    'learnerDashboard.errors.cancelFailed': 'Failed to cancel session',
    'learnerDashboard.profile.title': 'Profile',
    'learnerDashboard.profile.description': 'Your personal information',
    'learnerDashboard.profile.firstName': 'First Name',
    'learnerDashboard.profile.firstNamePlaceholder': 'First name',
    'learnerDashboard.profile.lastName': 'Last Name',
    'learnerDashboard.profile.lastNamePlaceholder': 'Last name',
    'learnerDashboard.profile.bio': 'Bio',
    'learnerDashboard.profile.bioPlaceholder': 'Tell us about yourself...',
    'learnerDashboard.profile.noBio': 'No bio available',
    'learnerDashboard.profile.save': 'Save Changes',
    'learnerDashboard.profile.saving': 'Saving...',
    'learnerDashboard.profile.upcoming': 'Upcoming',
    'learnerDashboard.profile.completed': 'Completed',
    'learnerDashboard.sessions.upcoming.title': 'Upcoming Sessions',
    'learnerDashboard.sessions.upcoming.count': 'sessions scheduled',
    'learnerDashboard.sessions.upcoming.none': 'No upcoming sessions',
    'learnerDashboard.sessions.upcoming.with': 'with',
    'learnerDashboard.sessions.upcoming.topics': 'Topics:',
    'learnerDashboard.sessions.upcoming.icebreaker': '💡 Icebreaker',
    'learnerDashboard.sessions.upcoming.join': 'Join Meeting →',
    'learnerDashboard.sessions.upcoming.cancel': 'Cancel',
    'learnerDashboard.sessions.past.title': 'Past Sessions & Reviews',
    'learnerDashboard.sessions.past.count': 'sessions completed',
    'learnerDashboard.sessions.past.none': 'No completed sessions yet',
    'learnerDashboard.sessions.past.with': 'with',
    'learnerDashboard.sessions.past.rate': 'Rate & Review',
    'learnerDashboard.sessions.past.cancellationReason': 'Cancellation reason:',
    'learnerDashboard.cancel.title': 'Cancel Session',
    'learnerDashboard.cancel.policy': 'Cancellation Policy',
    'learnerDashboard.cancel.policy24h': 'Sessions must be cancelled at least 24 hours before the scheduled time',
    'learnerDashboard.cancel.policyHoursAway': 'hours away',
    'learnerDashboard.cancel.policyLessThanHour': 'less than an hour away',
    'learnerDashboard.cancel.policyMayNotEligible': '(May not be eligible for cancellation)',
    'learnerDashboard.cancel.policyNotify': 'The speaker will be automatically notified of the cancellation',
    'learnerDashboard.cancel.sessionDetails': 'Session Details',
    'learnerDashboard.cancel.reasonLabel': 'Reason for Cancellation (Optional)',
    'learnerDashboard.cancel.reasonPlaceholder': 'Please let us know why you\'re cancelling...',
    'learnerDashboard.cancel.keep': 'Keep Session',
    'learnerDashboard.cancel.cancelling': 'Cancelling...',
    'learnerDashboard.cancel.confirm': 'Confirm Cancellation',

    // Speaker Profile/Detail Page
    'speakerProfile.backToSpeakers': 'Back to Speakers',
    'speakerProfile.notFound': 'Speaker not found',
    'speakerProfile.reviews': 'Reviews',
    'speakerProfile.review': 'review',
    'speakerProfile.sessions': 'Sessions',
    'speakerProfile.completed': 'Completed',
    'speakerProfile.new': 'New',
    'speakerProfile.about': 'About',
    'speakerProfile.topicsInterests': 'Topics & Interests',
    'speakerProfile.bookSession': 'Book a Session',
    'speakerProfile.bookSession.title': 'Book a Session',
    'speakerProfile.bookSession.success.title': 'Session Booked!',
    'speakerProfile.bookSession.success.message': 'Your session has been confirmed. Check your email for details.',
    'speakerProfile.bookSession.availability': 'Speaker Availability',
    'speakerProfile.bookSession.notAvailable': 'Not available',
    'speakerProfile.bookSession.sessionTitle': 'Session Title *',
    'speakerProfile.bookSession.sessionTitlePlaceholder': 'E.g., Practice Conversation',
    'speakerProfile.bookSession.date': 'Date *',
    'speakerProfile.bookSession.dateAvailable': 'Available:',
    'speakerProfile.bookSession.dateNotAvailable': 'Not available on this day',
    'speakerProfile.bookSession.time': 'Time *',
    'speakerProfile.bookSession.timeHint': 'Select time between',
    'speakerProfile.bookSession.topics': 'Topics (max 2, optional)',
    'speakerProfile.bookSession.topic1': 'Topic 1',
    'speakerProfile.bookSession.topic2': 'Topic 2',
    'speakerProfile.bookSession.topicsMax': '(30 min session)',
    'speakerProfile.bookSession.allFieldsRequired': 'Please fill in all required fields',
    'speakerProfile.bookSession.maxTopics': 'Maximum 2 topics allowed',
    'speakerProfile.bookSession.confirmBooking': 'Confirm Booking',
    'speakerProfile.bookSession.booking': 'Booking...',
    'speakerProfile.bookSession.failed': 'Failed to book session',
    'speakerProfile.bookSession.unavailableDay': 'Speaker is not available on',
    'speakerProfile.bookSession.timeNotInRange': 'Speaker is only available between',
    'speakerProfile.bookSession.anonymous': 'Anonymous',
    'speakerProfile.bookSession.noReviews': 'No reviews yet',

    // About Page
    'about.hero.badge': 'Our Story',
    'about.hero.title': 'Aurora: Bringing English to Life',
    'about.hero.subtitle': 'We believe language unlocks opportunity. Aurora connects learners with kind, inspiring speakers for warm, human conversations that build confidence—one meaningful session at a time.',
    'about.story.title': 'The Story of Aurora',
    'about.story.p1': 'If you are new here, my name is Monica Medina and my mission in life is communication—helping people to communicate and helping people to feel happy.I have been teaching English, at multiple levels, including children and adults, since 1988. Besides teaching, I have a special chemistry with elderly people. They are living treasures, as they possess a thorough encyclopedia within, and an exceptional storybook of experiences. I have prepared hundreds of English students to be successful in the language. They have become better people!',
    'about.story.p2': 'From living rooms to laptops, from nerves to smiles—Aurora is where learners show up as themselves and leave a little braver every time.',
    'about.mission.title': 'Our Mission',
    'about.mission.p1': 'To make English practice accessible, human, and joyful—by matching learners with thoughtful speakers and giving them everything they need to connect, grow, and belong.',
    'about.mission.point1': 'Warm, one‑to‑one sessions that build confidence',
    'about.mission.point2': 'Diverse speakers with real‑world experience',
    'about.mission.point3': 'Flexible scheduling that fits real life',
    'about.mission.cards.warm.title': 'Warm, Human Sessions',
    'about.mission.cards.warm.description': 'One-to-one conversations designed to build confidence in a friendly, supportive space.',
    'about.mission.cards.diverse.title': 'Diverse Speakers',
    'about.mission.cards.diverse.description': 'Learn from seniors with rich life experience and perspectives from around the world.',
    'about.mission.cards.flexible.title': 'Flexible Scheduling',
    'about.mission.cards.flexible.description': 'Pick times that fit your life, with sessions available across time zones.',
    'about.community.badge': 'Our Community',
    'about.community.title': 'Join Thousands of Learners',
    'about.community.subtitle': 'Connect with passionate speakers and embark on your English learning journey',
    'about.community.card1.title': 'Students',
    'about.community.card1.subtitle': 'Building confidence',
    'about.community.card2.title': 'Instructors',
    'about.community.card2.subtitle': 'Inspiring conversations',
    'about.community.card3.title': 'Practice',
    'about.community.card3.subtitle': 'Real conversations',
    'about.community.card4.title': 'Community',
    'about.community.card4.subtitle': 'Grow together',
    'about.faq.title': 'Frequently Asked Questions',
    'about.faq.q1': 'How do donations work?',
    'about.faq.a1': 'Donations help us support free or reduced‑cost sessions for learners who need it, and sustain our platform. You can add a donation at checkout or through your account settings anytime.',
    'about.faq.q2': 'What English level do I need?',
    'about.faq.a2': 'In order to have a conversation you must be able to speak the language. Little by little you will improve your fluency and your vocabulary.',
    'about.faq.q3': 'How long is a session?',
    'about.faq.a3': '30 minutes.',
    'about.faq.q4': 'What is the cancellation policy?',
    'about.faq.a4': 'Pending...',
    'about.faq.q5': 'What do I need for the session?',
    'about.faq.a5': 'A stable internet connection, a device with a microphone, and a quiet space. A webcam is recommended but optional.',
    'about.faq.more': 'Have another question? We’re here for you.',
    'about.cta.title': 'Ready to Start Your Journey?',
    'about.cta.subtitle': 'Find a speaker who inspires you and book your first session today. Confidence is just a conversation away.',
    'about.cta.button': 'Find a Speaker',
  },
  es: {
    // Header
    'header.home': 'Inicio',
    'header.nosotros': 'Nosotros',
    'header.dashboard': 'Panel',
    'header.speakerDashboard': 'Panel de Speaker',
    'header.speakers': 'Speakers',
    'header.login': 'Inicia sesión',
    'header.signup': 'Regístrate',
    'header.profile': 'Perfil',
    'header.logout': 'Cerrar sesión',
    'header.discover': 'Descubrir',
    'header.speaker': 'Speaker',
    'header.loginStudent': 'Estudiante',
    'header.loginSpeaker': 'Speaker',
    
    // Home Page
    'home.badge': 'Nunca dejes de aprender',
    'home.title.line1': 'Practica tu inglés conectando',
    'home.title.line2': 'con personas que tienen',
    'home.title.line3': 'mucho que contar',
    'home.cta.explore': 'Explora speakers',
    'home.reviews': '( 10k+ Reseñas )',
    'home.popularSpeakers': 'Popular Speakers',
    'home.popularSpeakersDesc': 'Mejora tu expresión oral conversando con un hablante nativo sénior.',
    'home.filter.all': 'Todos',
    'home.filter.literature': 'Literatura',
    'home.filter.architecture': 'Arquitectura',
    'home.filter.engineering': 'Ingenieria',
    'home.filter.business': 'Negocios',
    'home.filter.cooking': 'Cocina',
    'home.viewAll': 'Ver todos',
    'home.howItWorks.badge': 'Practica tu speaking',
    'home.howItWorks.title': '¿Cómo funciona?',
    'home.howItWorks.step1': 'Explora sus perfiles.',
    'home.howItWorks.step2': 'Seleccione la fecha y la hora.',
    'home.howItWorks.step3': 'Practica y Conecta: Disfruta de conversación auténtica.',
    'home.howItWorks.step4': 'Las oradoras han elegido sus temas más favoritos.',
    'home.whyDifferent.badge': 'Contribuyes mientras aprendes',
    'home.whyDifferent.title': 'Por qué Aurora es diferente',
    'home.whyDifferent.point1': 'Aprendes con un propósito: Tu práctica ayuda a reducir la soledad en las personas mayores y les hace sentir útiles.',
    'home.whyDifferent.point2': 'Conversaciones reales: No hay guiones, solo personas y momentos genuinos.',
    'home.whyDifferent.point3': 'Impacto mutuo: Ellos te ayudan a mejorar tu inglés, tú les das compañía y conexión.',
    'home.becomeSpeaker.title': 'Conviértete en',
    'home.becomeSpeaker.titleSpeaker': 'speaker',
    'home.becomeSpeaker.point1': 'Registrate como speaker.',
    'home.becomeSpeaker.point2': 'Define tus horarios disponibles.',
    'home.becomeSpeaker.point3': 'Empieza a conversar y compartir historias.',
    'home.becomeSpeaker.cta': 'CONVERTIRME EN SPEAKER',
    'home.hero.subtitle': 'Practica tu inglés conectando con personas que tienen mucho que compartir.',
    'home.becomeSpeaker.subtitle': 'Comparte tus historias, conecta con estudiantes motivados y genera un impacto significativo.',
    'home.becomeSpeaker.steps.step1.label': 'Paso 1',
    'home.becomeSpeaker.steps.step2.label': 'Paso 2',
    'home.becomeSpeaker.steps.step3.label': 'Paso 3',
    'home.speakerCard.age': 'años',
    'home.speakerCard.book': 'Agenda',
    'home.speakerCard.free': 'Gratis',
    'home.footer.links': 'Enlaces',
    'home.footer.terms': 'Términos y condiciones',
    'home.footer.privacy': 'Aviso de privacidad',
    'home.footer.copyright': '© 2025 Aurora. Todos los derechos reservados',
    
    // Auth
    'auth.signup.title': 'Aurora',
    'auth.signup.createAccount': 'Crear Cuenta',
    'auth.signup.google': 'Regístrate con Google',
    'auth.signup.facebook': 'Regístrate con Facebook',
    'auth.signup.or': '- O -',
    'auth.signup.firstName': 'Nombre',
    'auth.signup.lastName': 'Apellido',
    'auth.signup.email': 'Correo Electrónico',
    'auth.signup.password': 'Contraseña',
    'auth.signup.submit': 'Crear Cuenta',
    'auth.signup.loading': 'Creando cuenta...',
    'auth.signup.hasAccount': '¿Ya tienes una cuenta?',
    'auth.signup.login': 'Inicia sesión',
    'auth.signup.validate.firstNameRequired': 'El nombre es obligatorio',
    'auth.signup.validate.firstNameMin': 'El nombre debe tener al menos 2 caracteres',
    'auth.signup.validate.firstNameInvalid': 'El nombre solo puede contener letras, espacios, guiones y apóstrofes',
    'auth.signup.validate.lastNameRequired': 'El apellido es obligatorio',
    'auth.signup.validate.lastNameMin': 'El apellido debe tener al menos 2 caracteres',
    'auth.signup.validate.lastNameInvalid': 'El apellido solo puede contener letras, espacios, guiones y apóstrofes',
    'auth.signup.validate.emailRequired': 'El correo electrónico es obligatorio',
    'auth.signup.validate.emailInvalid': 'Por favor ingresa un correo electrónico válido',
    'auth.signup.validate.passwordRequired': 'La contraseña es obligatoria',
    'auth.signup.validate.passwordMin': 'La contraseña debe tener al menos 8 caracteres',
    'auth.signup.validate.passwordLetter': 'La contraseña debe contener al menos una letra',
    'auth.signup.validate.passwordNumber': 'La contraseña debe contener al menos un número',
    'auth.signup.validate.termsRequired': 'Debes aceptar los Términos y Condiciones y el Aviso de Privacidad para continuar',
    'auth.signup.termsText': 'He leído y acepto los',
    'auth.signup.termsLink': 'Términos y Condiciones',
    'auth.signup.termsAnd': 'y el',
    'auth.signup.privacyLink': 'Aviso de Privacidad',
    'auth.terms.modal.title': 'Aceptación de Términos y Aviso de Privacidad Requerida',
    'auth.terms.modal.description': 'Para continuar usando Aurora, por favor revisa y acepta nuestros Términos y Condiciones y Aviso de Privacidad.',
    'auth.terms.modal.content': 'Como nuevo requisito, todos los usuarios (incluyendo usuarios existentes) deben aceptar nuestros Términos y Condiciones y Aviso de Privacidad actualizados para continuar usando la plataforma. Por favor lee los documentos cuidadosamente y acéptalos a continuación.',
    'auth.terms.modal.accept': 'Aceptar y Continuar',
    'auth.terms.modal.accepting': 'Aceptando...',
    'auth.terms.error': 'Error al aceptar los términos. Por favor intenta de nuevo.',
    'auth.common.back': 'Atrás',
    'auth.common.continue': 'Continuar',
    'auth.common.select': 'Seleccionar',
    'auth.common.fullName': 'Nombre completo',
    'auth.common.fullNamePlaceholder': 'Ingresa tu nombre completo',
    'auth.common.emailPlaceholder': 'Ingresa tu correo electrónico',
    'auth.common.passwordPlaceholder': 'Ingresa tu contraseña',
    'auth.common.passwordCreatePlaceholder': 'Crea una contraseña segura',
    'auth.errors.loginFailed': 'No pudimos iniciar sesión',
    'auth.errors.loginUnknown': 'Ocurrió un problema al iniciar sesión',
    'auth.errors.registerFailed': 'No pudimos completar el registro',
    'auth.validation.fullNameRequired': 'El nombre completo es obligatorio',
    'auth.validation.emailRequired': 'El correo es obligatorio',
    'auth.validation.emailInvalid': 'Introduce un correo válido',
    'auth.validation.passwordRequired': 'La contraseña es obligatoria',
    'auth.validation.gmailRequired': 'Debe ser una cuenta de Gmail (@gmail.com)',
    'auth.validation.birthDateRequired': 'La fecha de nacimiento es obligatoria',
    'auth.validation.cityRequired': 'La ciudad es obligatoria',
    'auth.validation.bioRequired': 'La descripción es obligatoria',
    'auth.validation.photoRequired': 'Sube una fotografía',
    'auth.student.title': 'Estudiante',
    'auth.student.subtitle': 'Inicia sesión o crea tu cuenta',
    'auth.student.login.submitting': 'Iniciando sesión...',
    'auth.student.register.submit': 'Continuar',
    'auth.speaker.title': 'Speaker / Orador',
    'auth.speaker.subtitle': 'Inicia sesión o crea tu cuenta como orador',
    'auth.speaker.login.submitting': 'Iniciando sesión...',
    'auth.speaker.register.step1.emailLabel': 'Correo electrónico (Gmail)',
    'auth.speaker.register.step1.emailPlaceholder': 'ejemplo@gmail.com',
    'auth.speaker.register.step1.emailHint': 'Debe ser una cuenta de Gmail (@gmail.com)',
    'auth.speaker.register.step1.submit': 'Continuar',
    'auth.speaker.register.step2.birthDateLabel': 'Fecha de nacimiento',
    'auth.speaker.register.step2.cityLabel': 'Ciudad de residencia',
    'auth.speaker.register.step2.cityPlaceholder': 'Ej: Miami, FL',
    'auth.speaker.register.step2.bioLabel': 'Descripción breve',
    'auth.speaker.register.step2.bioPlaceholder': 'Cuéntanos un poco sobre ti...',
    'auth.speaker.register.step2.photoLabel': 'Fotografía',
    'auth.speaker.register.step2.photoUpload': 'Subir foto',
    'auth.speaker.register.step2.photoHint': 'JPG o PNG, máximo 5MB.',
    'auth.speaker.register.step2.photoSelect': 'Seleccionar',
    'auth.speaker.register.step2.back': 'Atrás',
    'auth.speaker.register.step2.submit': 'Crear Cuenta',
    'auth.speaker.register.step2.submitting': 'Creando cuenta...',
    
    // Terms and Conditions Page
    'terms.title': 'Términos y Condiciones de Uso – Aurora',
    'terms.section1.title': '1. Aceptación de los Términos',
    'terms.section1.paragraph1': 'Al acceder o utilizar la plataforma Aurora (en adelante, "la Plataforma"), el usuario acepta cumplir y quedar legalmente vinculado por los presentes Términos y Condiciones de Uso. Si no está de acuerdo con ellos, deberá abstenerse de usar la Plataforma.',
    'terms.section2.title': '2. Descripción del Servicio',
    'terms.section2.paragraph1': 'Aurora es una plataforma digital que conecta estudiantes de inglés de nivel avanzado con personas adultas mayores, con el propósito de fomentar la práctica del idioma a través de conversaciones virtuales.',
    'terms.section2.paragraph2': 'Aurora no ofrece servicios educativos formales ni terapéuticos, ni garantiza resultados académicos o personales.',
    'terms.section3.title': '3. Registro de Usuarios',
    'terms.section3.paragraph1': 'Para acceder a la Plataforma, el usuario debe proporcionar información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.',
    'terms.section4.title': '4. Conducta de los Usuarios',
    'terms.section4.intro': 'El usuario se compromete a:',
    'terms.section4.item1': 'Mantener un comportamiento respetuoso y apropiado durante las conversaciones.',
    'terms.section4.item2': 'No acosar, discriminar, difundir odio, ni compartir contenido inapropiado.',
    'terms.section4.item3': 'No usar la Plataforma para fines comerciales, políticos, religiosos o ilícitos.',
    'terms.section4.paragraph1': 'Aurora se reserva el derecho de suspender o eliminar cuentas que incumplan estas normas, sin previo aviso.',
    'terms.section5.title': '5. Limitación de Responsabilidad',
    'terms.section5.paragraph1': 'Aurora actúa únicamente como intermediario tecnológico entre los usuarios.',
    'terms.section5.intro': 'Aurora no se hace responsable de:',
    'terms.section5.item1': 'El contenido o veracidad de las conversaciones mantenidas entre usuarios.',
    'terms.section5.item2': 'Daños, perjuicios, pérdidas o incidentes derivados de la interacción entre usuarios dentro o fuera de la Plataforma.',
    'terms.section5.item3': 'Fallos técnicos, interrupciones del servicio o pérdida de datos.',
    'terms.section5.paragraph2': 'El uso de la Plataforma se realiza bajo la exclusiva responsabilidad del usuario.',
    'terms.section6.title': '6. Protección de Datos Personales',
    'terms.section6.part1': 'Aurora recopila y trata los datos personales conforme a su',
    'terms.section6.link1': 'Aviso de Privacidad',
    'terms.section6.part2': 'disponible en',
    'terms.section6.link2': 'este enlace',
    'terms.section6.paragraph2': 'El usuario acepta dicho tratamiento para fines operativos y de mejora del servicio.',
    'terms.section7.title': '7. Propiedad Intelectual',
    'terms.section7.paragraph1': 'Todo el contenido de la Plataforma (nombre, logotipo, diseño, textos, código, bases de datos y funcionalidades) es propiedad exclusiva de Aurora o cuenta con las licencias correspondientes. Queda prohibida su copia, modificación o distribución sin autorización expresa.',
    'terms.section8.title': '8. Enlaces a Terceros',
    'terms.section8.paragraph1': 'Aurora puede contener enlaces a sitios de terceros. No somos responsables del contenido, políticas o prácticas de dichos sitios externos.',
    'terms.section9.title': '9. Modificaciones',
    'terms.section9.paragraph1': 'Aurora podrá modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor una vez publicados en la Plataforma.',
    'terms.section10.title': '10. Legislación Aplicable',
    'terms.section10.paragraph1': 'Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos, y cualquier controversia se someterá a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponder.',
    
    // Privacy Policy Page
    'privacy.title': 'Aviso de Privacidad – Aurora',
    'privacy.lastUpdated': 'Última actualización: 19 OCTUBRE 2025',
    'privacy.section1.title': '1. Identidad y Contacto del Responsable',
    'privacy.section1.paragraph1.part1': 'El presente Aviso de Privacidad corresponde a Aurora, una iniciativa digital accesible desde',
    'privacy.section1.paragraph1.link': 'https://weareaurora.tech',
    'privacy.section1.paragraph1.part2': '(en adelante, "la Plataforma"), dedicada a conectar estudiantes de inglés con adultos mayores para promover la práctica del idioma y la convivencia intergeneracional.',
    'privacy.section1.paragraph2': 'Aurora actualmente no opera como persona moral constituida, sino como proyecto en desarrollo.',
    'privacy.section1.paragraph3': 'Para cualquier duda o solicitud relacionada con la protección de datos personales, puedes comunicarte al correo:',
    'privacy.section1.emailLabel': '📩',
    'privacy.section1.emailText': 'weareaurora.tech@gmail.com',
    'privacy.section2.title': '2. Datos Personales que se Recaban',
    'privacy.section2.paragraph1': 'Aurora podrá recopilar los siguientes datos personales de los usuarios (estudiantes y adultos mayores):',
    'privacy.section2.item1': 'Nombre y apellido',
    'privacy.section2.item2': 'Edad o rango de edad',
    'privacy.section2.item3': 'Correo electrónico',
    'privacy.section2.item4': 'País o ciudad de residencia',
    'privacy.section2.item5': 'Nivel de inglés o idioma nativo',
    'privacy.section2.item6': 'Preferencias de horario o intereses',
    'privacy.section2.item7': 'Imagen, voz o video (en caso de que se utilicen herramientas de videollamada o grabación)',
    'privacy.section2.item8': 'Información técnica (dirección IP, dispositivo, navegador, cookies)',
    'privacy.section2.note': 'Aurora no solicita ni almacena información financiera ni médica.',
    'privacy.section3.title': '3. Finalidades del Tratamiento',
    'privacy.section3.paragraph1': 'Los datos personales son utilizados para los siguientes fines:',
    'privacy.section3.primaryHeading': 'Finalidades principales:',
    'privacy.section3.primaryItem1': 'Permitir el registro y acceso a la Plataforma.',
    'privacy.section3.primaryItem2': 'Facilitar la conexión entre estudiantes y adultos mayores.',
    'privacy.section3.primaryItem3': 'Administrar y mejorar la experiencia de uso.',
    'privacy.section3.primaryItem4': 'Supervisar el cumplimiento de las normas de convivencia.',
    'privacy.section3.secondaryHeading': 'Finalidades secundarias (opcionales):',
    'privacy.section3.secondaryItem1': 'Enviar notificaciones sobre mejoras o novedades del proyecto.',
    'privacy.section3.secondaryItem2': 'Realizar encuestas o análisis de satisfacción.',
    'privacy.section3.paragraph2.part1': 'El usuario podrá oponerse a las finalidades secundarias enviando un correo a',
    'privacy.section3.paragraph2.link': 'contact@weareaurora.tech',
    'privacy.section3.paragraph2.part2': '.',
    'privacy.section4.title': '4. Transferencia de Datos',
    'privacy.section4.paragraph1': 'Aurora no comparte, vende ni renta datos personales a terceros.',
    'privacy.section4.paragraph2': 'Sin embargo, podrá utilizar proveedores tecnológicos (como servicios de hosting o videollamada) que procesen los datos únicamente con fines operativos y bajo medidas de seguridad adecuadas.',
    'privacy.section5.title': '5. Grabaciones y Uso de Imagen',
    'privacy.section5.paragraph1': 'En caso de que se graben sesiones o videollamadas, el usuario será notificado previamente y podrá otorgar o negar su consentimiento.',
    'privacy.section5.paragraph2': 'Las grabaciones se utilizarán únicamente con fines de mejora, supervisión o evaluación interna y se eliminarán en un plazo razonable.',
    'privacy.section6.title': '6. Derechos ARCO',
    'privacy.section6.paragraph1': 'El usuario puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO), así como revocar su consentimiento para el tratamiento de sus datos, enviando una solicitud al correo:',
    'privacy.section6.emailLabel': '📧',
    'privacy.section6.emailText': 'contact@weareaurora.tech',
    'privacy.section6.paragraph2': 'Aurora responderá en un plazo máximo de 20 días hábiles.',
    'privacy.section7.title': '7. Seguridad de la Información',
    'privacy.section7.paragraph1': 'Aurora aplica medidas razonables de seguridad técnica y administrativa para proteger los datos personales contra pérdida, alteración o acceso no autorizado.',
    'privacy.section7.paragraph2': 'Sin embargo, el usuario reconoce que ningún sistema es completamente infalible y utiliza la Plataforma bajo su propio riesgo.',
    'privacy.section8.title': '8. Conservación de los Datos',
    'privacy.section8.paragraph1': 'Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir con las finalidades descritas o hasta que el usuario solicite su eliminación.',
    'privacy.section9.title': '9. Modificaciones',
    'privacy.section9.paragraph1': 'Aurora podrá actualizar este Aviso de Privacidad cuando sea necesario.',
    'privacy.section9.paragraph2.part1': 'Las modificaciones se publicarán en',
    'privacy.section9.paragraph2.link': 'https://weareaurora.tech',
    'privacy.section9.paragraph2.part2': 'con la fecha de actualización correspondiente.',
    'privacy.section10.title': '10. Aceptación',
    'privacy.section10.paragraph1': 'Al registrarse o utilizar la Plataforma, el usuario reconoce haber leído y aceptado este Aviso de Privacidad.',
    
    'auth.signin.title': 'Aurora',
    'auth.signin.email': 'Correo Electrónico',
    'auth.signin.password': 'Contraseña',
    'auth.signin.submit': 'Iniciar Sesión',
    'auth.signin.loading': 'Iniciando sesión...',
    'auth.signin.noAccount': '¿No tienes una cuenta?',
    'auth.signin.signup': 'Regístrate',
    'auth.roleSelection.title': 'Inicia sesión para ver tu perfil',
    'auth.roleSelection.subtitle': 'Crea una cuenta o inicia sesión para agendar sesiones, gestionar tu agenda y conectar con speakers.',
    'auth.roleSelection.student': 'Iniciar como Estudiante',
    'auth.roleSelection.speaker': 'Iniciar como Speaker',
    
    // Speakers Page
    'speakers.title': 'Encuentra tu Speaker Perfecto',
    'speakers.subtitle': 'Conéctate con hablantes nativos para practicar y mejorar tus habilidades lingüísticas',
    'speakers.search.placeholder': 'Buscar por nombre de speaker...',
    'speakers.filter.title': 'Filtrar por Tema',
    'speakers.filter.allTopics': 'Todos los Temas',
    'speakers.filter.business': 'Negocios',
    'speakers.filter.technology': 'Tecnología',
    'speakers.filter.health': 'Salud',
    'speakers.filter.education': 'Educación',
    'speakers.filter.arts': 'Artes',
    'speakers.filter.sports': 'Deportes',
    'speakers.filter.travel': 'Viajes',
    'speakers.filter.food': 'Comida',
    'speakers.filter.science': 'Ciencia',
    'speakers.filter.entertainment': 'Entretenimiento',
    'speakers.results.count': 'speaker encontrado',
    'speakers.results.countPlural': 'speakers encontrados',
    'speakers.card.new': 'Nuevo',
    'speakers.card.reviews': 'reseñas',
    'speakers.card.sessions': 'sesiones completadas',
    'speakers.noResults': 'No se encontraron speakers que coincidan con tus criterios.',
    'speakers.clearFilters': 'Limpiar Filtros',
    'speakers.noResults.title': 'No se encontraron speakers',
    'speakers.noResults.description': 'Intenta ajustar tu búsqueda o explora otros temas para descubrir más voces.',
    'speakers.noResults.reset': 'Limpiar búsqueda',
    'speakers.card.book': 'Agendar sesión',
    
    // Speaker Dashboard
    'dashboard.title': 'Panel de Speaker',
    'dashboard.subtitle': 'Gestiona tus sesiones, reseñas y perfil',
    'dashboard.errors.loginRequired': 'Por favor inicia sesión para acceder a tu panel',
    'dashboard.errors.loadFailed': 'Error al cargar datos del panel',
    'dashboard.errors.saveFailed': 'Error al guardar perfil',
    'dashboard.errors.availabilityFailed': 'Error al guardar disponibilidad',
    'dashboard.errors.avatarFailed': 'Error al subir avatar',
    'dashboard.errors.cancelFailed': 'Error al cancelar sesión',
    'dashboard.errors.calendarInitFailed': 'Error al iniciar conexión con Google Calendar',
    'dashboard.errors.calendarConnectFailed': 'Error al conectar Google Calendar',
    'dashboard.errors.calendarDisconnectFailed': 'Error al desconectar Google Calendar',
    'dashboard.profile.title': 'Perfil',
    'dashboard.profile.description': 'Gestiona la información de tu perfil',
    'dashboard.profile.bio': 'Biografía',
    'dashboard.profile.bioPlaceholder': 'Cuéntanos sobre ti...',
    'dashboard.profile.noBio': 'No hay biografía disponible',
    'dashboard.profile.save': 'Guardar Cambios',
    'dashboard.profile.saving': 'Guardando...',
    'dashboard.calendar.title': 'Google Calendar',
    'dashboard.calendar.description': 'Conecta tu calendario para crear eventos automáticamente',
    'dashboard.calendar.connected': 'Calendario Conectado',
    'dashboard.calendar.expires': 'Expira:',
    'dashboard.calendar.notConnected': 'Tu calendario no está conectado',
    'dashboard.calendar.notConnectedDesc': 'Conecta tu Google Calendar para crear eventos automáticamente cuando los learners reserven sesiones contigo.',
    'dashboard.calendar.connect': 'Conectar Google Calendar',
    'dashboard.calendar.connecting': 'Conectando...',
    'dashboard.calendar.disconnect': 'Desconectar',
    'dashboard.calendar.disconnecting': 'Desconectando...',
    'dashboard.availability.title': 'Disponibilidad',
    'dashboard.availability.description': 'Establece tus días y horas disponibles',
    'dashboard.availability.daysActive': 'días activos',
    'dashboard.availability.to': 'a',
    'dashboard.availability.save': 'Guardar Disponibilidad',
    'dashboard.availability.saving': 'Guardando...',
    'dashboard.availability.days.monday': 'Lunes',
    'dashboard.availability.days.tuesday': 'Martes',
    'dashboard.availability.days.wednesday': 'Miércoles',
    'dashboard.availability.days.thursday': 'Jueves',
    'dashboard.availability.days.friday': 'Viernes',
    'dashboard.availability.days.saturday': 'Sábado',
    'dashboard.availability.days.sunday': 'Domingo',
    'dashboard.sessions.upcoming.title': 'Sesiones Próximas',
    'dashboard.sessions.upcoming.count': 'sesiones programadas',
    'dashboard.sessions.upcoming.none': 'No hay sesiones próximas',
    'dashboard.sessions.past.title': 'Sesiones Pasadas',
    'dashboard.sessions.past.count': 'sesiones completadas y canceladas',
    'dashboard.sessions.past.none': 'No hay sesiones pasadas',
    'dashboard.sessions.with': 'con',
    'dashboard.sessions.topics': 'Temas:',
    'dashboard.sessions.icebreaker': '💡 Rompehielos',
    'dashboard.sessions.rate': 'Calificar',
    'dashboard.sessions.cancel': 'Cancelar Sesión',
    'dashboard.sessions.reason': 'Razón:',
    'dashboard.reviews.received.title': 'Reseñas Recibidas',
    'dashboard.reviews.received.count': 'reseñas',
    'dashboard.reviews.received.none': 'Aún no hay reseñas',
    'dashboard.reviews.received.from': 'de',
    'dashboard.reviews.given.title': 'Reseñas Dadas',
    'dashboard.reviews.given.count': 'reseñas',
    'dashboard.reviews.given.none': 'Aún no hay reseñas',
    'dashboard.reviews.given.for': 'para',
    'dashboard.cancel.title': 'Cancelar Sesión',
    'dashboard.cancel.confirm': '¿Estás seguro de que quieres cancelar esta sesión?',
    'dashboard.cancel.reasonLabel': 'Razón de Cancelación',
    'dashboard.cancel.reasonPlaceholder': 'Por favor proporciona una razón para la cancelación (opcional)...',
    'dashboard.cancel.reasonOptional': '(opcional)',
    'dashboard.cancel.policy': 'Política de Cancelación:',
    'dashboard.cancel.policy24h': 'Las sesiones deben cancelarse al menos 24 horas antes de la hora programada',
    'dashboard.cancel.policyNotify': 'El learner será notificado automáticamente',
    'dashboard.cancel.policyAvailable': 'Este horario volverá a estar disponible para reservar',
    'dashboard.cancel.warning': 'Advertencia: Esta sesión es en menos de 24 horas. La cancelación aún puede estar permitida pero el learner puede no tener aviso adecuado.',
    'dashboard.cancel.keep': 'Mantener Sesión',
    'dashboard.cancel.cancelling': 'Cancelando...',
    'dashboard.cancel.confirmButton': 'Cancelar Sesión',

    // Speaker Signup
    'speakerSignup.title': 'Aurora',
    'speakerSignup.tagline': 'Happy & Fluent',
    'speakerSignup.accountSetup': 'Configuración de cuenta',
    'speakerSignup.step': '/',
    'speakerSignup.back': 'Atrás',
    'speakerSignup.step1.title': 'Cuéntanos un poco sobre ti',
    'speakerSignup.step1.description': 'Eso nos ayudará a configurar mejor tu cuenta.',
    'speakerSignup.step1.firstName': 'Nombre',
    'speakerSignup.step1.firstNamePlaceholder': 'Nombre',
    'speakerSignup.step1.lastName': 'Apellido',
    'speakerSignup.step1.lastNamePlaceholder': 'Apellido',
    'speakerSignup.step1.email': 'Correo electrónico',
    'speakerSignup.step1.emailPlaceholder': 'Correo electrónico',
    'speakerSignup.step1.mail': 'Correo',
    'speakerSignup.step1.validate.firstNameRequired': 'El nombre es obligatorio',
    'speakerSignup.step1.validate.firstNameMin': 'El nombre debe tener al menos 2 caracteres',
    'speakerSignup.step1.validate.firstNameInvalid': 'El nombre solo puede contener letras',
    'speakerSignup.step1.validate.lastNameRequired': 'El apellido es obligatorio',
    'speakerSignup.step1.validate.lastNameMin': 'El apellido debe tener al menos 2 caracteres',
    'speakerSignup.step1.validate.lastNameInvalid': 'El apellido solo puede contener letras',
    'speakerSignup.step1.validate.emailRequired': 'El correo electrónico es obligatorio',
    'speakerSignup.step1.validate.emailInvalid': 'Por favor ingresa un correo electrónico válido',
    'speakerSignup.step2.title': '¿Qué temas te gustan?',
    'speakerSignup.step2.description': 'Selecciona hasta 4 temas que te interesen',
    'speakerSignup.step2.selected': 'Seleccionado:',
    'speakerSignup.step3.title': '¿Cuándo prefieres reunirte?',
    'speakerSignup.step3.description': 'Selecciona tu horario de reunión preferido',
    'speakerSignup.step3.mornings': 'Mañanas',
    'speakerSignup.step3.afternoon': 'Tardes',
    'speakerSignup.step3.nights': 'Noches',
    'speakerSignup.step3.other': 'Otro',
    'speakerSignup.step4.title': 'Elige tu avatar',
    'speakerSignup.step4.description': 'Por favor comparte tu foto de perfil',
    'speakerSignup.step4.selectImage': 'Seleccionar imagen',
    'speakerSignup.step5.title': 'Configura tu contraseña',
    'speakerSignup.step5.description': 'Crea una contraseña segura para completar tu cuenta.',
    'speakerSignup.step5.password': 'Contraseña',
    'speakerSignup.step5.passwordPlaceholder': 'Contraseña',
    'speakerSignup.step5.confirmPassword': 'Confirmar Contraseña',
    'speakerSignup.step5.confirmPasswordPlaceholder': 'Confirmar contraseña',
    'speakerSignup.step5.hint': 'Debe tener al menos 8 caracteres con letras y números',
    'speakerSignup.step5.validate.passwordRequired': 'La contraseña es obligatoria',
    'speakerSignup.step5.validate.passwordMin': 'La contraseña debe tener al menos 8 caracteres',
    'speakerSignup.step5.validate.passwordLetter': 'La contraseña debe contener al menos una letra',
    'speakerSignup.step5.validate.passwordNumber': 'La contraseña debe contener al menos un número',
    'speakerSignup.step5.validate.confirmRequired': 'Por favor confirma tu contraseña',
    'speakerSignup.step5.validate.passwordsMatch': 'Las contraseñas no coinciden',
    'speakerSignup.skip': 'Omitir',
    'speakerSignup.next': 'Siguiente',
    'speakerSignup.createAccount': 'Crear Cuenta',
    'speakerSignup.creating': 'Creando cuenta...',
    'speakerSignup.error.passwordsMatch': 'Las contraseñas no coinciden',
    'speakerSignup.error.createFailed': 'Error al crear la cuenta. Por favor intenta de nuevo.',
    'speakerSignup.hasAccount': '¿Ya tienes una cuenta?',
    'speakerSignup.login': 'Inicia sesión',

    // Learner Dashboard
    'learnerDashboard.title': 'Panel de Learner',
    'learnerDashboard.subtitle': 'Gestiona tus sesiones de aprendizaje y sigue tu progreso',
    'learnerDashboard.errors.loginRequired': 'Por favor inicia sesión para acceder a tu panel',
    'learnerDashboard.errors.loadFailed': 'Error al cargar datos del panel',
    'learnerDashboard.errors.saveFailed': 'Error al guardar perfil',
    'learnerDashboard.errors.avatarFailed': 'Error al subir avatar',
    'learnerDashboard.errors.cancelFailed': 'Error al cancelar sesión',
    'learnerDashboard.profile.title': 'Perfil',
    'learnerDashboard.profile.description': 'Tu información personal',
    'learnerDashboard.profile.firstName': 'Nombre',
    'learnerDashboard.profile.firstNamePlaceholder': 'Nombre',
    'learnerDashboard.profile.lastName': 'Apellido',
    'learnerDashboard.profile.lastNamePlaceholder': 'Apellido',
    'learnerDashboard.profile.bio': 'Biografía',
    'learnerDashboard.profile.bioPlaceholder': 'Cuéntanos sobre ti...',
    'learnerDashboard.profile.noBio': 'No hay biografía disponible',
    'learnerDashboard.profile.save': 'Guardar Cambios',
    'learnerDashboard.profile.saving': 'Guardando...',
    'learnerDashboard.profile.upcoming': 'Próximas',
    'learnerDashboard.profile.completed': 'Completadas',
    'learnerDashboard.sessions.upcoming.title': 'Sesiones Próximas',
    'learnerDashboard.sessions.upcoming.count': 'sesiones programadas',
    'learnerDashboard.sessions.upcoming.none': 'No hay sesiones próximas',
    'learnerDashboard.sessions.upcoming.with': 'con',
    'learnerDashboard.sessions.upcoming.topics': 'Temas:',
    'learnerDashboard.sessions.upcoming.icebreaker': '💡 Rompehielos',
    'learnerDashboard.sessions.upcoming.join': 'Unirse a la Reunión →',
    'learnerDashboard.sessions.upcoming.cancel': 'Cancelar',
    'learnerDashboard.sessions.past.title': 'Sesiones Pasadas y Reseñas',
    'learnerDashboard.sessions.past.count': 'sesiones completadas',
    'learnerDashboard.sessions.past.none': 'Aún no hay sesiones completadas',
    'learnerDashboard.sessions.past.with': 'con',
    'learnerDashboard.sessions.past.rate': 'Calificar y Reseñar',
    'learnerDashboard.sessions.past.cancellationReason': 'Razón de cancelación:',
    'learnerDashboard.cancel.title': 'Cancelar Sesión',
    'learnerDashboard.cancel.policy': 'Política de Cancelación',
    'learnerDashboard.cancel.policy24h': 'Las sesiones deben cancelarse al menos 24 horas antes de la hora programada',
    'learnerDashboard.cancel.policyHoursAway': 'horas de distancia',
    'learnerDashboard.cancel.policyLessThanHour': 'menos de una hora de distancia',
    'learnerDashboard.cancel.policyMayNotEligible': '(Puede no ser elegible para cancelación)',
    'learnerDashboard.cancel.policyNotify': 'El speaker será notificado automáticamente de la cancelación',
    'learnerDashboard.cancel.sessionDetails': 'Detalles de la Sesión',
    'learnerDashboard.cancel.reasonLabel': 'Razón de Cancelación (Opcional)',
    'learnerDashboard.cancel.reasonPlaceholder': 'Por favor cuéntanos por qué estás cancelando...',
    'learnerDashboard.cancel.keep': 'Mantener Sesión',
    'learnerDashboard.cancel.cancelling': 'Cancelando...',
    'learnerDashboard.cancel.confirm': 'Confirmar Cancelación',

    // Speaker Profile/Detail Page
    'speakerProfile.backToSpeakers': 'Volver a Speakers',
    'speakerProfile.notFound': 'Speaker no encontrado',
    'speakerProfile.reviews': 'Reseñas',
    'speakerProfile.review': 'reseña',
    'speakerProfile.sessions': 'Sesiones',
    'speakerProfile.completed': 'Completadas',
    'speakerProfile.new': 'Nuevo',
    'speakerProfile.about': 'Acerca de',
    'speakerProfile.topicsInterests': 'Temas e Intereses',
    'speakerProfile.bookSession': 'Reservar Sesión',
    'speakerProfile.bookSession.title': 'Reservar Sesión',
    'speakerProfile.bookSession.success.title': '¡Sesión Reservada!',
    'speakerProfile.bookSession.success.message': 'Tu sesión ha sido confirmada. Revisa tu correo electrónico para más detalles.',
    'speakerProfile.bookSession.availability': 'Disponibilidad del Speaker',
    'speakerProfile.bookSession.notAvailable': 'No disponible',
    'speakerProfile.bookSession.sessionTitle': 'Título de la Sesión *',
    'speakerProfile.bookSession.sessionTitlePlaceholder': 'Ej., Práctica de Conversación',
    'speakerProfile.bookSession.date': 'Fecha *',
    'speakerProfile.bookSession.dateAvailable': 'Disponible:',
    'speakerProfile.bookSession.dateNotAvailable': 'No disponible en este día',
    'speakerProfile.bookSession.time': 'Hora *',
    'speakerProfile.bookSession.timeHint': 'Selecciona una hora entre',
    'speakerProfile.bookSession.topics': 'Temas (máx. 2, opcional)',
    'speakerProfile.bookSession.topic1': 'Tema 1',
    'speakerProfile.bookSession.topic2': 'Tema 2',
    'speakerProfile.bookSession.topicsMax': '(sesión de 30 min)',
    'speakerProfile.bookSession.allFieldsRequired': 'Por favor completa todos los campos requeridos',
    'speakerProfile.bookSession.maxTopics': 'Máximo 2 temas permitidos',
    'speakerProfile.bookSession.confirmBooking': 'Confirmar Reserva',
    'speakerProfile.bookSession.booking': 'Reservando...',
    'speakerProfile.bookSession.failed': 'Error al reservar sesión',
    'speakerProfile.bookSession.unavailableDay': 'El speaker no está disponible el',
    'speakerProfile.bookSession.timeNotInRange': 'El speaker solo está disponible entre',
    'speakerProfile.bookSession.anonymous': 'Anónimo',
    'speakerProfile.bookSession.noReviews': 'Aún no hay reseñas',

    // About Page
    'about.hero.badge': 'Nuestra Historia',
    'about.hero.title': 'Aurora: Traer la Inglés a la Vida',
    'about.hero.subtitle': 'Creemos que el idioma desbloquea la oportunidad. Aurora conecta a los aprendices con hablantes amables e inspiradores para conversaciones cálidas y humanas que construyen confianza, una sesión significativa a la vez.',
    'about.story.title': 'La Historia de Aurora',
    'about.story.p1': 'Si eres nuevo por aquí, me llamo Mónica Medina y mi misión en la vida es la comunicación: ayudar a las personas a comunicarse y a sentirse felices. Llevo enseñando inglés a distintos niveles, incluyendo niños y adultos, desde 1988. Además de la docencia, tengo una conexión especial con las personas mayores. Son un tesoro viviente, pues poseen una enciclopedia andante y un valioso caudal de experiencias. He preparado a cientos de estudiantes de inglés para que dominen el idioma con éxito. ¡Se han convertido en mejores personas!',
    'about.story.p2': 'Desde las salas de estar hasta los laptops, desde nervios a sonrisas—Aurora es donde los aprendices se muestran como ellos mismos y se sienten un poco más valientes cada vez.',
    'about.mission.title': 'Nuestra Misión',
    'about.mission.p1': 'Para hacer que la práctica de inglés sea accesible, humana y alegre—al hacer coincidir a los aprendices con hablantes reflexivos y dándoles todo lo que necesitan para conectarse, crecer y pertenecer.',
    'about.mission.point1': 'Sesiones cálidas de uno a uno que construyen confianza',
    'about.mission.point2': 'Hablantes diversos con experiencia en el mundo real',
    'about.mission.point3': 'Programación flexible que se adapta a la vida real',
    'about.mission.cards.warm.title': 'Sesiones cálidas y humanas',
    'about.mission.cards.warm.description': 'Conversaciones uno a uno diseñadas para darte confianza en un espacio amable y seguro.',
    'about.mission.cards.diverse.title': 'Speakers diversos',
    'about.mission.cards.diverse.description': 'Aprende de personas con gran experiencia de vida y perspectivas de todo el mundo.',
    'about.mission.cards.flexible.title': 'Horarios flexibles',
    'about.mission.cards.flexible.description': 'Elige horarios que se adapten a tu vida, con sesiones disponibles en distintos husos horarios.',
    'about.community.badge': 'Nuestra Comunidad',
    'about.community.title': 'Únete a Miles de Aprendices',
    'about.community.subtitle': 'Conéctate con hablantes apasionados y comienza tu viaje de aprendizaje de inglés',
    'about.community.card1.title': 'Estudiantes',
    'about.community.card1.subtitle': 'Construyendo confianza',
    'about.community.card2.title': 'Instructores',
    'about.community.card2.subtitle': 'Conversaciones inspiradoras',
    'about.community.card3.title': 'Práctica',
    'about.community.card3.subtitle': 'Conversaciones reales',
    'about.community.card4.title': 'Comunidad',
    'about.community.card4.subtitle': 'Crecer juntos',
    'about.faq.title': 'Preguntas Frecuentes',
    'about.faq.q1': '¿Cómo funcionan las donaciones?',
    'about.faq.a1': 'Las donaciones nos ayudan a apoyar sesiones gratuitas o con costo reducido para los aprendices que lo necesitan, y a mantener nuestra plataforma. Puedes agregar una donación en el pago o a través de la configuración de tu cuenta en cualquier momento.',
    'about.faq.q2': '¿Qué nivel de inglés necesito?',
    'about.faq.a2': 'Cualquier nivel. Desde las primeras palabras hasta casi la fluidez, el interlocutor se adapta a tu nivel y a tus objetivos.',
    'about.faq.q3': '¿Cuánto dura una sesión?',
    'about.faq.a3': '30 minutos.',
    'about.faq.q4': '¿Cuál es la política de cancelación?',
    'about.faq.a4': 'Pendiente...',
    'about.faq.q5': '¿Qué necesito para la sesión?',
    'about.faq.a5': 'Una conexión estable a internet, un dispositivo con micrófono y un espacio tranquilo. Una webcam es recomendada pero opcional.',
    'about.faq.more': '¿Tienes otra pregunta? Estamos aquí para ti.',
    'about.cta.title': '¿Listo para comenzar tu viaje de idiomas?',
    'about.cta.subtitle': 'Encuentra un speaker que te inspire y reserva tu primera sesión hoy. La confianza está solo a un paso de una conversación.',
    'about.cta.button': 'Encuentra un Speaker',
  },
};
