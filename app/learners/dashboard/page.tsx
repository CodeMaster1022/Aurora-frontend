"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Users,
} from "lucide-react"
import { learnerService, Session, Speaker, Review } from "@/lib/services/learnerService"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { LearnerRatingModal } from "@/components/LearnerRatingModal"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Link from "next/link"

type ChartRange = "7d" | "30d"

type ProcessedReview = Review & {
  speaker?: Speaker | null
}

type TopSpeaker = {
  id: string
  name: string
  sessions: number
  lastSession: Date
  avatar?: string
  rating?: number
}

export default function LearnerDashboardPage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)

  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<ProcessedReview[]>([])
  const [profileStats, setProfileStats] = useState<{
    totalSessions: number
    completedSessions: number
    upcomingSessions: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelError, setCancelError] = useState("")

  const [analyticsRange, setAnalyticsRange] = useState<ChartRange>("7d")

  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedSessionForRating, setSelectedSessionForRating] = useState<Session | null>(null)

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedSessionForCancellation, setSelectedSessionForCancellation] = useState<Session | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  const getSessionDateTime = (session: Session) => {
    const date = new Date(session.date)
    if (session.time) {
      const [hours, minutes] = session.time.split(':')
      const parsedHours = Number.parseInt(hours, 10)
      const parsedMinutes = Number.parseInt(minutes ?? "0", 10)
      if (!Number.isNaN(parsedHours)) {
        date.setHours(parsedHours, Number.isNaN(parsedMinutes) ? 0 : parsedMinutes, 0, 0)
      }
    }
    return date
  }

  const getHoursUntilSession = (session: Session) => {
    const now = new Date()
    return (getSessionDateTime(session).getTime() - now.getTime()) / (1000 * 60 * 60)
  }

  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const hasBeenReviewed = (sessionId: string) => {
    return reviews.some((review) => {
      const reviewSessionId = typeof review.session === 'string'
        ? review.session
        : (review.session as any)?._id || review.session
      return String(reviewSessionId) === String(sessionId)
    })
  }

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, user])

  useEffect(() => {
    if (authLoading) return

    if (user) {
      fetchDashboardData()
    } else if (!isAuthenticated) {
      setIsLoading(false)
      setError(t('learnerDashboard.errors.loginRequired'))
    }
  }, [authLoading, isAuthenticated, user])

  useEffect(() => {
    if (isLoading || !user) return
    if (ratingModalOpen || cancelModalOpen) return

    const completedSessions = pastSessions.filter((session) => session.status === "completed")
    const nextPendingReview = completedSessions.find((session) => !hasBeenReviewed(session._id))
    if (nextPendingReview) {
      setSelectedSessionForRating(nextPendingReview)
      setRatingModalOpen(true)
    }
  }, [cancelModalOpen, isLoading, pastSessions, ratingModalOpen, upcomingSessions, user])

  const fetchDashboardData = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await learnerService.getDashboard()

      if (response.success && response.data) {
        const { upcomingSessions, pastSessions, reviews, profile } = response.data
        setUpcomingSessions(upcomingSessions || [])
        setPastSessions(pastSessions || [])

        const processedReviews: ProcessedReview[] = (reviews || []).map((review) => ({
          ...review,
          speaker: typeof review.to === "object" ? (review.to as Speaker) : null,
        }))
        setReviews(processedReviews)
        setProfileStats(profile || null)
      }
    } catch (err) {
      console.error("Error fetching learner dashboard data:", err)
      setError(t('learnerDashboard.errors.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const sortedUpcomingSessions = useMemo(
    () => [...upcomingSessions].sort((a, b) => getSessionDateTime(a).getTime() - getSessionDateTime(b).getTime()),
    [upcomingSessions]
  )

  const sortedPastSessions = useMemo(
    () => [...pastSessions].sort((a, b) => getSessionDateTime(b).getTime() - getSessionDateTime(a).getTime()),
    [pastSessions]
  )

  const nextSession = sortedUpcomingSessions[0] || null

  const sessionsNeedingReview = useMemo(
    () => sortedPastSessions.filter((session) => session.status === "completed" && !hasBeenReviewed(session._id)),
    [sortedPastSessions]
  )

  const startingSoonSessions = useMemo(() => {
    return sortedUpcomingSessions.filter((session) => {
      const hours = getHoursUntilSession(session)
      return hours > 0 && hours <= 24
    })
  }, [sortedUpcomingSessions])

  const topSpeakers: TopSpeaker[] = useMemo(() => {
    const speakerMap = new Map<string, TopSpeaker>()

    pastSessions.forEach((session) => {
      if (typeof session.speaker === "object" && session.speaker) {
        const speaker = session.speaker as Speaker
        const existing = speakerMap.get(speaker._id)
        const sessionDate = getSessionDateTime(session)

        if (existing) {
          existing.sessions += 1
          if (sessionDate > existing.lastSession) {
            existing.lastSession = sessionDate
          }
        } else {
          speakerMap.set(speaker._id, {
            id: speaker._id,
            name: `${speaker.firstname} ${speaker.lastname}`.trim(),
            sessions: 1,
            lastSession: sessionDate,
            avatar: speaker.avatar,
            rating: (speaker as any)?.rating,
          })
        }
      }
    })

    return Array.from(speakerMap.values())
      .sort((a, b) => {
        if (b.sessions !== a.sessions) return b.sessions - a.sessions
        return b.lastSession.getTime() - a.lastSession.getTime()
      })
      .slice(0, 6)
  }, [pastSessions])

  const analyticsDataBase = useMemo(() => {
    const map = new Map<
      string,
      { label: string; date: Date; scheduled: number; completed: number; cancelled: number }
    >()

    const addEntry = (session: Session, field: "scheduled" | "completed" | "cancelled") => {
      const date = getSessionDateTime(session)
      const key = date.toISOString().split("T")[0]
      const label = formatDateShort(date)

      const existing = map.get(key) ?? {
        date,
        label,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
      }

      existing[field] += 1
      map.set(key, existing)
    }

    sortedUpcomingSessions.forEach((session) => addEntry(session, "scheduled"))
    sortedPastSessions.forEach((session) => {
      if (session.status === "completed") {
        addEntry(session, "completed")
      } else if (session.status === "cancelled") {
        addEntry(session, "cancelled")
      } else {
        addEntry(session, "scheduled")
      }
    })

    return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [sortedPastSessions, sortedUpcomingSessions])

  const analyticsData = useMemo(() => {
    if (!analyticsDataBase.length) return []

    const days = analyticsRange === "7d" ? 7 : 30
    const cutoff = new Date()
    cutoff.setHours(0, 0, 0, 0)
    cutoff.setDate(cutoff.getDate() - (days - 1))

    return analyticsDataBase.filter((entry) => entry.date >= cutoff).slice(-days)
  }, [analyticsDataBase, analyticsRange])

  const analyticsSummary = useMemo(() => {
    const totals = analyticsData.reduce(
      (acc, entry) => {
        acc.scheduled += entry.scheduled
        acc.completed += entry.completed
        acc.cancelled += entry.cancelled
        return acc
      },
      { scheduled: 0, completed: 0, cancelled: 0 }
    )

    const totalDecisive = totals.completed + totals.cancelled
    const completionRate = totalDecisive > 0 ? Math.round((totals.completed / totalDecisive) * 100) : null

    return {
      ...totals,
      total: totals.scheduled + totals.completed + totals.cancelled,
      completionRate,
    }
  }, [analyticsData])

  const analyticsRangeLabel = analyticsRange === "7d"
    ? t('dashboard.analytics.range7dLabel')
    : t('dashboard.analytics.range30dLabel')

  const chartConfig = useMemo(
    () => ({
      scheduled: {
        label: t('dashboard.analytics.scheduled'),
        color: "hsl(266, 85%, 70%)",
      },
      completed: {
        label: t('dashboard.analytics.completed'),
        color: "hsl(152, 76%, 60%)",
      },
      cancelled: {
        label: t('dashboard.analytics.cancelled'),
        color: "hsl(0, 84%, 65%)",
      },
    }),
    [t]
  )

  const averageRating = reviews.length
    ? (
        reviews.reduce((total, review) => total + (review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : null

  const summaryCards = useMemo(
    () => [
      {
        label: t('learnerDashboard.summary.upcoming'),
        value: upcomingSessions.length,
        helper: nextSession
          ? `${formatDateLong(nextSession.date)} · ${nextSession.time}`
          : t('learnerDashboard.summary.upcomingHelper'),
        icon: Calendar,
      },
      {
        label: t('learnerDashboard.summary.completed'),
        value: profileStats?.completedSessions ?? pastSessions.length,
        helper: t('learnerDashboard.summary.completedHelper'),
        icon: CheckCircle2,
      },
      {
        label: t('learnerDashboard.summary.reviewed'),
        value: reviews.length,
        helper: averageRating
          ? `${t('learnerDashboard.summary.reviewedAvg')} ${averageRating}`
          : t('learnerDashboard.summary.reviewedHelper'),
        icon: Star,
      },
      {
        label: t('learnerDashboard.summary.speakers'),
        value: topSpeakers.length,
        helper: topSpeakers[0]
          ? `${topSpeakers[0].name}`
          : t('learnerDashboard.summary.speakersHelper'),
        icon: Users,
      },
    ],
    [averageRating, nextSession, pastSessions.length, profileStats, reviews.length, t, topSpeakers]
  )

  const sessionsSubtitle = `${t('learnerDashboard.sessionsTab.upcoming')} ${upcomingSessions.length} · ${t('learnerDashboard.sessionsTab.past')} ${pastSessions.length}`
  const reviewsSubtitle =
    reviews.length > 0
      ? `${reviews.length} ${t('learnerDashboard.summary.reviewed')}`
      : t('learnerDashboard.reviews.subtitle')

  const handleRateSession = (session: Session) => {
    setSelectedSessionForRating(session)
    setRatingModalOpen(true)
  }

  const handleRatingSuccess = () => {
    setRatingModalOpen(false)
    fetchDashboardData()
  }

  const handleCancelSession = (session: Session) => {
    setSelectedSessionForCancellation(session)
    setCancellationReason("")
    setCancelError("")
    setCancelModalOpen(true)
  }

  const handleConfirmCancellation = async () => {
    if (!selectedSessionForCancellation) return

    try {
      setIsCancelling(true)
      setCancelError("")

      await learnerService.cancelSession(
        selectedSessionForCancellation._id,
        cancellationReason.trim() || undefined
      )

      setCancelModalOpen(false)
      setSelectedSessionForCancellation(null)
      setCancellationReason("")
      fetchDashboardData()
    } catch (err: any) {
      console.error("Error cancelling session:", err)
      setCancelError(err.message || t('learnerDashboard.errors.cancelFailed'))
    } finally {
      setIsCancelling(false)
    }
  }

  const handleCloseCancellationModal = () => {
    setCancelModalOpen(false)
    setSelectedSessionForCancellation(null)
    setCancellationReason("")
    setCancelError("")
  }

  const renderSessionCard = (session: Session, context: "upcoming" | "past") => {
    const speakerName =
      typeof session.speaker === "object"
        ? `${session.speaker.firstname} ${session.speaker.lastname}`.trim()
        : session.speaker
    const topics = (session.topics as string[] | undefined) || (session.topic ? [session.topic] : [])
    const hoursUntil = getHoursUntilSession(session)

    return (
      <div
        key={session._id}
        className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm transition hover:border-white/20"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg font-semibold text-white">{session.title}</h4>
              <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                {session.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-300">
              {t('learnerDashboard.sessions.with')}{' '}
              <span className="font-medium text-purple-200">{speakerName}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 sm:text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDateLong(session.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.time}
                {session.duration ? ` (${session.duration} min)` : ''}
              </span>
              {context === "upcoming" && hoursUntil > 0 && (
                <span className="flex items-center gap-1 text-purple-200">
                  <Clock className="h-4 w-4" />
                  {Math.max(Math.round(hoursUntil), 0)}h
                </span>
              )}
            </div>
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="bg-white/10 text-gray-200">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
            {session.icebreaker && (
              <div className="rounded-md border border-yellow-400/30 bg-yellow-500/10 p-3 text-xs text-yellow-100">
                <p className="mb-1 font-semibold text-yellow-300">{t('learnerDashboard.sessions.icebreaker')}</p>
                <p>{session.icebreaker}</p>
              </div>
            )}
            {session.meetingLink && context === "upcoming" && (
              <Link
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200"
              >
                {t('learnerDashboard.sessions.join')}
              </Link>
            )}
          </div>

          {context === "upcoming" ? (
            <div className="flex items-start gap-2">
              <Button
                onClick={() => handleCancelSession(session)}
                variant="outline"
                size="sm"
                className="border-red-400/50 text-red-200 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('learnerDashboard.sessions.cancel')}
              </Button>
            </div>
          ) : session.status === "completed" ? (
            <Button
              onClick={() => handleRateSession(session)}
              variant="outline"
              size="sm"
              className="border-purple-400/50 text-purple-200 hover:bg-purple-500/10 cursor-pointer"
            >
              <Star className="mr-2 h-4 w-4" />
              {t('learnerDashboard.sessions.rate')}
            </Button>
          ) : session.status === "cancelled" && (session as any).cancellationReason ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-200">
              <span className="font-semibold">{t('learnerDashboard.sessions.cancellationReason')} </span>
              {(session as any).cancellationReason}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const renderReviewCard = (review: ProcessedReview) => {
    const speakerName = review.speaker
      ? `${review.speaker.firstname} ${review.speaker.lastname}`
      : typeof review.to === "object" && review.to
      ? `${(review.to as Speaker).firstname} ${(review.to as Speaker).lastname}`
      : review.to

    const sessionLabel = (() => {
      if (typeof review.session === "object" && review.session) {
        const sessionObj = review.session as Session
        return sessionObj.title || sessionObj._id
      }
      return review.session
    })()

    return (
      <div key={review._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">{speakerName}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={`${review._id}-${index}`}
                className={`h-3.5 w-3.5 ${index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-200">{review.comment || t('learnerDashboard.reviews.emptyComment')}</p>
        <p className="text-xs text-gray-500">
          {t('learnerDashboard.reviews.sessionLabel')} {sessionLabel}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-300">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-24 px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl xl:text-4xl">
            {t('learnerDashboard.title')}
          </h1>
          <p className="text-sm text-gray-300">{t('learnerDashboard.subtitle')}</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="border-white/20 bg-white/10 backdrop-blur-md rounded-lg">
                <CardContent className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <div>
                    <p className="text-xs text-gray-300 sm:text-sm">{card.label}</p>
                    <p className="text-lg font-semibold text-white sm:text-2xl">{card.value}</p>
                    <p className="text-[10px] text-gray-400 sm:text-xs">{card.helper}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40 sm:h-12 sm:w-12">
                    <Icon className="h-4 w-4 text-white sm:h-6 sm:w-6" />
                  </div>
                </CardContent>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base sm:text-lg">
                  {t('learnerDashboard.actionCenter.title')}
                </CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  {t('learnerDashboard.actionCenter.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerDashboard.actionCenter.pendingReviews')}
                  </p>
                  {sessionsNeedingReview.length > 0 ? (
                    <div className="space-y-2">
                      {sessionsNeedingReview.slice(0, 3).map((session) => (
                        <div key={session._id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                          <div>
                            <p className="text-sm text-white">{session.title}</p>
                            <p className="text-xs text-gray-400">
                              {typeof session.speaker === "object"
                                ? `${session.speaker.firstname} ${session.speaker.lastname}`
                                : session.speaker}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-purple-600 text-white hover:bg-purple-500"
                            onClick={() => handleRateSession(session)}
                          >
                            {t('learnerDashboard.actionCenter.review')}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {t('learnerDashboard.actionCenter.noPending')}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerDashboard.actionCenter.startingSoon')}
                  </p>
                  {startingSoonSessions.length > 0 ? (
                    <div className="space-y-2">
                      {startingSoonSessions.slice(0, 3).map((session) => (
                        <div key={session._id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                          <div>
                            <p className="text-sm text-white">{session.title}</p>
                            <p className="text-xs text-gray-400">
                              {Math.max(Math.round(getHoursUntilSession(session)), 0)}h · {formatDateLong(session.date)}
                            </p>
                          </div>
                          {session.meetingLink ? (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="border-purple-400/40 text-purple-200"
                            >
                              <Link href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                {t('learnerDashboard.actionCenter.join')}
                              </Link>
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-white/20 text-white">
                              {t('learnerDashboard.actionCenter.view')}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {t('learnerDashboard.actionCenter.noStartingSoon')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white text-base sm:text-lg">
                    {t('learnerDashboard.topSpeakers.title')}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-300">
                  {t('learnerDashboard.topSpeakers.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSpeakers.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    {t('learnerDashboard.topSpeakers.none')}
                  </p>
                ) : (
                  topSpeakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{speaker.name}</p>
                        <p className="text-xs text-gray-400">
                          {speaker.sessions} {t('learnerDashboard.topSpeakers.sessions')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('learnerDashboard.topSpeakers.lastSession')} {formatDateLong(speaker.lastSession.toISOString())}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-300">
                        {speaker.rating ? `${speaker.rating.toFixed(1)}★` : t('learnerDashboard.topSpeakers.noRating')}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 xl:col-span-2">
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white text-base sm:text-lg">
                      {t('learnerDashboard.analytics.title')}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-300">
                      {analyticsData.length > 0 ? analyticsRangeLabel : t('learnerDashboard.analytics.empty')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {( ['7d', '30d'] as ChartRange[] ).map((range) => (
                      <Button
                        key={range}
                        size="sm"
                        variant={analyticsRange === range ? "default" : "outline"}
                        className={`h-7 px-3 text-xs ${
                          analyticsRange === range
                            ? "bg-purple-600 text-white hover:bg-purple-500 cursor-pointer"
                            : "border-white/20 text-gray-800 bg-white hover:bg-white/10 cursor-pointer"
                        }`}
                        onClick={() => setAnalyticsRange(range)}
                      >
                        {range === "7d"
                          ? t('dashboard.analytics.range7d')
                          : t('dashboard.analytics.range30d')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsSummary.total > 0 && (
                  <div className="grid gap-2 text-xs text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-white/10 bg-white/5 p-2">
                      <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-gray-400">
                        {t('dashboard.analytics.scheduled')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {analyticsSummary.scheduled}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 p-2">
                      <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-gray-400">
                        {t('dashboard.analytics.completed')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {analyticsSummary.completed}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 p-2">
                      <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-gray-400">
                        {t('dashboard.analytics.cancelled')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {analyticsSummary.cancelled}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 p-2">
                      <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-gray-400">
                        {t('dashboard.analytics.completionRate')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {analyticsSummary.completionRate !== null ? `${analyticsSummary.completionRate}%` : '—'}
                      </p>
                    </div>
                  </div>
                )}
                {analyticsData.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className="h-36 w-full sm:h-48"
                  >
                    <AreaChart data={analyticsData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.08)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        stroke="#9ca3af"
                      />
                      <YAxis hide domain={[0, "dataMax + 1"]} />
                      <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                      <ChartLegend
                        verticalAlign="top"
                        wrapperStyle={{ paddingBottom: 12 }}
                        content={
                          <ChartLegendContent className="justify-start text-xs text-gray-300" />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="scheduled"
                        stroke="var(--color-scheduled)"
                        fill="var(--color-scheduled)"
                        fillOpacity={0.12}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--color-completed)"
                        fill="var(--color-completed)"
                        fillOpacity={0.16}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="cancelled"
                        stroke="var(--color-cancelled)"
                        fill="var(--color-cancelled)"
                        fillOpacity={0.08}
                        strokeDasharray="6 4"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <p className="text-xs text-gray-400">{t('learnerDashboard.analytics.empty')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xl">
                  {t('learnerDashboard.sessionsTab.title')}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {sessionsSubtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="upcoming" className="w-full">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <TabsList className="bg-white/10 text-gray-300">
                      <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        {t('learnerDashboard.sessionsTab.upcoming')} ({upcomingSessions.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="past"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      >
                        {t('learnerDashboard.sessionsTab.past')} ({pastSessions.length})
                      </TabsTrigger>
                    </TabsList>
                    {nextSession && (
                      <p className="text-xs text-gray-400">
                        {`${t('learnerDashboard.sessionsTab.next')} ${formatDateLong(nextSession.date)} · ${nextSession.time}`}
                      </p>
                    )}
                  </div>

                  <TabsContent value="upcoming" className="mt-0">
                    {sortedUpcomingSessions.length > 0 ? (
                      <ScrollArea className="max-h-[420px] pr-4">
                        <div className="space-y-4">
                          {sortedUpcomingSessions.map((session) => renderSessionCard(session, "upcoming"))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="py-4 text-center text-sm text-gray-400">
                        {t('learnerDashboard.sessionsTab.noUpcoming')}
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-0">
                    {sortedPastSessions.length > 0 ? (
                      <ScrollArea className="max-h-[420px] pr-4">
                        <div className="space-y-6">
                          {sortedPastSessions.map((session) => renderSessionCard(session, "past"))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="py-4 text-center text-sm text-gray-400">
                        {t('learnerDashboard.sessionsTab.noPast')}
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white text-base sm:text-lg">
                    {t('learnerDashboard.reviews.title')}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-300">
                  {reviewsSubtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="max-h-[360px] pr-4">
                  {reviews.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                      {t('learnerDashboard.reviews.noReviews')}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => renderReviewCard(review))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedSessionForRating && (
        <LearnerRatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          sessionId={selectedSessionForRating._id}
          speakerName={
            typeof selectedSessionForRating.speaker === "object"
              ? `${selectedSessionForRating.speaker.firstname} ${selectedSessionForRating.speaker.lastname}`
              : selectedSessionForRating.speaker
          }
          onSuccess={handleRatingSuccess}
        />
      )}

      <Dialog open={cancelModalOpen} onOpenChange={handleCloseCancellationModal}>
        <DialogContent className="border-white/20 bg-[#1A1A33] text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              {t('learnerDashboard.cancel.title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              {t('learnerDashboard.cancel.description')}
            </DialogDescription>
          </DialogHeader>

          {selectedSessionForCancellation && (
            <div className="space-y-4 py-2">
              <div className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-gray-200">
                <p className="font-semibold text-white">{selectedSessionForCancellation.title}</p>
                <p className="text-xs text-gray-400">
                  {formatDateLong(selectedSessionForCancellation.date)} · {selectedSessionForCancellation.time}
                </p>
                <p className="text-xs text-gray-400">
                  {t('learnerDashboard.sessions.with')}{' '}
                  {typeof selectedSessionForCancellation.speaker === "object"
                    ? `${selectedSessionForCancellation.speaker.firstname} ${selectedSessionForCancellation.speaker.lastname}`
                    : selectedSessionForCancellation.speaker}
                </p>
                <p className="text-xs text-yellow-200 mt-2">
                  {Math.max(Math.round(getHoursUntilSession(selectedSessionForCancellation)), 0)} {t('learnerDashboard.cancel.hoursAway')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation-reason" className="text-sm text-gray-200">
                  {t('learnerDashboard.cancel.reasonLabel')}
                </Label>
                <Textarea
                  id="cancellation-reason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder={t('learnerDashboard.cancel.reasonPlaceholder')}
                  rows={4}
                  className="bg-white/5 border-white/10 text-sm text-white"
                />
              </div>

              {cancelError && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
                  {cancelError}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleCloseCancellationModal}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isCancelling}
            >
              {t('learnerDashboard.cancel.keep')}
            </Button>
            <Button
              onClick={handleConfirmCancellation}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('learnerDashboard.cancel.cancelling')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('learnerDashboard.cancel.confirm')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

