"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FloatingCards } from "@/components/floating-cards"
import { Play, ArrowRight, BookOpen, Users, Award, FileText, Calendar, UserCheck, Grid3X3, Square, Eye, CheckCircle, X, Send, Star, Download, Volume2, MessageCircle, CalendarDays, FastForward, Loader2, Search, Heart, UserPlus, Share2 } from "lucide-react"
import Image from "next/image"
import studentImage from "@/public/image/student.png"
import grandmother1 from "@/public/image/1.jpeg"
import grandmother2 from "@/public/image/2.jpeg"
import grandmother3 from "@/public/image/3.jpeg"
import SpeakersPage from "./speakers/page"
import grandfatherImage from "@/public/image/grandfather.png"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useRouter } from "next/navigation"
import { learnerService } from "@/lib/services/learnerService"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const DEFAULT_SPEAKERS = [
  {
    id: "default-1",
    name: "Margaret Thompson",
    age: 68,
    location: "Boston, MA",
    rating: 4.9,
    ratingCount: 127,
    bio: "Retired history teacher with stories from 40 years in education.",
    tags: ["Travel", "History", "Cooking", "Culture"],
    avatar: grandmother1,
  },
  {
    id: "default-2",
    name: "Robert Williams",
    age: 72,
    location: "Seattle, WA",
    rating: 5,
    ratingCount: 89,
    bio: "Former engineer who loves sharing knowledge about the world.",
    tags: ["Technology", "Science", "Nature", "Music"],
    avatar: grandfatherImage,
  },
  {
    id: "default-3",
    name: "Dorothy Martinez",
    age: 65,
    location: "Austin, TX",
    rating: 4.8,
    ratingCount: 156,
    bio: "Retired librarian passionate about books and storytelling.",
    tags: ["Art", "Literature", "Gardening", "Family"],
    avatar: grandmother2,
  },
] as const

const HOW_IT_WORKS_STEPS = [
  { icon: Search, key: "home.howItWorks.step1" },
  { icon: Calendar, key: "home.howItWorks.step2" },
  { icon: MessageCircle, key: "home.howItWorks.step3" },
  { icon: Heart, key: "home.howItWorks.step4" },
] as const

const WHY_DIFFERENT_CARDS = [
  { icon: Heart, key: "home.whyDifferent.point1" },
  { icon: MessageCircle, key: "home.whyDifferent.point2" },
  { icon: Users, key: "home.whyDifferent.point3" },
] as const

