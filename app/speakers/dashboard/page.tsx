"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
  Calendar, 
  Clock, 
  Star, 
  MessageSquare,
  Loader2,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { speakerService, Session, Review, SpeakerAvailability } from "@/lib/services/speakerService"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { SpeakerRatingModal } from "@/components/SpeakerRatingModal"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Link from "next/link"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface ReviewWithType extends Review {
  type: 'received' | 'given'
}

export default function SpeakerDashboardPage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<ReviewWithType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [availability, setAvailability] = useState<SpeakerAvailability[]>([])
  const [analyticsRange, setAnalyticsRange] = useState<"7d" | "30d">("7d")

  // Rating modal states
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedSessionForRating, setSelectedSessionForRating] = useState<Session | null>(null)

  // Cancellation modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedSessionForCancellation, setSelectedSessionForCancellation] = useState<Session | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  // Google Calendar states
  const [isCalendarConnected, setIsCalendarConnected] = useState(false)
  const [calendarExpiresAt, setCalendarExpiresAt] = useState<string | null>(null)

  // Days of the week
  const daysOfWeek = [
    { key: "monday", translationKey: 'dashboard.availability.days.monday' },
    { key: "tuesday", translationKey: 'dashboard.availability.days.tuesday' },
    { key: "wednesday", translationKey: 'dashboard.availability.days.wednesday' },
    { key: "thursday", translationKey: 'dashboard.availability.days.thursday' },
    { key: "friday", translationKey: 'dashboard.availability.days.friday' },
    { key: "saturday", translationKey: 'dashboard.availability.days.saturday' },
    { key: "sunday", translationKey: 'dashboard.availability.days.sunday' }
  ]

  // Initialize default availability for all 7 days
  const getDefaultAvailability = (): SpeakerAvailability[] => {
    return daysOfWeek.map(day => ({
      day: day.key,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false
    }))
  }

  // Ensure all 7 days are present in availability array, sorted by day order
  const normalizeAvailability = (availabilities: SpeakerAvailability[]): SpeakerAvailability[] => {
    const defaultAvail = getDefaultAvailability()
    
    // Create a map of existing availabilities by day
    const availMap = new Map<string, SpeakerAvailability>()
    availabilities.forEach(avail => {
      availMap.set(avail.day, avail)
    })
    
    // Merge defaults with existing data, preserving existing entries
    // This ensures all 7 days are present in the correct order (Monday to Sunday)
    return defaultAvail.map(defaultDay => {
      const existing = availMap.get(defaultDay.day)
      if (existing) {
        // Preserve existing data but ensure all fields are present
        return {
          day: existing.day,
          startTime: existing.startTime || defaultDay.startTime,
          endTime: existing.endTime || defaultDay.endTime,
          isAvailable: existing.isAvailable !== undefined ? existing.isAvailable : defaultDay.isAvailable
        }
      }
      return defaultDay
    })
  }

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (isAuthenticated && !user) {
      dispatch(getCurrentUser())
    }
  }, [isAuthenticated, user, dispatch, authLoading])

  // Check calendar connection status
  const checkCalendarStatus = async () => {
    try {
      const response = await speakerService.getCalendarStatus()
      if (response.success) {
        setIsCalendarConnected(response.data.connected)
        setCalendarExpiresAt(response.data.expiresAt)
      }
    } catch (error) {
      console.error('Error checking calendar status:', error)
    }
  }

  // Initialize availability if empty after data load
  useEffect(() => {
    if (availability.length === 0 && !isLoading) {
      setAvailability(getDefaultAvailability())
    }
  }, [availability.length, isLoading])

  // Auto-open rating modal for ended sessions that haven't been reviewed
  useEffect(() => {
    // Only run if we have sessions and reviews loaded, and not currently loading
    if (isLoading) return
    if ((upcomingSessions.length === 0 && pastSessions.length === 0) || !user) return
    
    // Don't auto-open if any modal is already open
    if (ratingModalOpen || cancelModalOpen) return
    
    // Check past sessions first (completed sessions)
    const completedSessions = pastSessions.filter(s => s.status === 'completed')
    for (const session of completedSessions) {
      if (!hasReceivedReviews(session._id)) {
        // Found a completed session that hasn't received any reviews yet - open modal
        setSelectedSessionForRating(session)
        setRatingModalOpen(true)
        return // Only open for one session at a time
      }
    }
    
    // Also check upcoming sessions that have actually ended but still marked as scheduled
    const endedSessions = upcomingSessions.filter(s => hasSessionEnded(s) && !hasReceivedReviews(s._id))
    if (endedSessions.length > 0) {
      // Found an ended session that hasn't received any reviews yet - open modal
      setSelectedSessionForRating(endedSessions[0])
      setRatingModalOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingSessions, pastSessions, isLoading, user])

  useEffect(() => {
    console.log('Dashboard fetch effect - user:', !!user, 'isAuthenticated:', isAuthenticated, 'authLoading:', authLoading)
    
    // Don't do anything while auth is loading
    if (authLoading) {
      console.log('Auth still loading, waiting...')
      return
    }
    
    // If user exists, fetch dashboard data
    if (user) {
      console.log('User exists, fetching dashboard data...')
      fetchDashboardData()
      // Check calendar connection status
      checkCalendarStatus()
    } 
    // If not authenticated at all, show error
    else if (!isAuthenticated) {
      console.log('Not authenticated, showing error')
      setIsLoading(false)
      setError(t('dashboard.errors.loginRequired'))
    }
    // If authenticated but no user yet, wait for getCurrentUser to complete
    else if (isAuthenticated && !user) {
      console.log('Authenticated but no user, waiting for getCurrentUser...')
      // Keep loading state - getCurrentUser will be called by the first useEffect
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, authLoading])

  const fetchDashboardData = async () => {
    if (!user) {
      console.log('No user available, skipping dashboard fetch')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      // Fetch real data from backend
      const response = await speakerService.getDashboard()
      
      if (response.success && response.data) {
        const { upcomingSessions, pastSessions, reviews, profile } = response.data
        
        // Update sessions
        setUpcomingSessions(upcomingSessions || [])
        setPastSessions((pastSessions as Session[]) || [])
        
        // Process reviews to add type field based on current user
        const processedReviews: ReviewWithType[] = (reviews || []).map((review: Review) => ({
          ...review,
          type: typeof review.to === 'object' && review.to._id === user?._id 
            ? 'received' as const 
            : typeof review.from === 'object' && review.from._id === user?._id
            ? 'given' as const
            : 'received' as const
        }))
        setReviews(processedReviews)
        
        // Update availability data
        if (profile) {
          const profileAvailability = profile.availability || []
          console.log('Loaded availability from backend:', profileAvailability)
          const normalizedAvailability = normalizeAvailability(profileAvailability)
          console.log('Normalized availability:', normalizedAvailability)
          setAvailability(normalizedAvailability)
        } else {
          // If no profile data, initialize with default availability
          console.log('No profile data, initializing with defaults')
          setAvailability(getDefaultAvailability())
        }
      } else {
        // No profile data returned
        setAvailability(getDefaultAvailability())
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(t('dashboard.errors.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSessionDateTime = (session: Session) => {
    const sessionDate = new Date(session.date)
    if (session.time) {
      const [hours, minutes] = session.time.split(':')
      const parsedHours = Number.parseInt(hours, 10)
      const parsedMinutes = Number.parseInt(minutes ?? "0", 10)
      if (!Number.isNaN(parsedHours)) {
        sessionDate.setHours(parsedHours, Number.isNaN(parsedMinutes) ? 0 : parsedMinutes, 0, 0)
      }
    }
    return sessionDate
  }

  const receivedReviews = reviews.filter(r => r.type === "received")
  const givenReviews = reviews.filter(r => r.type === "given")

  // Check if a session has received any reviews (from anyone)
  const hasReceivedReviews = (sessionId: string) => {
    return reviews.some(review => review.session === sessionId)
  }

  // Check if a session has ended (date + time + duration has passed)
  const hasSessionEnded = (session: Session): boolean => {
    const start = getSessionDateTime(session)
    const duration = session.duration || 30
    const sessionEndTime = new Date(start.getTime() + duration * 60 * 1000)
    return sessionEndTime <= new Date()
  }

  const handleRateSession = (session: Session) => {
    setSelectedSessionForRating(session)
    setRatingModalOpen(true)
  }

  const handleRatingSuccess = () => {
    // Refresh dashboard data
    fetchDashboardData()
  }

  const handleCancelSession = (session: Session) => {
    setSelectedSessionForCancellation(session)
    setCancellationReason("")
    setCancelModalOpen(true)
  }

  const handleConfirmCancellation = async () => {
    if (!selectedSessionForCancellation) return

    try {
      setIsCancelling(true)
      setError("")
      
      await speakerService.cancelSession(
        selectedSessionForCancellation._id,
        cancellationReason.trim() || undefined
      )

      // Close modal and refresh data
      setCancelModalOpen(false)
      setSelectedSessionForCancellation(null)
      setCancellationReason("")
      fetchDashboardData()
    } catch (err: any) {
      console.error("Error cancelling session:", err)
      setError(err.message || t('dashboard.errors.cancelFailed'))
    } finally {
      setIsCancelling(false)
    }
  }

  // Calculate hours until session for cancellation rules
  const getHoursUntilSession = (session: Session): number => {
    const sessionDate = getSessionDateTime(session)
    const now = new Date()
    const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntil
  }

  const sortedUpcomingSessions = useMemo(
    () =>
      [...upcomingSessions].sort(
        (a, b) => getSessionDateTime(a).getTime() - getSessionDateTime(b).getTime()
      ),
    [upcomingSessions]
  )

  const sortedPastSessions = useMemo(
    () =>
      [...pastSessions].sort(
        (a, b) => getSessionDateTime(b).getTime() - getSessionDateTime(a).getTime()
      ),
    [pastSessions]
  )

  const nextSession = sortedUpcomingSessions[0]
  const completedPastSessions = useMemo(
    () => sortedPastSessions.filter((session) => session.status === "completed"),
    [sortedPastSessions]
  )
  const cancelledPastSessions = useMemo(
    () => sortedPastSessions.filter((session) => session.status === "cancelled"),
    [sortedPastSessions]
  )

  const sessionsNeedingReview = completedPastSessions.filter(
    (session) => !hasReceivedReviews(session._id)
  )
  const startingSoonSessions = sortedUpcomingSessions.filter((session) => {
    const hours = getHoursUntilSession(session)
    return hours > 0 && hours <= 24
  })
  const activeAvailability = useMemo(
    () => availability.filter((day) => day.isAvailable),
    [availability]
  )

  const analyticsDataBase = useMemo(() => {
    const map = new Map<
      string,
      { label: string; date: Date; scheduled: number; completed: number; cancelled: number }
    >()

    const addEntry = (session: Session, field: "scheduled" | "completed" | "cancelled") => {
      const date = getSessionDateTime(session)
      const key = date.toISOString().split("T")[0]
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

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

    return Array.from(map.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [sortedUpcomingSessions, sortedPastSessions])

  const analyticsData = useMemo(() => {
    if (!analyticsDataBase.length) return []

    const days = analyticsRange === "7d" ? 7 : 30
    const cutoff = new Date()
    cutoff.setHours(0, 0, 0, 0)
    cutoff.setDate(cutoff.getDate() - (days - 1))

    return analyticsDataBase
      .filter((entry) => entry.date >= cutoff)
      .slice(-days)
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

    const totalSessions = totals.scheduled + totals.completed + totals.cancelled
    const totalDecisive = totals.completed + totals.cancelled
    const completionRate =
      totalDecisive > 0 ? Math.round((totals.completed / totalDecisive) * 100) : null

    return {
      ...totals,
      total: totalSessions,
      completionRate,
    }
  }, [analyticsData])

  const analyticsRangeLabel =
    analyticsRange === "7d"
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
    [t],
  )

  const averageRating = receivedReviews.length
    ? (
        receivedReviews.reduce((total, review) => total + (review.rating || 0), 0) /
        receivedReviews.length
      ).toFixed(1)
    : null

  const summaryCards = useMemo(
    () => [
      {
        label: t('dashboard.sessions.upcoming.title'),
        value: upcomingSessions.length,
        helper: nextSession
          ? `${formatDate(nextSession.date)} · ${nextSession.time}`
          : t('dashboard.sessions.upcoming.none'),
        icon: Calendar
      },
      {
        label: t('dashboard.sessions.past.title'),
        value: pastSessions.length,
        helper:
          completedPastSessions.length > 0
            ? `${completedPastSessions.length} completed`
            : t('dashboard.sessions.past.none'),
        icon: CheckCircle2
      },
      {
        label: t('dashboard.reviews.received.title'),
        value: receivedReviews.length,
        helper: averageRating ? `Avg rating ${averageRating}` : t('dashboard.reviews.received.none'),
        icon: Star
      },
      {
        label: t('dashboard.reviews.given.title'),
        value: givenReviews.length,
        helper:
          sessionsNeedingReview.length > 0
            ? `${sessionsNeedingReview.length} follow ups`
            : t('dashboard.reviews.given.none'),
        icon: MessageSquare
      }
    ],
    [
      averageRating,
      completedPastSessions.length,
      givenReviews.length,
      nextSession,
      pastSessions.length,
      receivedReviews.length,
      sessionsNeedingReview.length,
      t,
      upcomingSessions.length
    ]
  )

  const renderSessionCard = (session: Session, context: "upcoming" | "past") => {
    const learner =
      typeof session.learner === "object"
        ? `${session.learner.firstname} ${session.learner.lastname}`
        : session.learner
    const topics = (session as any).topics as string[] | undefined
    const icebreaker = (session as any).icebreaker as string | undefined
    const meetingLink = (session as any).meetingLink as string | undefined
    const isCancelled = session.status === "cancelled"
    const canCancel = context === "upcoming" && session.status === "scheduled"
    const canReview =
      context === "past" && session.status === "completed" && !hasReceivedReviews(session._id)
    const hoursUntil = getHoursUntilSession(session)

    return (
      <div
        key={session._id}
        className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm transition hover:border-white/20 mb-12"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-white">{session.title}</h4>
              <Badge
                className={
                  isCancelled
                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                    : "bg-purple-500/20 text-purple-200 border-purple-400/30"
                }
              >
                {session.status}
              </Badge>
                </div>
            <p className="text-sm text-gray-300">
              {t('dashboard.sessions.with')} <span className="font-medium text-white">{learner}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(session.date)}</span>
              <span>•</span>
              <span>{session.time}</span>
              {session.duration && (
                <>
                  <span>•</span>
                  <span>{session.duration} min</span>
                </>
              )}
              {context === "upcoming" && (
                <>
                  <span>•</span>
                  <span>{Math.max(Math.round(hoursUntil), 0)}h remaining</span>
                </>
                      )}
                    </div>
                  </div>
          {meetingLink && (
            <Button asChild variant="outline" size="sm" className="border-purple-400/40 text-purple-200 cursor-pointer">
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                Join
              </a>
            </Button>
          )}
                </div>

        {topics && topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Badge
                          key={topic}
                variant="secondary"
                className="bg-purple-500/15 text-purple-200 border-purple-400/30"
                        >
                          {topic}
              </Badge>
                      ))}
                    </div>
        )}

        {icebreaker && (
          <div className="mt-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-100">
            <p className="mb-1 font-semibold uppercase tracking-wide text-yellow-300">
              {t('dashboard.sessions.icebreaker')}
            </p>
            <p>{icebreaker}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            {context === "upcoming"
              ? `Starts ${formatDate(session.date)}`
              : `Recorded ${formatDate(session.date)}`}
                  </div>
          <div className="flex items-center gap-2">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer bg-red-500/20 text-red-200 hover:bg-red-500/30 border-red-500/40"
                onClick={() => handleCancelSession(session)}
              >
                {t('dashboard.sessions.cancel')}
              </Button>
            )}
            {canReview && (
              <Button
                size="sm"
                onClick={() => handleRateSession(session)}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                <Star className="mr-2 h-3 w-3" />
                {t('dashboard.sessions.rate')}
              </Button>
            )}
                          </div>
                      </div>
                    </div>
                  )
  }

  const renderReviewCard = (review: ReviewWithType, type: "received" | "given") => {
    const counterpart =
      type === "received"
        ? review.from
        : review.to

    const counterpartName =
      typeof counterpart === "object"
        ? `${counterpart.firstname} ${counterpart.lastname}`
        : counterpart

    return (
      <div
        key={review._id}
        className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3"
      >
        <div className="flex items-start justify-between gap-4">
                    <div>
            <p className="text-sm font-semibold text-white">{counterpartName}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
                    </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                }`}
              />
            ))}
                    </div>
                  </div>
        <p className="text-sm text-gray-200">
          {review.comment?.trim() ||
            (type === "received"
              ? t('dashboard.reviews.received.none')
              : t('dashboard.reviews.given.none'))}
        </p>
        <p className="text-xs text-gray-500">
          Session ID: {review.session}
        </p>
                        </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                  )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A33] via-purple-900 to-[#1A1A33] py-24 px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <h1 className="lg:text-3xl md:text-2xl text-xl xl:text-4xl font-bold text-white">{t('dashboard.title')}</h1>
          <p className="text-gray-300 text-sm">{t('dashboard.subtitle')}</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="border-white/20 bg-white/10 backdrop-blur-lg rounded-lg"
              >
                <CardContent className="flex items-center justify-between gap-2 md:gap-4 p-2 md:p-5">
                  <div>
                    <p className="text-sm text-gray-300">{card.label}</p>
                    <p className="text-xl md:text-2xl font-semibold text-white">{card.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{card.helper}</p>
                  </div>
                  <div className="flex  md:h-12 md:w-12 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40">
                    <Icon className="md:h-6 md:w-6 h-4 w-4 text-white" />
                  </div>
              </CardContent>
                  </div>
            )
          })}
                </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white text-base">Schedule Overview</CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  Quick glance at your integrations and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div
                    className={`rounded-lg border sm:p-4 p-2 ${
                      isCalendarConnected
                        ? "border-green-500/30 bg-green-500/10 text-green-200"
                        : "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm pb-2">
                {isCalendarConnected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span>
                        {isCalendarConnected
                          ? t('dashboard.calendar.connected')
                          : t('dashboard.calendar.notConnected')}
                      </span>
                    </div>
                    {!isCalendarConnected && (
                      <p className="mt-2 text-xs text-white/70">
                        {t('dashboard.calendar.notConnectedDesc')}
                      </p>
                    )}
                    {activeAvailability.length > 0 ? (
                      <div className="flex flex-wrap gap-1 md:gap-2 py-2 md:py-4">
                        {activeAvailability.slice(0, 7).map((day) => {
                          const dayData = daysOfWeek.find((d) => d.key === day.day)
                          const label = dayData ? t(dayData.translationKey as any) : day.day
                          return (
                            <Badge
                              key={day.day}
                              variant="secondary"
                              className="bg-purple-500/15 text-purple-100 border-purple-400/20"
                            >
                              {label}·{(day.startTime || "09:00")}-{(day.endTime || "17:00")}
                            </Badge>
                          )
                        })}
                        {activeAvailability.length > 7 && (
                          <Badge className="bg-white/10 text-white border-white/20">
                            +{activeAvailability.length - 7}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        {t('dashboard.availability.description')}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 md:col-span-2">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-sm font-semibold text-white">
                          {t('dashboard.analytics.sessions')}
                        </span>
                      <p className="text-xs text-gray-400">
                          {analyticsData.length > 0
                            ? analyticsRangeLabel
                            : t('dashboard.analytics.empty')}
                      </p>
                    </div>
                      <div className="flex items-center gap-2">
                        {(['7d', '30d'] as const).map((range) => (
                    <Button
                            key={range}
                            size="sm"
                            variant={analyticsRange === range ? "default" : "outline"}
                            className={`h-7 px-3 text-xs ${
                              analyticsRange === range
                                ? "bg-purple-600 text-white hover:bg-purple-500 cursor-pointer"
                                : "border-white/20 text-gray-800 bg-white/10 cursor-pointer"
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
                    {/* {analyticsSummary.total > 0 && (
                      <div className="mb-3 grid gap-2 text-xs text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
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
                            {analyticsSummary.completionRate !== null
                              ? `${analyticsSummary.completionRate}%`
                              : '—'}
                          </p>
                        </div>
                      </div>
                    )} */}
                    {analyticsData.length > 0 ? (
                      <ChartContainer
                        config={chartConfig}
                        className="h-36 md:h-56 w-full"
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
                      <p className="text-xs text-gray-400">
                        {/* {t('dashboard.analytics.empty')} */}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="flex flex-col border-white/20 bg-white/10 backdrop-blur-lg xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xl">
                  {t('dashboard.sessions.upcoming.title')}
                </CardTitle>
                <CardDescription className="text-gray-300">
                {t('dashboard.sessions.upcoming.count')}
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
                      {t('dashboard.sessions.upcoming.title')} ({upcomingSessions.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      {t('dashboard.sessions.past.title')} ({pastSessions.length})
                    </TabsTrigger>
                  </TabsList>
                  {nextSession && (
                    <p className="text-xs text-gray-400">
                      Next: {formatDate(nextSession.date)} · {nextSession.time}
                    </p>
                  )}
                              </div>

                <TabsContent value="upcoming" className="mt-0">
                  {sortedUpcomingSessions.length > 0 ? (
                    <ScrollArea className="h-[420px] pr-4">
                      <div className="space-y-4">
                        {sortedUpcomingSessions.map((session) =>
                          renderSessionCard(session, "upcoming")
                        )}
                              </div>
                    </ScrollArea>
                  ) : (
                    <p className="py-4 text-center text-sm text-gray-400">
                      {t('dashboard.sessions.upcoming.none')}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-0">
                  {sortedPastSessions.length > 0 ? (
                    <ScrollArea className="max-h-[420px] pr-4">
                      <div className="space-y-6">
                        {completedPastSessions.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Completed
                            </p>
                            <div className="space-y-3">
                              {completedPastSessions.map((session) =>
                                renderSessionCard(session, "past")
                              )}
                              </div>
                              </div>
                        )}
                        {cancelledPastSessions.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Cancelled
                            </p>
                            <div className="space-y-3">
                              {cancelledPastSessions.map((session) =>
                                renderSessionCard(session, "past")
                            )}
                          </div>
                          </div>
                            )}
                          </div>
                    </ScrollArea>
                ) : (
                    <p className="py-4 text-center text-sm text-gray-400">
                      {t('dashboard.sessions.past.none')}
                    </p>
                )}
                </TabsContent>
              </Tabs>
              </CardContent>
            </Card>
        </div>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
                <CardHeader>
            <CardTitle className="text-white text-xl">
                    {t('dashboard.reviews.received.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
              Insights from learners and your feedback history
                  </CardDescription>
                </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="received" className="w-full">
              <div className="mb-4">
                <TabsList className="bg-white/10 text-gray-300">
                  <TabsTrigger
                    value="received"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    {t('dashboard.reviews.received.title')} ({receivedReviews.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="given"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    {t('dashboard.reviews.given.title')} ({givenReviews.length})
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="received" className="mt-0">
                  {receivedReviews.length > 0 ? (
                  <ScrollArea className="max-h-[360px] pr-4">
                    <div className="space-y-4">
                      {receivedReviews.map((review) => renderReviewCard(review, "received"))}
                          </div>
                  </ScrollArea>
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">
                    {t('dashboard.reviews.received.none')}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="given" className="mt-0">
                  {givenReviews.length > 0 ? (
                  <ScrollArea className="h-[360px] pr-4">
                    <div className="space-y-4">
                      {givenReviews.map((review) => renderReviewCard(review, "given"))}
                          </div>
                  </ScrollArea>
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">
                    {t('dashboard.reviews.given.none')}
                  </p>
                )}
              </TabsContent>
            </Tabs>
                </CardContent>
              </Card>
      </div>

      {/* Rating Modal */}
      {selectedSessionForRating && (
        <SpeakerRatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          sessionId={selectedSessionForRating._id}
          learnerName={
            typeof selectedSessionForRating.learner === 'object'
              ? `${selectedSessionForRating.learner.firstname} ${selectedSessionForRating.learner.lastname}`
              : selectedSessionForRating.learner
          }
          onSuccess={handleRatingSuccess}
        />
      )}

      {/* Cancellation Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              {t('dashboard.cancel.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedSessionForCancellation && (
                <>
                  {t('dashboard.cancel.confirm')}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="font-semibold text-white mb-1">
                        {selectedSessionForCancellation.title}
                      </p>
                      <p className="text-gray-300 mb-2">
                        {t('dashboard.sessions.with')}{' '}
                        <span className="font-medium">
                          {typeof selectedSessionForCancellation.learner === 'object'
                            ? `${selectedSessionForCancellation.learner.firstname} ${selectedSessionForCancellation.learner.lastname}`
                            : selectedSessionForCancellation.learner}
                        </span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          {formatDate(selectedSessionForCancellation.date)} at{' '}
                          {selectedSessionForCancellation.time}
                        </span>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                      <p className="text-yellow-400 text-xs font-semibold mb-1">{t('dashboard.cancel.policy')}</p>
                      <ul className="text-xs text-yellow-300/80 space-y-1 list-disc list-inside">
                        <li>{t('dashboard.cancel.policy24h')}</li>
                        <li>{t('dashboard.cancel.policyNotify')}</li>
                        <li>{t('dashboard.cancel.policyAvailable')}</li>
                        {getHoursUntilSession(selectedSessionForCancellation) < 24 && (
                          <li className="text-red-400 font-semibold">
                            {t('dashboard.cancel.warning')}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="cancellation-reason" className="text-white mb-2 block">
                {t('dashboard.cancel.reasonLabel')} <span className="text-gray-500 text-xs">{t('dashboard.cancel.reasonOptional')}</span>
              </Label>
              <textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder={t('dashboard.cancel.reasonPlaceholder')}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelModalOpen(false)
                setCancellationReason("")
                setSelectedSessionForCancellation(null)
                setError("")
              }}
              disabled={isCancelling}
              className="cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('dashboard.cancel.keep')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancellation}
              disabled={isCancelling}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('dashboard.cancel.cancelling')}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('dashboard.cancel.confirmButton')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

