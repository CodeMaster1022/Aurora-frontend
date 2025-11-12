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
  | 'home.howItWorks.subtitle'
  | 'home.howItWorks.step1Title'
  | 'home.howItWorks.step2Title'
  | 'home.howItWorks.step3Title'
  | 'home.howItWorks.step4Title'
  | 'home.howItWorks.step1'
  | 'home.howItWorks.step2'
  | 'home.howItWorks.step3'
  | 'home.howItWorks.step4'
  | 'home.whyDifferent.badge'
  | 'home.whyDifferent.title'
  | 'home.whyDifferent.subtitle'
  | 'home.whyDifferent.point1Title'
  | 'home.whyDifferent.point1'
  | 'home.whyDifferent.point2Title'
  | 'home.whyDifferent.point2'
  | 'home.whyDifferent.point3Title'
  | 'home.whyDifferent.point3'
  | 'home.becomeSpeaker.title'
  | 'home.becomeSpeaker.subtitle'
  | 'home.becomeSpeaker.step1.label'
  | 'home.becomeSpeaker.step1.title'
  | 'home.becomeSpeaker.step1.description'
  | 'home.becomeSpeaker.step2.label'
  | 'home.becomeSpeaker.step2.title'
  | 'home.becomeSpeaker.step2.description'
  | 'home.becomeSpeaker.step3.label'
  | 'home.becomeSpeaker.step3.title'
  | 'home.becomeSpeaker.step3.description'
  | 'home.becomeSpeaker.cta'
  | 'home.speakerCard.age'
  | 'home.speakerCard.book'
  | 'home.speakerCard.free'
  | 'home.footer.terms'
  | 'home.footer.privacy'
  | 'home.footer.tagline'
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
  
  | 'auth.signin.title'
  | 'auth.signin.email'
  | 'auth.signin.password'
  | 'auth.signin.submit'
  | 'auth.signin.loading'
  | 'auth.signin.noAccount'
  | 'auth.signin.signup'
  
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
  | 'dashboard.analytics.sessions'
  | 'dashboard.analytics.range7d'
  | 'dashboard.analytics.range7dLabel'
  | 'dashboard.analytics.range30d'
  | 'dashboard.analytics.range30dLabel'
  | 'dashboard.analytics.scheduled'
  | 'dashboard.analytics.completed'
  | 'dashboard.analytics.cancelled'
  | 'dashboard.analytics.completionRate'
  | 'dashboard.analytics.empty'
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
  | 'learnerDashboard.summary.upcoming'
  | 'learnerDashboard.summary.upcomingHelper'
  | 'learnerDashboard.summary.completed'
  | 'learnerDashboard.summary.completedHelper'
  | 'learnerDashboard.summary.reviewed'
  | 'learnerDashboard.summary.reviewedHelper'
  | 'learnerDashboard.summary.reviewedAvg'
  | 'learnerDashboard.summary.speakers'
  | 'learnerDashboard.summary.speakersHelper'
  | 'learnerDashboard.analytics.title'
  | 'learnerDashboard.analytics.empty'
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
  | 'learnerDashboard.sessions.with'
  | 'learnerDashboard.sessions.icebreaker'
  | 'learnerDashboard.sessions.join'
  | 'learnerDashboard.sessions.cancel'
  | 'learnerDashboard.sessions.rate'
  | 'learnerDashboard.sessions.cancellationReason'
  | 'learnerDashboard.sessionsTab.title'
  | 'learnerDashboard.sessionsTab.subtitle'
  | 'learnerDashboard.sessionsTab.upcoming'
  | 'learnerDashboard.sessionsTab.past'
  | 'learnerDashboard.sessionsTab.next'
  | 'learnerDashboard.sessionsTab.noUpcoming'
  | 'learnerDashboard.sessionsTab.noPast'
  | 'learnerDashboard.reviews.title'
  | 'learnerDashboard.reviews.subtitle'
  | 'learnerDashboard.reviews.noReviews'
  | 'learnerDashboard.reviews.emptyComment'
  | 'learnerDashboard.reviews.sessionLabel'
  | 'learnerDashboard.actionCenter.title'
  | 'learnerDashboard.actionCenter.subtitle'
  | 'learnerDashboard.actionCenter.pendingReviews'
  | 'learnerDashboard.actionCenter.review'
  | 'learnerDashboard.actionCenter.noPending'
  | 'learnerDashboard.actionCenter.startingSoon'
  | 'learnerDashboard.actionCenter.join'
  | 'learnerDashboard.actionCenter.view'
  | 'learnerDashboard.actionCenter.noStartingSoon'
  | 'learnerDashboard.topSpeakers.title'
  | 'learnerDashboard.topSpeakers.subtitle'
  | 'learnerDashboard.topSpeakers.none'
  | 'learnerDashboard.topSpeakers.sessions'
  | 'learnerDashboard.topSpeakers.lastSession'
  | 'learnerDashboard.topSpeakers.noRating'
  | 'learnerDashboard.cancel.title'
  | 'learnerDashboard.cancel.description'
  | 'learnerDashboard.cancel.policy'
  | 'learnerDashboard.cancel.policy24h'
  | 'learnerDashboard.cancel.policyHoursAway'
  | 'learnerDashboard.cancel.policyLessThanHour'
  | 'learnerDashboard.cancel.policyMayNotEligible'
  | 'learnerDashboard.cancel.policyNotify'
  | 'learnerDashboard.cancel.sessionDetails'
  | 'learnerDashboard.cancel.hoursAway'
  | 'learnerDashboard.cancel.reasonLabel'
  | 'learnerDashboard.cancel.reasonPlaceholder'
  | 'learnerDashboard.cancel.keep'
  | 'learnerDashboard.cancel.cancelling'
  | 'learnerDashboard.cancel.confirm'
  | 'learnerProfile.summary.title'
  | 'learnerProfile.summary.description'
  | 'learnerProfile.summary.totalSessions'
  | 'learnerProfile.summary.completed'
  | 'learnerProfile.summary.upcoming'
  | 'learnerProfile.summary.completionRate'
  | 'learnerProfile.summary.nextSession'
  | 'learnerProfile.summary.noUpcoming'
  | 'learnerProfile.summary.rating'
  | 'learnerProfile.recentSessions.title'
  | 'learnerProfile.recentSessions.description'
  | 'learnerProfile.recentSessions.none'

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
  | 'speakerProfile.bookSession.calendarNotConnected'
  | 'speakerProfile.bookSession.speakerCalendarNotConnected'
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
  | 'about.community.card5.title'
  | 'about.community.card5.subtitle'
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
    'header.speakerDashboard': 'Dashboard',
    'header.speakers': 'Speakers',
    'header.login': 'Sign In',
    'header.signup': 'Sign Up',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.discover': 'Discover',
    'header.speaker': 'Speaker',
    
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
    'home.howItWorks.title': 'Practice your speaking',
    'home.howItWorks.subtitle': 'How does it work?',
    'home.howItWorks.step1Title': 'Choose your speaker',
    'home.howItWorks.step2Title': 'Select date and time',
    'home.howItWorks.step3Title': 'Practice and connect',
    'home.howItWorks.step4Title': 'Favorite topics',
    'home.howItWorks.step1': 'Explore their profiles and find someone whose interests match yours.',
    'home.howItWorks.step2': 'Pick a time that works for you from their available slots.',
    'home.howItWorks.step3': 'Enjoy an authentic conversation about topics you both love.',
    'home.howItWorks.step4': 'Speakers have chosen their favorite topics to guide the conversation.',
    'home.whyDifferent.badge': 'You learn with purpose',
    'home.whyDifferent.title': 'Why Aurora is Different',
    'home.whyDifferent.subtitle': 'You learn with purpose: Your practice creates meaningful connections',
    'home.whyDifferent.point1Title': 'You contribute while learning',
    'home.whyDifferent.point1': 'Your practice helps reduce loneliness among seniors and makes them feel valued.',
    'home.whyDifferent.point2Title': 'Real conversations',
    'home.whyDifferent.point2': 'No scripts—just genuine people and real moments that build confidence.',
    'home.whyDifferent.point3Title': 'Mutual impact',
    'home.whyDifferent.point3': 'They help you improve your English; you give them connection and companionship.',
    'home.becomeSpeaker.title': 'Become a Speaker',
    'home.becomeSpeaker.subtitle': 'Share your stories, connect with eager learners, and make a meaningful impact.',
    'home.becomeSpeaker.step1.label': 'Step 1',
    'home.becomeSpeaker.step1.title': 'Register as a speaker',
    'home.becomeSpeaker.step1.description': 'Create your profile and tell us about your experience.',
    'home.becomeSpeaker.step2.label': 'Step 2',
    'home.becomeSpeaker.step2.title': 'Set your availability',
    'home.becomeSpeaker.step2.description': 'Choose the times that work best for you to host conversations.',
    'home.becomeSpeaker.step3.label': 'Step 3',
    'home.becomeSpeaker.step3.title': 'Start connecting and sharing stories',
    'home.becomeSpeaker.step3.description': 'Meet learners, share your stories, and build meaningful conversations.',
    'home.becomeSpeaker.cta': 'Become a Speaker',
    'home.speakerCard.age': 'years old',
    'home.speakerCard.book': 'Book',
    'home.speakerCard.free': 'Free',
    'home.footer.terms': 'Terms and Conditions',
    'home.footer.privacy': 'Privacy Policy',
    'home.footer.tagline': 'Making connections that matter.',
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
    
    'auth.signin.title': 'Aurora',
    'auth.signin.email': 'Email Address',
    'auth.signin.password': 'Password',
    'auth.signin.submit': 'Sign In',
    'auth.signin.loading': 'Signing in...',
    'auth.signin.noAccount': "Don't have an account?",
    'auth.signin.signup': 'Sign up',
    
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
    'dashboard.analytics.sessions': 'Sessions analytics',
    'dashboard.analytics.range7d': '7 days',
    'dashboard.analytics.range7dLabel': 'Last 7 days',
    'dashboard.analytics.range30d': '30 days',
    'dashboard.analytics.range30dLabel': 'Last 30 days',
    'dashboard.analytics.scheduled': 'Scheduled',
    'dashboard.analytics.completed': 'Completed',
    'dashboard.analytics.cancelled': 'Cancelled',
    'dashboard.analytics.completionRate': 'Completion rate',
    'dashboard.analytics.empty': 'Not enough session activity to display analytics yet.',
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
    'learnerDashboard.summary.upcoming': 'Upcoming',
    'learnerDashboard.summary.upcomingHelper': 'No sessions scheduled yet',
    'learnerDashboard.summary.completed': 'Completed',
    'learnerDashboard.summary.completedHelper': 'Total sessions completed',
    'learnerDashboard.summary.reviewed': 'Reviews',
    'learnerDashboard.summary.reviewedHelper': 'No reviews yet',
    'learnerDashboard.summary.reviewedAvg': 'Average rating',
    'learnerDashboard.summary.speakers': 'Top Speakers',
    'learnerDashboard.summary.speakersHelper': 'Connect with more speakers',
    'learnerDashboard.analytics.title': 'Learning Overview',
    'learnerDashboard.analytics.empty': 'No session activity yet',
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
    'learnerDashboard.sessions.with': 'with',
    'learnerDashboard.sessions.icebreaker': 'Icebreaker',
    'learnerDashboard.sessions.join': 'Join Meeting →',
    'learnerDashboard.sessions.cancel': 'Cancel Session',
    'learnerDashboard.sessions.rate': 'Rate Session',
    'learnerDashboard.sessions.cancellationReason': 'Cancellation reason:',
    'learnerDashboard.sessionsTab.title': 'Sessions',
    'learnerDashboard.sessionsTab.subtitle': 'Overview of your upcoming and past sessions',
    'learnerDashboard.sessionsTab.upcoming': 'Upcoming',
    'learnerDashboard.sessionsTab.past': 'Past',
    'learnerDashboard.sessionsTab.next': 'Next session:',
    'learnerDashboard.sessionsTab.noUpcoming': 'No upcoming sessions right now',
    'learnerDashboard.sessionsTab.noPast': 'No past sessions yet',
    'learnerDashboard.reviews.title': 'Session Reviews',
    'learnerDashboard.reviews.subtitle': 'All feedback from your speakers',
    'learnerDashboard.reviews.noReviews': 'No reviews yet',
    'learnerDashboard.reviews.emptyComment': 'No comment provided.',
    'learnerDashboard.reviews.sessionLabel': 'Session',
    'learnerDashboard.actionCenter.title': 'Action Center',
    'learnerDashboard.actionCenter.subtitle': 'Stay ahead of your sessions',
    'learnerDashboard.actionCenter.pendingReviews': 'Pending reviews',
    'learnerDashboard.actionCenter.review': 'Review',
    'learnerDashboard.actionCenter.noPending': 'Nothing needs your review right now',
    'learnerDashboard.actionCenter.startingSoon': 'Starting soon',
    'learnerDashboard.actionCenter.join': 'Join',
    'learnerDashboard.actionCenter.view': 'View',
    'learnerDashboard.actionCenter.noStartingSoon': 'No sessions starting in the next 24 hours',
    'learnerDashboard.topSpeakers.title': 'Top Speakers',
    'learnerDashboard.topSpeakers.subtitle': 'Based on your completed sessions',
    'learnerDashboard.topSpeakers.none': 'No speaker history yet',
    'learnerDashboard.topSpeakers.sessions': 'sessions together',
    'learnerDashboard.topSpeakers.lastSession': 'Last session:',
    'learnerDashboard.topSpeakers.noRating': 'No rating yet',
    'learnerDashboard.cancel.title': 'Cancel Session',
    'learnerDashboard.cancel.description': 'Confirm you want to cancel this session.',
    'learnerDashboard.cancel.policy': 'Cancellation Policy',
    'learnerDashboard.cancel.policy24h': 'Sessions must be cancelled at least 24 hours before the scheduled time',
    'learnerDashboard.cancel.policyHoursAway': 'hours away',
    'learnerDashboard.cancel.policyLessThanHour': 'less than an hour away',
    'learnerDashboard.cancel.policyMayNotEligible': '(May not be eligible for cancellation)',
    'learnerDashboard.cancel.policyNotify': 'The speaker will be automatically notified of the cancellation',
    'learnerDashboard.cancel.sessionDetails': 'Session Details',
    'learnerDashboard.cancel.hoursAway': 'hours away',
    'learnerDashboard.cancel.reasonLabel': 'Reason for Cancellation (Optional)',
    'learnerDashboard.cancel.reasonPlaceholder': 'Please let us know why you\'re cancelling...',
    'learnerDashboard.cancel.keep': 'Keep Session',
    'learnerDashboard.cancel.cancelling': 'Cancelling...',
    'learnerDashboard.cancel.confirm': 'Confirm Cancellation',
    'learnerProfile.summary.title': 'Learning Summary',
    'learnerProfile.summary.description': 'Snapshot of your progress and upcoming sessions',
    'learnerProfile.summary.totalSessions': 'Total Sessions',
    'learnerProfile.summary.completed': 'Completed',
    'learnerProfile.summary.upcoming': 'Upcoming',
    'learnerProfile.summary.completionRate': 'Completion Rate',
    'learnerProfile.summary.nextSession': 'Next session',
    'learnerProfile.summary.noUpcoming': 'No upcoming sessions yet',
    'learnerProfile.summary.rating': 'Average rating',
    'learnerProfile.recentSessions.title': 'Recent Sessions',
    'learnerProfile.recentSessions.description': 'Last sessions you completed',
    'learnerProfile.recentSessions.none': 'No sessions recorded yet',

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
    'speakerProfile.bookSession.speakerCalendarNotConnected': 'This speaker has not connected their calendar yet. Booking is unavailable.',
    'speakerProfile.bookSession.allFieldsRequired': 'Please fill in all required fields',
    'speakerProfile.bookSession.maxTopics': 'Maximum 2 topics allowed',
    'speakerProfile.bookSession.confirmBooking': 'Confirm Booking',
    'speakerProfile.bookSession.booking': 'Booking...',
    'speakerProfile.bookSession.failed': 'Failed to book session',
    'speakerProfile.bookSession.unavailableDay': 'Speaker is not available on',
    'speakerProfile.bookSession.timeNotInRange': 'Speaker is only available between',
    'speakerProfile.bookSession.anonymous': 'Anonymous',
    'speakerProfile.bookSession.noReviews': 'No reviews yet',
    'speakerProfile.bookSession.calendarNotConnected': 'Your calendar is not connected. Please connect it to book sessions.',

    // About Page
    'about.hero.badge': 'Our Story',
    'about.hero.title': 'Aurora: Bringing English to Life',
    'about.hero.subtitle': 'We believe language unlocks opportunity. Aurora connects learners with kind, inspiring speakers for warm, human conversations that build confidence—one meaningful session at a time.',
    'about.story.title': 'The Story of Aurora',
    'about.story.p1': 'If you are new here, my name is Monica Medina and my mission in life is communication—helping people to communicate and helping people to feel happy. \n\nI have been teaching English, at multiple levels, including children and adults, since 1988. Besides teaching, I have a special chemistry with elderly people. They are living treasures, as they possess a thorough encyclopedia within, and an exceptional storybook of experiences. I have prepared hundreds of English students to be successful in the language. They have become better people!',
    'about.story.p2': 'From living rooms to laptops, from nerves to smiles—Aurora is where learners show up as themselves and leave a little braver every time.\n\n',
    'about.mission.title': 'Our Mission',
    'about.mission.p1': 'To make English practice accessible, human, and joyful—by matching learners with thoughtful speakers and giving them everything they need to connect, grow, and belong.',
    'about.mission.point1': 'Warm, one‑to‑one sessions that build confidence',
    'about.mission.point2': 'Diverse speakers with real‑world experience',
    'about.mission.point3': 'Flexible scheduling that fits real life',
    'about.mission.cards.warm.title': 'Warm Sessions',
    'about.mission.cards.warm.description': 'One-to-one conversations that build confidence naturally',
    'about.mission.cards.diverse.title': 'Diverse Speakers',
    'about.mission.cards.diverse.description': 'Real people with real-world experience and stories to share',
    'about.mission.cards.flexible.title': 'Flexible Scheduling',
    'about.mission.cards.flexible.description': 'Book sessions that fit your schedule and learning pace',
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
    'about.community.card5.title': 'Events',
    'about.community.card5.subtitle': 'Connecting in real life',
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
    'header.speakerDashboard': 'Panel',
    'header.speakers': 'Speakers',
    'header.login': 'Inicia sesión',
    'header.signup': 'Regístrate',
    'header.profile': 'Perfil',
    'header.logout': 'Cerrar sesión',
    'header.discover': 'Descubrir',
    'header.speaker': 'Speaker',
    
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
    'home.howItWorks.title': 'Practica tu speaking',
    'home.howItWorks.subtitle': '¿Cómo funciona?',
    'home.howItWorks.step1Title': 'Elige tu speaker',
    'home.howItWorks.step2Title': 'Selecciona fecha y hora',
    'home.howItWorks.step3Title': 'Practica y conecta',
    'home.howItWorks.step4Title': 'Temas favoritos',
    'home.howItWorks.step1': 'Explora sus perfiles y encuentra a alguien cuyos intereses coincidan contigo.',
    'home.howItWorks.step2': 'Elige un horario que funcione para ti entre sus espacios disponibles.',
    'home.howItWorks.step3': 'Disfruta de una conversación auténtica sobre temas que ambos aman.',
    'home.howItWorks.step4': 'Los speakers han elegido sus temas favoritos para guiar la conversación.',
    'home.whyDifferent.badge': 'Aprendes con propósito',
    'home.whyDifferent.title': 'Por qué Aurora es diferente',
    'home.whyDifferent.subtitle': 'Aprendes con propósito: tu práctica crea conexiones significativas',
    'home.whyDifferent.point1Title': 'Contribuyes mientras aprendes',
    'home.whyDifferent.point1': 'Tu práctica ayuda a reducir la soledad en las personas mayores y las hace sentir valoradas.',
    'home.whyDifferent.point2Title': 'Conversaciones reales',
    'home.whyDifferent.point2': 'Sin guiones: solo personas genuinas y momentos reales que construyen confianza.',
    'home.whyDifferent.point3Title': 'Impacto mutuo',
    'home.whyDifferent.point3': 'Ellos te ayudan a mejorar tu inglés; tú les brindas conexión y compañía.',
    'home.becomeSpeaker.title': 'Conviértete en Speaker',
    'home.becomeSpeaker.subtitle': 'Comparte tus historias, conecta con aprendices motivados y genera un impacto significativo.',
    'home.becomeSpeaker.step1.label': 'Paso 1',
    'home.becomeSpeaker.step1.title': 'Regístrate como speaker',
    'home.becomeSpeaker.step1.description': 'Crea tu perfil y cuéntanos sobre tu experiencia.',
    'home.becomeSpeaker.step2.label': 'Paso 2',
    'home.becomeSpeaker.step2.title': 'Configura tu disponibilidad',
    'home.becomeSpeaker.step2.description': 'Elige los horarios que mejor se adapten a ti para conversar.',
    'home.becomeSpeaker.step3.label': 'Paso 3',
    'home.becomeSpeaker.step3.title': 'Comienza a conectar y compartir historias',
    'home.becomeSpeaker.step3.description': 'Conoce aprendices, comparte tus historias y crea conversaciones significativas.',
    'home.becomeSpeaker.cta': 'Convertirme en Speaker',
    'home.speakerCard.age': 'años',
    'home.speakerCard.book': 'Agenda',
    'home.speakerCard.free': 'Gratis',
    'home.footer.terms': 'Términos y Condiciones',
    'home.footer.privacy': 'Aviso de Privacidad',
    'home.footer.tagline': 'Creando conexiones que importan.',
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
    'auth.signup.validate.lastNameInvalid': 'El apellido solo puede contener letras',
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
    
    'auth.signin.title': 'Aurora',
    'auth.signin.email': 'Correo Electrónico',
    'auth.signin.password': 'Contraseña',
    'auth.signin.submit': 'Iniciar Sesión',
    'auth.signin.loading': 'Iniciando sesión...',
    'auth.signin.noAccount': '¿No tienes una cuenta?',
    'auth.signin.signup': 'Regístrate',
    
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
    'dashboard.analytics.sessions': 'Analítica de sesiones',
    'dashboard.analytics.range7d': '7 días',
    'dashboard.analytics.range7dLabel': 'Últimos 7 días',
    'dashboard.analytics.range30d': '30 días',
    'dashboard.analytics.range30dLabel': 'Últimos 30 días',
    'dashboard.analytics.scheduled': 'Programadas',
    'dashboard.analytics.completed': 'Completadas',
    'dashboard.analytics.cancelled': 'Canceladas',
    'dashboard.analytics.completionRate': 'Tasa de finalización',
    'dashboard.analytics.empty': 'Aún no hay suficiente actividad para mostrar analíticas.',
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
    'learnerDashboard.summary.upcoming': 'Próximas',
    'learnerDashboard.summary.upcomingHelper': 'Aún no hay sesiones programadas',
    'learnerDashboard.summary.completed': 'Completadas',
    'learnerDashboard.summary.completedHelper': 'Total de sesiones completadas',
    'learnerDashboard.summary.reviewed': 'Reseñas',
    'learnerDashboard.summary.reviewedHelper': 'Aún no tienes reseñas',
    'learnerDashboard.summary.reviewedAvg': 'Calificación promedio',
    'learnerDashboard.summary.speakers': 'Speakers Destacados',
    'learnerDashboard.summary.speakersHelper': 'Conecta con más speakers',
    'learnerDashboard.analytics.title': 'Resumen de Aprendizaje',
    'learnerDashboard.analytics.empty': 'Aún no hay actividad de sesiones',
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
    'learnerDashboard.sessions.with': 'con',
    'learnerDashboard.sessions.icebreaker': 'Rompehielos',
    'learnerDashboard.sessions.join': 'Unirse a la Reunión →',
    'learnerDashboard.sessions.cancel': 'Cancelar sesión',
    'learnerDashboard.sessions.rate': 'Calificar sesión',
    'learnerDashboard.sessions.cancellationReason': 'Razón de cancelación:',
    'learnerDashboard.sessionsTab.title': 'Sesiones',
    'learnerDashboard.sessionsTab.subtitle': 'Resumen de tus sesiones próximas y pasadas',
    'learnerDashboard.sessionsTab.upcoming': 'Próximas',
    'learnerDashboard.sessionsTab.past': 'Pasadas',
    'learnerDashboard.sessionsTab.next': 'Próxima sesión:',
    'learnerDashboard.sessionsTab.noUpcoming': 'No hay sesiones próximas en este momento',
    'learnerDashboard.sessionsTab.noPast': 'Aún no hay sesiones pasadas',
    'learnerDashboard.reviews.title': 'Reseñas de Sesiones',
    'learnerDashboard.reviews.subtitle': 'Todo el feedback de tus speakers',
    'learnerDashboard.reviews.noReviews': 'Aún no tienes reseñas',
    'learnerDashboard.reviews.emptyComment': 'Sin comentario.',
    'learnerDashboard.reviews.sessionLabel': 'Sesión',
    'learnerDashboard.actionCenter.title': 'Centro de Acción',
    'learnerDashboard.actionCenter.subtitle': 'Mantente al día con tus sesiones',
    'learnerDashboard.actionCenter.pendingReviews': 'Reseñas pendientes',
    'learnerDashboard.actionCenter.review': 'Reseñar',
    'learnerDashboard.actionCenter.noPending': 'No tienes reseñas pendientes',
    'learnerDashboard.actionCenter.startingSoon': 'Comienzan pronto',
    'learnerDashboard.actionCenter.join': 'Unirse',
    'learnerDashboard.actionCenter.view': 'Ver',
    'learnerDashboard.actionCenter.noStartingSoon': 'No hay sesiones que comiencen en las próximas 24 horas',
    'learnerDashboard.topSpeakers.title': 'Speakers destacados',
    'learnerDashboard.topSpeakers.subtitle': 'Según tus sesiones completadas',
    'learnerDashboard.topSpeakers.none': 'Aún no tienes historial con speakers',
    'learnerDashboard.topSpeakers.sessions': 'sesiones juntos',
    'learnerDashboard.topSpeakers.lastSession': 'Última sesión:',
    'learnerDashboard.topSpeakers.noRating': 'Sin calificación',
    'learnerDashboard.cancel.title': 'Cancelar Sesión',
    'learnerDashboard.cancel.description': 'Confirma que deseas cancelar esta sesión.',
    'learnerDashboard.cancel.policy': 'Política de Cancelación',
    'learnerDashboard.cancel.policy24h': 'Las sesiones deben cancelarse al menos 24 horas antes de la hora programada',
    'learnerDashboard.cancel.policyHoursAway': 'horas de distancia',
    'learnerDashboard.cancel.policyLessThanHour': 'menos de una hora de distancia',
    'learnerDashboard.cancel.policyMayNotEligible': '(Puede no ser elegible para cancelación)',
    'learnerDashboard.cancel.policyNotify': 'El speaker será notificado automáticamente de la cancelación',
    'learnerDashboard.cancel.sessionDetails': 'Detalles de la Sesión',
    'learnerDashboard.cancel.hoursAway': 'horas de distancia',
    'learnerDashboard.cancel.reasonLabel': 'Razón de Cancelación (Opcional)',
    'learnerDashboard.cancel.reasonPlaceholder': 'Por favor cuéntanos por qué estás cancelando...',
    'learnerDashboard.cancel.keep': 'Mantener Sesión',
    'learnerDashboard.cancel.cancelling': 'Cancelando...',
    'learnerDashboard.cancel.confirm': 'Confirmar Cancelación',
    'learnerProfile.summary.title': 'Resumen de Aprendizaje',
    'learnerProfile.summary.description': 'Instantánea de tu progreso y próximas sesiones',
    'learnerProfile.summary.totalSessions': 'Sesiones Totales',
    'learnerProfile.summary.completed': 'Completadas',
    'learnerProfile.summary.upcoming': 'Próximas',
    'learnerProfile.summary.completionRate': 'Tasa de finalización',
    'learnerProfile.summary.nextSession': 'Próxima sesión',
    'learnerProfile.summary.noUpcoming': 'Aún no hay sesiones próximas',
    'learnerProfile.summary.rating': 'Calificación promedio',
    'learnerProfile.recentSessions.title': 'Sesiones Recientes',
    'learnerProfile.recentSessions.description': 'Tus últimas sesiones completadas',
    'learnerProfile.recentSessions.none': 'Aún no hay sesiones registradas',

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
    'speakerProfile.bookSession.speakerCalendarNotConnected': 'Este speaker aún no ha conectado su calendario. Las reservas no están disponibles.',
    'speakerProfile.bookSession.allFieldsRequired': 'Por favor completa todos los campos requeridos',
    'speakerProfile.bookSession.maxTopics': 'Máximo 2 temas permitidos',
    'speakerProfile.bookSession.confirmBooking': 'Confirmar Reserva',
    'speakerProfile.bookSession.booking': 'Reservando...',
    'speakerProfile.bookSession.failed': 'Error al reservar sesión',
    'speakerProfile.bookSession.unavailableDay': 'El speaker no está disponible el',
    'speakerProfile.bookSession.timeNotInRange': 'El speaker solo está disponible entre',
    'speakerProfile.bookSession.anonymous': 'Anónimo',
    'speakerProfile.bookSession.noReviews': 'Aún no hay reseñas',
    'speakerProfile.bookSession.calendarNotConnected': 'Tu calendario no está conectado. Por favor conéctalo para reservar sesiones.',

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
    'about.mission.cards.warm.title': 'Sesiones Cálidas',
    'about.mission.cards.warm.description': 'Conversaciones uno a uno que generan confianza de forma natural',
    'about.mission.cards.diverse.title': 'Hablantes Diversos',
    'about.mission.cards.diverse.description': 'Personas reales con experiencias e historias del mundo real',
    'about.mission.cards.flexible.title': 'Programación Flexible',
    'about.mission.cards.flexible.description': 'Reserva sesiones que se ajusten a tu horario y ritmo de aprendizaje',
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
    'about.community.card5.title': 'Eventos',
    'about.community.card5.subtitle': 'Conectando en la vida real',
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
