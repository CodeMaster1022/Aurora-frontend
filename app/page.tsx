"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FloatingCards } from "@/components/floating-cards"
import { Play, ArrowRight, BookOpen, Users, Award, FileText, Calendar, UserCheck, Grid3X3, Square, Eye, CheckCircle, X, Send, Star, Download, Volume2, MessageCircle, CalendarDays, FastForward, Loader2, Search, Heart, UserPlus, Share2 } from "lucide-react"
import Image from "next/image"

import grandfatherImage from "@/public/image/grandfather.png"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useRouter } from "next/navigation"
import { learnerService } from "@/lib/services/learnerService"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [speakers, setSpeakers] = useState<any[]>([])
  const [filteredSpeakers, setFilteredSpeakers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSpeakers()
  }, [])

  const fetchSpeakers = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakers()
      if (response.success) {
        setSpeakers(response.data.speakers)
        setFilteredSpeakers(response.data.speakers.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const heroSubtitleText = "Connect with inspiring speakers and mentors who ignite your language journey."
  const heroSecondaryCtaText = "Watch intro"

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="relative"> 
        <section className="relative overflow-hidden flex items-center justify-center min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F7F2FF] via-[#EEE8FF] to-[#FBF6FF] dark:from-[#080A18] dark:via-[#161B2D] dark:to-[#3B82F6] transition-colors duration-700" />
          <div
            className="absolute inset-0 opacity-60 dark:opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(124, 101, 255, 0.12), rgba(124, 101, 255, 0))",
            }}
          />
          <div
            className="absolute inset-0 opacity-25 dark:opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0,rgba(255,255,255,0)_60%)] mix-blend-soft-light opacity-50" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(228,223,255,0.55),transparent_65%)] blur-[140px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-3 py-4 sm:py-8 lg:py-12 relative z-10 w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="space-y-6 sm:space-y-8 order-2  text-center">
                <div className="space-y-4">
                  {/* "Never stop learning" badge */}
                  <div className="inline-block text-[#7357F5] px-4 py-2 text-5xl font-bold">
                    {t('home.badge')}
                  </div>
                  
                  {/* Main headline - 3 lines */}
                  <h1 className="text-lg sm:text-lg lg:text-xl font-bold text-foreground leading-tight transition-colors duration-300">
                    <span className="text-[#524FD5] dark:text-[#A393FF] block transition-colors">{t('home.title.line1')} {t('home.title.line2')} {t('home.title.line3')}</span>
                  </h1>

                  <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                    {heroSubtitleText}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-purple-300" style={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #0EA5E9 100%)" }}>
                      <span>{t('home.cta.explore')}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="absolute -inset-px rounded-full border border-white/20" aria-hidden="true" />
                    </button>

                    <button className="inline-flex cursor-pointer items-center text-[#6b3bbd] gap-2 rounded-full bg-white/80 dark:bg-slate-900/50 px-6 py-3 text-sm font-medium dark:text-slate-100 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-colors" onClick={() => router.push('/about')}>
                      <Play className="w-4 h-4 fill-current text-[#6b3bbd]" />
                      {heroSecondaryCtaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>   


        {/* Popular Speakers Section */}
        <section className="bg-background py-16 sm:py-20 lg:py-24 -mt-1 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-colors duration-300">
                {t('home.popularSpeakers')}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed transition-colors duration-300">
                {t('home.popularSpeakersDesc')}
              </p>
            </div>

            {/* Speaker Cards Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#524FD5]" />
              </div>
            ) : filteredSpeakers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredSpeakers.map((speaker) => (
                  <div
                    key={speaker._id}
                    className="bg-card text-card-foreground backdrop-blur-sm border border-border/60 rounded-3xl shadow-lg p-6 flex flex-col gap-5 h-full transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 rounded-full border-4 border-indigo-100 bg-gradient-to-br from-indigo-100 to-cyan-100 overflow-hidden flex items-center justify-center text-indigo-600 font-semibold text-xl">
                        {speaker.avatar ? (
                          <Image
                            src={speaker.avatar}
                            alt={`${speaker.firstname || ''} ${speaker.lastname || ''}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized
                          />
                        ) : (
                          <span>
                            {speaker.firstname?.[0] || ''}
                            {speaker.lastname?.[0] || ''}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">
                          {speaker.firstname} {speaker.lastname}
                        </h3>
                        {(speaker.age || speaker.location) && (
                          <p className="text-sm text-muted-foreground transition-colors duration-300">
                            {[speaker.age ? `${speaker.age} ${t('home.speakerCard.age')}` : null, speaker.location]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        )}
                        {(() => {
                          const ratingValue =
                            typeof speaker.rating === 'number'
                              ? speaker.rating
                              : typeof speaker.averageRating === 'number'
                                ? speaker.averageRating
                                : undefined
                          const reviewCount =
                            speaker.reviewsCount ??
                            speaker.reviewCount ??
                            speaker.totalReviews ??
                            (Array.isArray(speaker.reviews) ? speaker.reviews.length : undefined)
                          if (!ratingValue && !reviewCount) {
                            return null
                          }
                          return (
                            <div className="mt-2 flex items-center gap-1 text-indigo-500 dark:text-indigo-300 text-sm font-medium transition-colors duration-300">
                              <Star className="w-4 h-4 fill-current stroke-0" />
                              <span>{ratingValue ? ratingValue.toFixed(1) : 'New'}</span>
                              {reviewCount ? (
                                <span className="text-slate-400 dark:text-slate-500 font-normal">({reviewCount})</span>
                              ) : null}
                            </div>
                          )
                        })()}
                      </div>
                    </div>

                    {speaker.bio && (
                      <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                        {speaker.bio}
                      </p>
                    )}

                    {speaker.interests && speaker.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {speaker.interests.slice(0, 4).map((interest: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[#7357F5] text-white text-xs font-medium px-3 py-1"
                          >
                            {interest}
                          </span>
                        ))}
                        {speaker.interests.length > 4 && (
                          <span className="rounded-full border border-border/60 text-muted-foreground text-xs font-medium px-3 py-1 transition-colors duration-300">
                            +{speaker.interests.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link href={`/speakers/${speaker._id}`}>
                        <button className="w-full cursor-pointer rounded-xl border border-border bg-transparent py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/20">
                          {t('home.speakerCard.book')}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  {speakers.length === 0
                    ? "No speakers available at the moment."
                    : "No speakers to display right now."}
                </p>
              </div>
            )}

            {/* Ver todos Button */}
            <div className="text-center flex justify-center">
              <Link href="/speakers">
                <button className="flex cursor-pointer bg-card text-primary px-4 py-2 rounded-lg font-medium border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                  View All Speakers <ArrowRight className="w-4 h-4 mt-1" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-background dark:bg-slate-950 pb-16 sm:pb-20 lg:pb-24 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* <p className="text-sm font-semibold tracking-[0.2em] text-[#7357F5] uppercase mb-4">
              {t('home.howItWorks.badge')}
            </p> */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-colors duration-300">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-12 transition-colors duration-300">
              {t('home.howItWorks.subtitle')}
            </p>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Search,
                  title: t('home.howItWorks.step1Title'),
                  description: t('home.howItWorks.step1'),
                },
                {
                  icon: CalendarDays,
                  title: t('home.howItWorks.step2Title'),
                  description: t('home.howItWorks.step2'),
                },
                {
                  icon: MessageCircle,
                  title: t('home.howItWorks.step3Title'),
                  description: t('home.howItWorks.step3'),
                },
                {
                  icon: Heart,
                  title: t('home.howItWorks.step4Title'),
                  description: t('home.howItWorks.step4'),
                },
              ].map(({ icon: Icon, title, description }, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center text-center gap-4 rounded-2xl cursor-pointer transition-all px-6 py-8 duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F1ECFF] to-[#E7F8FF] dark:from-[#2A1B5C] dark:to-[#1A1F3F] text-[#7357F5] dark:text-[#B9A6FF] shadow-inner transition-colors duration-300">
                    <div className="absolute inset-[6px] rounded-full bg-white/80 dark:bg-slate-900/90" />
                    <Icon className="relative z-[1] h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed transition-colors duration-300">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-background dark:bg-slate-950 py-20 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground transition-colors duration-300">
              {t('home.whyDifferent.title')}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground transition-colors duration-300">
              {t('home.whyDifferent.subtitle')}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: Heart,
                  title: t('home.whyDifferent.point1Title'),
                  description: t('home.whyDifferent.point1'),
                },
                {
                  icon: MessageCircle,
                  title: t('home.whyDifferent.point2Title'),
                  description: t('home.whyDifferent.point2'),
                },
                {
                  icon: Users,
                  title: t('home.whyDifferent.point3Title'),
                  description: t('home.whyDifferent.point3'),
                },
              ].map(({ icon: Icon, title, description }, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center text-center gap-4 rounded-2xl border border-border bg-card cursor-pointer transition-all px-6 py-8 duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F1ECFF] to-[#E7F8FF] dark:from-[#2A1B5C] dark:to-[#1A1F3F] text-[#7357F5] dark:text-[#B9A6FF] shadow-inner transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed transition-colors duration-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Become a Speaker Section */}
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-gradient-to-r from-[#5A32B5] via-[#6C3BDC] to-[#9446FF] dark:from-[#301868] dark:via-[#261356] dark:to-[#1A0D41] px-6 py-8 shadow-xl text-center text-white transition-colors duration-300">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {t('home.becomeSpeaker.title')}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80">
              {t('home.becomeSpeaker.subtitle')}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  icon: UserPlus,
                  label: t('home.becomeSpeaker.step1.label'),
                  title: t('home.becomeSpeaker.step1.title'),
                  description: t('home.becomeSpeaker.step1.description'),
                },
                {
                  icon: Calendar,
                  label: t('home.becomeSpeaker.step2.label'),
                  title: t('home.becomeSpeaker.step2.title'),
                  description: t('home.becomeSpeaker.step2.description'),
                },
                {
                  icon: Share2,
                  label: t('home.becomeSpeaker.step3.label'),
                  title: t('home.becomeSpeaker.step3.title'),
                  description: t('home.becomeSpeaker.step3.description'),
                },
              ].map(({ icon: Icon, label, title, description }) => (
                <div key={label} className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-inner">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    {label}
                  </p>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-white/80">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.push('/auth/speaker/signup')}
                className="group inline-flex items-center gap-2 rounded-full bg-white text-[#5A32B5] dark:bg-[#D8CCFF] dark:text-[#2B1666] px-8 py-3 text-sm font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {t('home.becomeSpeaker.cta')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
        <footer className="border-t border-border bg-background transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 md:pb-12 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xl font-semibold tracking-wide text-primary transition-colors duration-300">Aurora</span>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                  {t('home.footer.terms')}
                </Link>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  {t('home.footer.privacy')}
                </Link>
              </div>
            </div>
            <p className="mt-6 text-sm">
              {t('home.footer.tagline')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">
              {t('home.footer.copyright')}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}