"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Loader2,
  Edit,
  Save,
  X,
  Camera,
  User,
  Calendar,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react"
import { learnerService, Session, Review, Speaker } from "@/lib/services/learnerService"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { getCurrentUser, setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface ProcessedReview extends Review {
  speaker?: Speaker | null
}

interface TopSpeaker {
  id: string
  name: string
  sessions: number
  lastSession: Date
  avatar?: string
  rating?: number
}

const formatDateLong = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

const formatDateShort = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const getSessionDateTime = (session: Session) => {
  const sessionDate = new Date(session.date)
  if (session.time) {
    const [hours, minutes] = session.time.split(":")
    const parsedHours = Number.parseInt(hours ?? "0", 10)
    const parsedMinutes = Number.parseInt(minutes ?? "0", 10)
    if (!Number.isNaN(parsedHours)) {
      sessionDate.setHours(parsedHours, Number.isNaN(parsedMinutes) ? 0 : parsedMinutes, 0, 0)
    }
  }
  return sessionDate
}

export default function LearnerProfilePage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [bio, setBio] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<ProcessedReview[]>([])

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      setError(t('learnerDashboard.errors.loginRequired'))
      setIsLoading(false)
      return
    }

    if (!user) {
      dispatch(getCurrentUser())
      return
    }

    initializeProfile(user)
    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user])

  const initializeProfile = (currentUser: any) => {
    setFirstname(currentUser?.firstname || "")
    setLastname(currentUser?.lastname || "")
    setBio(currentUser?.bio || "")
    setAvatarPreview(currentUser?.avatar || null)
  }

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await learnerService.getDashboard()
      if (response.success && response.data) {
        const { upcomingSessions, pastSessions, reviews } = response.data

        setUpcomingSessions(upcomingSessions || [])
        setPastSessions(pastSessions || [])

        const processedReviews: ProcessedReview[] = (reviews || []).map((review) => ({
          ...review,
          speaker: typeof review.to === "object" ? (review.to as Speaker) : null,
        }))
        setReviews(processedReviews)
      }
    } catch (err) {
      console.error("Error loading learner profile:", err)
      setError(t('learnerDashboard.errors.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError("")

      const avatarUrl = await learnerService.uploadAvatar(file)
      setAvatarPreview(avatarUrl)

      if (user) {
        dispatch(
          setUser({
            ...user,
            avatar: avatarUrl,
          })
        )
      }
    } catch (err) {
      console.error("Error uploading avatar:", err)
      setError(t('learnerDashboard.errors.avatarFailed'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true)
      setError("")

      await learnerService.updateProfile({
        firstname: firstname.trim() || undefined,
        lastname: lastname.trim() || undefined,
        bio: bio.trim() || undefined,
      })

      if (user) {
        dispatch(
          setUser({
            ...user,
            firstname: firstname.trim() || user.firstname,
            lastname: lastname.trim() || user.lastname,
            bio: bio.trim() || "",
          })
        )
      }

      setIsEditingProfile(false)
    } catch (err) {
      console.error("Error saving learner profile:", err)
      setError(t('learnerDashboard.errors.saveFailed'))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      initializeProfile(user)
    }
    setIsEditingProfile(false)
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
  const recentSessions = sortedPastSessions.slice(0, 3)

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
            rating: speaker.rating,
          })
        }
      }
    })

    return Array.from(speakerMap.values())
      .sort((a, b) => {
        if (b.sessions !== a.sessions) return b.sessions - a.sessions
        return b.lastSession.getTime() - a.lastSession.getTime()
      })
      .slice(0, 5)
  }, [pastSessions])

  const completedSessionsCount = pastSessions.filter((session) => session.status === "completed").length
  const cancelledSessionsCount = pastSessions.filter((session) => session.status === "cancelled").length
  const upcomingCount = sortedUpcomingSessions.length
  const totalSessions = pastSessions.length + upcomingCount
  const completionRate =
    completedSessionsCount + cancelledSessionsCount > 0
      ? Math.round((completedSessionsCount / (completedSessionsCount + cancelledSessionsCount)) * 100)
      : 0

  const averageRating = reviews.length
    ? (
        reviews.reduce((total, review) => total + (review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : null

  const interests = user?.interests || []

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A1A33] via-purple-900 to-[#1A1A33]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A33] via-purple-900 to-[#1A1A33] pb-16 pt-24 px-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {t('learnerDashboard.profile.title')}
            </h1>
            <p className="text-sm text-gray-300">
              {t('learnerDashboard.profile.description')}
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-white/20 text-white bg-white/10"
          >
            <Link href="/learners/dashboard" className="inline-flex items-center gap-2">
              {t('learnerDashboard.summary.upcoming')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white text-lg">
                  {t('learnerDashboard.profile.title')}
                </CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  {t('learnerDashboard.profile.description')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="border-white/20 text-white hover:bg-white/10"
                      disabled={isSavingProfile}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t('learnerDashboard.cancel.keep')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="bg-purple-600 text-white hover:bg-purple-500"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('learnerDashboard.profile.saving')}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t('learnerDashboard.profile.save')}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-white/10 backdrop-blur">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Learner avatar"
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500">
                        <User className="h-16 w-16 text-white" />
                      </div>
                    )}
                  </div>
                  {isEditingProfile && (
                    <label className="absolute -bottom-2 right-4 cursor-pointer rounded-full bg-purple-600 p-2 text-white shadow-lg transition hover:bg-purple-500">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-300">
                  {user?.email}
                </p>
              </div>

              <div className="flex-1 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="firstname" className="text-xs uppercase tracking-wide text-gray-400">
                      {t('learnerDashboard.profile.firstName')}
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        id="firstname"
                        value={firstname}
                        onChange={(event) => setFirstname(event.target.value)}
                        className="bg-white/10 text-white"
                      />
                    ) : (
                      <p className="text-sm text-white">
                        {firstname || user?.firstname || "—"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastname" className="text-xs uppercase tracking-wide text-gray-400">
                      {t('learnerDashboard.profile.lastName')}
                    </Label>
                    {isEditingProfile ? (
                      <Input
                        id="lastname"
                        value={lastname}
                        onChange={(event) => setLastname(event.target.value)}
                        className="bg-white/10 text-white"
                      />
                    ) : (
                      <p className="text-sm text-white">
                        {lastname || user?.lastname || "—"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs uppercase tracking-wide text-gray-400">
                    {t('dashboard.profile.bio')}
                  </Label>
                  {isEditingProfile ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      rows={5}
                      placeholder={t('dashboard.profile.bioPlaceholder')}
                      className="bg-white/10 text-sm text-white"
                    />
                  ) : (
                    <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
                      {bio ? bio : t('dashboard.profile.noBio')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerDashboard.topSpeakers.subtitle')}
                  </p>
                  {interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={interest} className="border-purple-400/20 bg-purple-500/15 text-purple-100">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">{t('learnerDashboard.summary.speakersHelper')}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="border-white/20 bg-white/10 backdrop-blur-lg lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {t('learnerProfile.summary.title')}
              </CardTitle>
              <CardDescription className="text-xs text-gray-300">
                {t('learnerProfile.summary.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.totalSessions')}
                  </p>
                  <p className="text-2xl font-semibold text-white">{totalSessions}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.completed')}
                  </p>
                  <p className="text-2xl font-semibold text-white">{completedSessionsCount}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.upcoming')}
                  </p>
                  <p className="text-2xl font-semibold text-white">{upcomingCount}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.completionRate')}
                  </p>
                  <p className="text-2xl font-semibold text-white">{completionRate}%</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.nextSession')}
                  </p>
                  {nextSession ? (
                    <div className="mt-2 space-y-2 text-sm text-gray-200">
                      <p className="text-base font-semibold text-white">{nextSession.title}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateLong(nextSession.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {nextSession.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {t('learnerDashboard.sessions.with')}{' '}
                        {typeof nextSession.speaker === "object"
                          ? `${nextSession.speaker.firstname} ${nextSession.speaker.lastname}`
                          : nextSession.speaker}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">
                      {t('learnerProfile.summary.noUpcoming')}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {t('learnerProfile.summary.rating')}
                  </p>
                  {averageRating ? (
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-lg font-semibold">{averageRating}</span>
                      <span className="text-xs text-gray-400">
                        {t('learnerDashboard.reviews.title')}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">
                      {t('learnerDashboard.reviews.noReviews')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-white/10 backdrop-blur-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {t('learnerProfile.recentSessions.title')}
              </CardTitle>
              <CardDescription className="text-xs text-gray-300">
                {t('learnerProfile.recentSessions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-gray-400">
                  {t('learnerProfile.recentSessions.none')}
                </p>
              ) : (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session._id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-200">
                      <p className="text-base font-semibold text-white">{session.title}</p>
                      <p className="text-xs text-gray-400">
                        {formatDateShort(session.date)} · {session.time}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t('learnerDashboard.sessions.with')}{' '}
                        {typeof session.speaker === "object"
                          ? `${session.speaker.firstname} ${session.speaker.lastname}`
                          : session.speaker}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