const BECOME_SPEAKER_STEPS = [
  {
    icon: UserPlus,
    labelKey: "home.becomeSpeaker.steps.step1.label",
    descriptionKey: "home.becomeSpeaker.point1",
  },
  {
    icon: Calendar,
    labelKey: "home.becomeSpeaker.steps.step2.label",
    descriptionKey: "home.becomeSpeaker.point2",
  },
  {
    icon: Share2,
    labelKey: "home.becomeSpeaker.steps.step3.label",
    descriptionKey: "home.becomeSpeaker.point3",
  },
] as const

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [featuredSpeakers, setFeaturedSpeakers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSpeakers()
  }, [])

  const fetchSpeakers = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakers()
      if (response.success) {
        setFeaturedSpeakers(response.data.speakers.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className="sm:hidden">
        <SpeakersPage />
      </div>
      <div className="hidden sm:block">
        <div className="min-h-screen relative overflow-hidden">
          {/* <Header /> */}
          <main className="relative overflow-hidden"> 
        <section className="relative isolate overflow-hidden  py-24 transition-colors dark:from-[hsl(220deg_20.41%_19.09%)] dark:via-[hsl(220deg_23%_15%)] dark:to-[hsl(220deg_26%_10%)] sm:py-28">
          <div className="absolute inset-0 -z-10 opacity-40 blur-3xl filter">
            <div className="mx-auto h-full w-full max-w-5xl rounded-full bg-primary/30 dark:bg-primary/20" />
          </div>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center sm:px-8">
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("home.badge")}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
              {t("home.hero.subtitle")}
            </p>
            <Button
              size="lg"
              className="mt-2 text-white rounded-lg px-8 shadow-lg shadow-primary/25 bg-[#72309F] transition hover:shadow-primary/35"
              asChild
            >
              <Link href="/speakers">
                {t("home.cta.explore")}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
        {/* Popular Speakers Section */}
        <section className="relative -mt-1 bg-muted py-20 transition-colors dark:bg-[hsl(220deg_20.41%_19.09%)] sm:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white/70 to-transparent dark:from-white/5" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-[2.75rem]">
                {t("home.popularSpeakers")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg lg:text-xl">
                {t("home.popularSpeakersDesc")}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(featuredSpeakers.length > 0 ? featuredSpeakers : DEFAULT_SPEAKERS).map((speaker: any, idx: number) => {
                    const isApiSpeaker = featuredSpeakers.length > 0
                    const fullName = isApiSpeaker
                      ? `${speaker.firstname ?? ""} ${speaker.lastname ?? ""}`.trim() || speaker.email
                      : speaker.name
                    const age = isApiSpeaker ? speaker.age : speaker.age
                    const location = isApiSpeaker
                      ? [speaker.city, speaker.country].filter(Boolean).join(", ") ||
                        speaker.location ||
                        ""
                      : speaker.location
                    const ratingValue = isApiSpeaker ? speaker.rating ?? null : speaker.rating
                    const ratingCount = isApiSpeaker
                      ? speaker.reviewsCount ?? speaker.ratingCount ?? speaker.reviews?.length ?? null
                      : speaker.ratingCount
                    const bio = isApiSpeaker
                      ? speaker.bio || "This speaker loves connecting through meaningful conversations."
                      : speaker.bio
                    const tags = isApiSpeaker
                      ? (speaker.interests && speaker.interests.length > 0
                          ? speaker.interests.slice(0, 4)
                          : [])
                      : speaker.tags
                    const avatarSrc = isApiSpeaker ? speaker.avatar : speaker.avatar
                    const initials = fullName
                      .split(" ")
                      .filter(Boolean)
                      .map((part: string) => part[0])
                      .join("")
                      .slice(0, 2)

                    return (
                      <div
                        key={isApiSpeaker ? speaker._id ?? idx : speaker.id}
                        className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-card p-6 shadow-[0_20px_60px_rgba(116,108,255,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(116,108,255,0.12)]"
                      >
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-border/40 bg-muted">
                              {avatarSrc ? (
                                <Image
                                  src={avatarSrc}
                                  alt={fullName}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                  priority={idx === 0}
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary">
                                  {initials}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {fullName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {[age ? `${age} ${t("home.speakerCard.age")}` : null, location]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </p>
                              {ratingValue && (
                                <div className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span>
                                    {Number(ratingValue).toFixed(1)}
                                    {ratingCount ? (
                                      <span className="ml-1 text-xs font-normal text-muted-foreground/80">
                                        ({ratingCount})
                                      </span>
                                    ) : null}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {bio}
                          </p>

                          {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag: string, tagIdx: number) => (
                                <span
                                  key={`${tag}-${tagIdx}`}
                                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-6">
                            <Button
                              variant="outline"
                              className="w-full justify-center rounded-xl"
                              asChild
                            >
                              <Link href={isApiSpeaker && speaker._id ? `/speakers/${speaker._id}` : "/speakers"}>
                                {t("home.speakerCard.book")}
                              </Link>
                            </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-12 text-center">
                  <Button
                    className="bg-[#72309F] text-white rounded-lg px-8 py-2 text-base font-semibold shadow-[0_12px_30px_rgba(115,87,245,0.35)] hover:bg-primary/90"
                    asChild
                  >
                    <Link href="/speakers">
                      {t("home.viewAll")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-border/40 bg-card/90 p-10 text-center shadow-[0_25px_80px_rgba(115,87,245,0.08)] backdrop-blur">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("home.howItWorks.badge")}
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                {t("home.howItWorks.title")}
              </p>

              <div className="mt-12 grid gap-10 text-left sm:grid-cols-2 lg:grid-cols-4">
                {HOW_IT_WORKS_STEPS.map(({ icon: Icon, key }) => {
                  const copy = t(key)
                  const [headline, ...rest] = copy.split(":")
                  const description = rest.join(":").trim()
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center gap-4 text-center"
                    >
                      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
                        <Icon className="size-7" />
                      </span>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {headline.trim()}
                        </h3>
                        {description && (
                          <p className="text-sm leading-6 text-muted-foreground">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why Aurora Is Different */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {t("home.whyDifferent.title")}
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                {t("home.whyDifferent.badge")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {WHY_DIFFERENT_CARDS.map(({ icon: Icon, key }) => {
                const copy = t(key)
                const [headline, ...rest] = copy.split(":")
                const description = rest.join(":").trim()

                return (
                  <div
                    key={key}
                    className="flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-[0_15px_40px_rgba(115,87,245,0.08)]"
                  >
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-inner">
                      <Icon className="size-7" />
                    </span>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {headline.trim()}
                      </h3>
                      {description && (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Become a Speaker */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2.5rem] bg-[#5E2792]">
              <div className="rounded-[2.5rem] bg-primary/5 px-6 py-8 text-center sm:px-12 dark:bg-black/20">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  <span>{t("home.becomeSpeaker.title")}</span>{" "}
                  <span className="sm:inline-block">{t("home.becomeSpeaker.titleSpeaker")}</span>
                </h2>
                <p className="mt-3 text-base text-white/80">
                  {t("home.becomeSpeaker.subtitle")}
                </p>

                <div className="mt-12 grid gap-10 text-left sm:grid-cols-3">
                  {BECOME_SPEAKER_STEPS.map(({ icon: Icon, labelKey, descriptionKey }) => (
                    <div key={labelKey} className="flex flex-col items-center gap-4 text-center text-white">
                      <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-white/10">
                        <Icon className="size-7" />
                      </span>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white/70">{t(labelKey)}</p>
                        <h3 className="text-base font-semibold">{t(descriptionKey)}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    variant="secondary"
                    className="rounded-full cursor-pointer bg-white px-8 py-5 text-sm font-semibold text-primary shadow-lg hover:bg-white/90 dark:bg-white/90 dark:text-primary"
                    asChild
                  >
                    <Link href="/auth/speaker-auth">
                      {t("home.becomeSpeaker.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
          </main>
        </div>
      </div>
    </>
  )
}