"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Edit,
  Save,
  Loader2,
  User,
  Camera,
  Star,
  MessageSquare,
  Heart,
  ArrowRight,
  AlertTriangle,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { learnerService, Session, Review, LearnerProfile } from "@/lib/services/learnerService"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { LearnerRatingModal } from "@/components/LearnerRatingModal"
import { DonationAmountDialog } from "@/components/DonationAmountDialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface ReviewWithSession extends Review {
  sessionDetails?: {
    title: string
    date: string
    time: string
  }
}

type ProfileSnapshot = {
  firstname: string
  lastname: string
  bio: string
  avatar: string | null
}

export default function LearnerProfilePage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [profileStats, setProfileStats] = useState<LearnerProfile | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<ReviewWithSession[]>([])

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [bio, setBio] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const profileSnapshotRef = useRef<ProfileSnapshot | null>(null)

  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedSessionForRating, setSelectedSessionForRating] = useState<Session | null>(null)

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedSessionForCancellation, setSelectedSessionForCancellation] = useState<Session | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  const [isCreatingDonation, setIsCreatingDonation] = useState(false)
  const [donationDialogOpen, setDonationDialogOpen] = useState(false)
  const [isUpcomingSessionsOpen, setIsUpcomingSessionsOpen] = useState(false)
  const [isPastSessionsOpen, setIsPastSessionsOpen] = useState(true)
  const [isReviewsOpen, setIsReviewsOpen] = useState(true)

  const hasReviewedSession = (sessionId: string) => {
    return reviews.some((review) => {
      if (typeof review.session === "string") {
        return review.session === sessionId
      }
      return review.session && (review.session as any)._id === sessionId
    })
  }

  const completedSessions = pastSessions.filter((session) => session.status === "completed")
  const totalSessionsCount = profileStats?.totalSessions ?? pastSessions.length + upcomingSessions.length
  const completedSessionsCount = profileStats?.completedSessions ?? completedSessions.length
  const upcomingSessionsCount = profileStats?.upcomingSessions ?? upcomingSessions.length

  const completionRate = useMemo(() => {
    if (!totalSessionsCount) return "0%"
    const rate = (completedSessionsCount / totalSessionsCount) * 100
    return `${Math.round(rate)}%`
  }, [completedSessionsCount, totalSessionsCount])

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "")
      setLastname(user.lastname || "")
      setBio(user.bio || "")
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated && !user) {
      dispatch(getCurrentUser())
      return
    }

    if (!isAuthenticated) {
      setIsLoading(false)
      setError(t("learnerProfile.errors.loginRequired"))
      return
    }

    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await learnerService.getDashboard()

      if (response.success && response.data) {
        setProfileStats(response.data.profile)
        setUpcomingSessions(response.data.upcomingSessions || [])
        setPastSessions(response.data.pastSessions || [])
        setReviews(
          (response.data.reviews || []).map((review) => ({
            ...review,
            sessionDetails:
              typeof review.session === "object" && review.session !== null
                ? {
                    title: (review.session as any).title,
                    date: (review.session as any).date,
                    time: (review.session as any).time,
                  }
                : undefined,
          }))
        )
      }
    } catch (err) {
      console.error("Error loading learner profile:", err)
      setError(err instanceof Error ? err.message : t("learnerProfile.errors.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartEditProfile = () => {
    profileSnapshotRef.current = {
      firstname,
      lastname,
      bio,
      avatar: avatarPreview,
    }
    setIsEditingProfile(true)
  }

  const handleCancelEditProfile = () => {
    const snapshot = profileSnapshotRef.current
    if (snapshot) {
      setFirstname(snapshot.firstname)
      setLastname(snapshot.lastname)
      setBio(snapshot.bio)
      setAvatarPreview(snapshot.avatar)
    }
    profileSnapshotRef.current = null
    setIsEditingProfile(false)
  }

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true)
      setError("")

      await learnerService.updateProfile({
        firstname: firstname.trim() || undefined,
        lastname: lastname.trim() || undefined,
        bio,
      })

      profileSnapshotRef.current = null
      setIsEditingProfile(false)
      dispatch(getCurrentUser())
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : t("learnerProfile.errors.updateFailed"))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingAvatar(true)
      setError("")
      const avatarUrl = await learnerService.uploadAvatar(file)
      setAvatarPreview(avatarUrl)
      dispatch(getCurrentUser())
    } catch (err) {
      console.error("Error uploading avatar:", err)
      setError(err instanceof Error ? err.message : t("learnerProfile.errors.avatarFailed"))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRateSession = (session: Session) => {
    setSelectedSessionForRating(session)
    setRatingModalOpen(true)
  }

  const handleRatingSuccess = () => {
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
      await learnerService.cancelSession(
        selectedSessionForCancellation._id,
        cancellationReason.trim() || undefined
      )

      setCancelModalOpen(false)
      setSelectedSessionForCancellation(null)
      setCancellationReason("")
      fetchDashboardData()
    } catch (err) {
      console.error("Error cancelling session:", err)
      setError(err instanceof Error ? err.message : t("learnerProfile.errors.cancelFailed"))
    } finally {
      setIsCancelling(false)
    }
  }

  const getHoursUntilSession = (session: Session) => {
    const sessionDate = new Date(session.date)
    const [hour, minute] = session.time.split(":").map((value) => parseInt(value, 10))
    sessionDate.setHours(hour, minute, 0, 0)
    const now = new Date()
    return (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  }

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    return new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes}:00`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreateDonation = () => {
    setDonationDialogOpen(true)
  }

  const handleDonationConfirm = async (amount: number) => {
    try {
      setIsCreatingDonation(true)
      setError("")
      const response = await learnerService.createDonation(amount)
      if (response.success && response.data?.url) {
        window.location.href = response.data.url
      } else {
        setError((response as any).message || t("learnerProfile.errors.donationFailed"))
        setIsCreatingDonation(false)
        setDonationDialogOpen(false)
      }
    } catch (err) {
      console.error("Error creating donation session:", err)
      setError(err instanceof Error ? err.message : t("learnerProfile.errors.donationFailed"))
      setIsCreatingDonation(false)
      setDonationDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary sm:h-8 sm:w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 pb-8 pt-4 sm:gap-6 sm:px-4 sm:pb-12 sm:pt-6 md:gap-8 md:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <header className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">{t("learnerProfile.title")}</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">{t("learnerProfile.subtitle")}</p>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive sm:px-4 sm:py-3 sm:text-sm">
            {error}
          </div>
        )}

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt={t("learnerProfile.avatarAlt")} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
                    </div>
                  )}
                  {isEditingProfile && (
                    <label className="absolute bottom-0 right-0 inline-flex cursor-pointer items-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow-sm hover:bg-primary/90 sm:bottom-1 sm:right-1 sm:px-2 sm:py-1 sm:text-xs">
                      <Camera className="mr-0.5 h-2.5 w-2.5 sm:mr-1 sm:h-3 sm:w-3" />
                      <span className="hidden sm:inline">{t("learnerProfile.buttons.upload")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploadingAvatar}
                      />
                    </label>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
                  <div>
                    <h2 className="text-base font-semibold leading-tight sm:text-lg md:text-xl lg:text-2xl">
                      {[firstname, lastname].filter(Boolean).join(" ") || user?.email || t("learnerProfile.fallbackName")}
                    </h2>
                    <p className="text-xs text-muted-foreground sm:text-sm">{user?.email}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase sm:text-xs">
                    {t("learnerProfile.roleBadge")}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-end md:self-auto">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={handleCancelEditProfile}
                      disabled={isSavingProfile}
                    >
                      <span className="hidden sm:inline">{t("learnerProfile.buttons.cancel")}</span>
                      <span className="sm:hidden">{t("learnerProfile.buttons.cancel").split(" ")[0]}</span>
                    </Button>
                    <Button
                      size="sm"
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">{t("learnerProfile.buttons.saving")}</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Save className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">{t("learnerProfile.buttons.saveProfile")}</span>
                          <span className="sm:hidden">Save</span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm" onClick={handleStartEditProfile}>
                    <Edit className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("learnerProfile.buttons.editProfile")}</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">{t("learnerProfile.labels.firstName")}</Label>
                  <Input value={firstname} onChange={(event) => setFirstname(event.target.value)} className="h-8 text-sm sm:h-10 sm:text-base" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">{t("learnerProfile.labels.lastName")}</Label>
                  <Input value={lastname} onChange={(event) => setLastname(event.target.value)} className="h-8 text-sm sm:h-10 sm:text-base" />
                </div>
                <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm">{t("learnerProfile.labels.bio")}</Label>
                  <Textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    rows={3}
                    className="text-sm sm:rows-4 sm:text-base"
                    placeholder={t("learnerProfile.placeholders.bio")}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                <div>
                  <Label className="text-[10px] uppercase text-muted-foreground sm:text-xs">{t("learnerProfile.labels.about")}</Label>
                  <p className="mt-1.5 rounded-lg border border-border bg-muted/40 p-2 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:p-3 sm:text-sm md:p-4">
                    {bio || t("learnerProfile.placeholders.noBio")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-4 md:gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-2 sm:p-4 md:p-5">
              <p className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">{t("learnerProfile.stats.total")}</p>
              <p className="mt-1 text-lg font-semibold sm:mt-1.5 sm:text-xl md:mt-2 md:text-2xl">{totalSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-2 sm:p-4 md:p-5">
              <p className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">{t("learnerProfile.stats.completed")}</p>
              <p className="mt-1 text-lg font-semibold sm:mt-1.5 sm:text-xl md:mt-2 md:text-2xl">{completedSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-2 sm:p-4 md:p-5">
              <p className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">{t("learnerProfile.stats.upcoming")}</p>
              <p className="mt-1 text-lg font-semibold sm:mt-1.5 sm:text-xl md:mt-2 md:text-2xl">{upcomingSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-2 sm:p-4 md:p-5">
              <p className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">{t("learnerProfile.stats.completionRate")}</p>
              <p className="mt-1 text-lg font-semibold sm:mt-1.5 sm:text-xl md:mt-2 md:text-2xl">{completionRate}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-1">
          <Collapsible open={isUpcomingSessionsOpen} onOpenChange={setIsUpcomingSessionsOpen}>
            <Card className="shadow-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      {t("learnerProfile.upcomingSessions.title")}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUpcomingSessionsOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t("learnerProfile.upcomingSessions.description")}</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {upcomingSessions.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2.5 sm:space-y-3 md:hidden">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session._id}
                            className="rounded-lg border border-border bg-muted/30 p-2.5 transition-colors hover:bg-muted sm:p-3"
                          >
                            <div className="flex flex-col gap-2 sm:gap-2.5">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                                  <h3 className="text-sm font-semibold leading-tight sm:text-base">{session.title}</h3>
                                  <p className="text-xs text-muted-foreground sm:text-sm">
                                    {`${t("learnerProfile.sessions.with")} ${
                                      typeof session.speaker === "object"
                                        ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                                        : session.speaker
                                    }`}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:gap-4 sm:text-sm">
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      {formatDate(session.date)}
                                    </span>
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      {formatTime(session.time)}
                                    </span>
                                  </div>
                                  {session.meetingLink && (
                                    <a
                                      href={session.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block text-xs font-medium text-primary hover:underline sm:text-sm"
                                    >
                                      {t("learnerProfile.buttons.joinMeeting")}
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Badge variant="outline" className="text-[10px] uppercase sm:text-xs">
                                    {session.status}
                                  </Badge>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 cursor-pointer px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                                    onClick={() => handleCancelSession(session)}
                                  >
                                    <span className="hidden sm:inline">{t("learnerProfile.buttons.cancel")}</span>
                                    <span className="sm:hidden">Cancel</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Desktop View - Table */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Title</TableHead>
                              <TableHead className="text-xs sm:text-sm">Speaker</TableHead>
                              <TableHead className="text-xs sm:text-sm">Date</TableHead>
                              <TableHead className="text-xs sm:text-sm">Time</TableHead>
                              <TableHead className="text-xs sm:text-sm">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingSessions.map((session) => (
                              <TableRow key={session._id}>
                                <TableCell className="font-medium text-xs sm:text-sm">{session.title}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {typeof session.speaker === "object"
                                    ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                                    : session.speaker}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatDate(session.date)}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatTime(session.time)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-[10px] uppercase sm:text-xs">
                                    {session.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {session.meetingLink && (
                                      <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-primary hover:underline sm:text-sm"
                                      >
                                        {t("learnerProfile.buttons.joinMeeting")}
                                      </a>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="h-7 cursor-pointer px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                                      onClick={() => handleCancelSession(session)}
                                    >
                                      {t("learnerProfile.buttons.cancel")}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 py-8 text-center text-xs text-muted-foreground sm:py-10 sm:text-sm md:py-12">
                      {t("learnerProfile.upcomingSessions.empty")}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={isPastSessionsOpen} onOpenChange={setIsPastSessionsOpen}>
            <Card className="shadow-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      {t("learnerProfile.pastSessions.title")}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPastSessionsOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t("learnerProfile.pastSessions.description")}</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {pastSessions.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2.5 sm:space-y-3 md:hidden">
                        {pastSessions.map((session) => (
                          <div
                            key={session._id}
                            className="rounded-lg border border-border bg-muted/30 p-2.5 transition-colors hover:bg-muted sm:p-3"
                          >
                            <div className="flex flex-col gap-2 sm:gap-2.5">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                                  <h3 className="text-sm font-semibold leading-tight sm:text-base">{session.title}</h3>
                                  <p className="text-xs text-muted-foreground sm:text-sm">
                                    {`${t("learnerProfile.sessions.with")} ${
                                      typeof session.speaker === "object"
                                        ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                                        : session.speaker
                                    }`}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:gap-4 sm:text-sm">
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      {formatDate(session.date)}
                                    </span>
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5">
                                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      {formatTime(session.time)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-start gap-1.5 sm:items-end sm:gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] uppercase sm:text-xs ${
                                      session.status === "completed"
                                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-300"
                                        : "border-muted-foreground text-muted-foreground"
                                    }`}
                                  >
                                    {session.status}
                                  </Badge>
                                  {session.status === "completed" && !hasReviewedSession(session._id) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 w-full cursor-pointer px-2 text-xs sm:h-8 sm:w-auto sm:px-3 sm:text-sm"
                                      onClick={() => handleRateSession(session)}
                                    >
                                      <Star className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                                      <span className="hidden sm:inline">{t("learnerProfile.buttons.rateReview")}</span>
                                      <span className="sm:hidden">Rate</span>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Desktop View - Table */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Title</TableHead>
                              <TableHead className="text-xs sm:text-sm">Speaker</TableHead>
                              <TableHead className="text-xs sm:text-sm">Date</TableHead>
                              <TableHead className="text-xs sm:text-sm">Time</TableHead>
                              <TableHead className="text-xs sm:text-sm">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pastSessions.map((session) => (
                              <TableRow key={session._id}>
                                <TableCell className="font-medium text-xs sm:text-sm">{session.title}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {typeof session.speaker === "object"
                                    ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                                    : session.speaker}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatDate(session.date)}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatTime(session.time)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] uppercase sm:text-xs ${
                                      session.status === "completed"
                                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-300"
                                        : "border-muted-foreground text-muted-foreground"
                                    }`}
                                  >
                                    {session.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {session.status === "completed" && !hasReviewedSession(session._id) ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 cursor-pointer px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                                      onClick={() => handleRateSession(session)}
                                    >
                                      <Star className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                                      {t("learnerProfile.buttons.rateReview")}
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px] uppercase sm:text-xs">
                                      Feedback Given
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 py-8 text-center text-xs text-muted-foreground sm:py-10 sm:text-sm md:py-12">
                      {t("learnerProfile.pastSessions.empty")}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        <Collapsible open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
          <Card className="shadow-sm">
            <CollapsibleTrigger asChild>
              <CardHeader className="p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    {t("learnerProfile.reviews.title")}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isReviewsOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">{t("learnerProfile.reviews.description")}</CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-3 sm:p-4 md:p-6">
                {reviews.length > 0 ? (
                  <>
                    {/* Mobile/Tablet View - Cards */}
                    <div className="space-y-2.5 sm:space-y-3 md:hidden">
                      {reviews.map((review) => (
                        <div key={review._id} className="rounded-lg border border-border bg-muted/30 p-2.5 sm:p-3">
                          <div className="flex items-center gap-0.5 text-amber-500 sm:gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${index < review.rating ? "fill-amber-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-foreground sm:mt-2.5 sm:text-sm">{review.comment || t("learnerProfile.reviews.noComment")}</p>
                          <div className="mt-1.5 flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:mt-2 sm:flex-row sm:gap-1 sm:text-xs">
                            <span>
                              {typeof review.to === "object"
                                ? `${(review.to as any).firstname} ${(review.to as any).lastname}`
                                : review.to}
                            </span>
                            {review.sessionDetails && (
                              <>
                                <span className="hidden sm:inline">{" • "}</span>
                                <span className="break-words">
                                  {review.sessionDetails.title} — {formatDate(review.sessionDetails.date)} {t("learnerProfile.sessions.at")}{" "}
                                  {formatTime(review.sessionDetails.time)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop View - Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Rating</TableHead>
                            <TableHead className="text-xs sm:text-sm">Comment</TableHead>
                            <TableHead className="text-xs sm:text-sm">To</TableHead>
                            <TableHead className="text-xs sm:text-sm">Session</TableHead>
                            <TableHead className="text-xs sm:text-sm">Date & Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reviews.map((review) => (
                            <TableRow key={review._id}>
                              <TableCell>
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${index < review.rating ? "fill-amber-400" : "text-muted-foreground"}`}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm max-w-md">
                                <p className="line-clamp-2">{review.comment || t("learnerProfile.reviews.noComment")}</p>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                {typeof review.to === "object"
                                  ? `${(review.to as any).firstname} ${(review.to as any).lastname}`
                                  : review.to}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                {review.sessionDetails ? review.sessionDetails.title : "-"}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                {review.sessionDetails
                                  ? `${formatDate(review.sessionDetails.date)} ${t("learnerProfile.sessions.at")} ${formatTime(review.sessionDetails.time)}`
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 py-8 text-center text-xs text-muted-foreground sm:py-10 sm:text-sm md:py-12">
                    {t("learnerProfile.reviews.empty")}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-3 p-3 sm:gap-3.5 sm:p-4 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6">
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <h3 className="text-base font-semibold sm:text-lg md:text-xl">{t("learnerProfile.support.title")}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{t("learnerProfile.support.description")}</p>
            </div>
            <Button
              size="sm"
              className="inline-flex w-full items-center justify-center gap-1.5 text-xs sm:w-auto sm:text-sm"
              onClick={handleCreateDonation}
              disabled={isCreatingDonation}
            >
              {isCreatingDonation ? (
                <Loader2 className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              ) : (
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              )}
              <span className="hidden sm:inline">
                {isCreatingDonation ? t("learnerProfile.buttons.preparingCheckout") : t("learnerProfile.buttons.donate")}
              </span>
              <span className="sm:hidden">{isCreatingDonation ? "..." : "Donate"}</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedSessionForRating && (
        <LearnerRatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          sessionId={selectedSessionForRating._id}
          speakerName={
            typeof selectedSessionForRating.speaker === "object"
              ? `${(selectedSessionForRating.speaker as any).firstname} ${(selectedSessionForRating.speaker as any).lastname}`
              : selectedSessionForRating.speaker
          }
          onSuccess={handleRatingSuccess}
        />
      )}

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-[95vw] sm:max-w-md">
          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
              <AlertTriangle className="h-4 w-4 text-destructive sm:h-4 sm:w-4 md:h-5 md:w-5" />
              {t("learnerProfile.modals.cancelSession.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
              {t("learnerProfile.modals.cancelSession.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedSessionForCancellation && (
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-2.5 text-xs text-muted-foreground sm:p-3 sm:text-sm md:p-4">
                <p className="font-medium text-card-foreground sm:text-base">{selectedSessionForCancellation.title}</p>
                <p className="mt-1 text-muted-foreground sm:mt-1.5">
                  {`${t("learnerProfile.sessions.with")} ${
                    typeof selectedSessionForCancellation.speaker === "object"
                      ? `${(selectedSessionForCancellation.speaker as any).firstname} ${(selectedSessionForCancellation.speaker as any).lastname}`
                      : selectedSessionForCancellation.speaker
                  }`}
                </p>
                <p className="mt-1 text-muted-foreground sm:mt-1.5">
                  {formatDate(selectedSessionForCancellation.date)} {t("learnerProfile.sessions.at")}{" "}
                  {formatTime(selectedSessionForCancellation.time)}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/80 sm:mt-1.5 sm:text-xs">
                  {(() => {
                    const hoursUntil = getHoursUntilSession(selectedSessionForCancellation)
                    if (hoursUntil < 0) {
                      return t("learnerProfile.modals.cancelSession.alreadyPassed")
                    }
                    return t("learnerProfile.modals.cancelSession.startsInHours").replace(
                      "{hours}",
                      Math.round(hoursUntil).toString()
                    )
                  })()}
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="cancellation-reason" className="text-xs font-medium sm:text-sm">
                  {t("learnerProfile.modals.cancelSession.reasonLabel")}
                </Label>
                <Textarea
                  id="cancellation-reason"
                  value={cancellationReason}
                  onChange={(event) => setCancellationReason(event.target.value)}
                  placeholder={t("learnerProfile.modals.cancelSession.reasonPlaceholder")}
                  rows={3}
                  className="border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 sm:rows-4 sm:text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs sm:w-auto sm:text-sm"
              onClick={() => {
                setCancelModalOpen(false)
                setSelectedSessionForCancellation(null)
                setCancellationReason("")
              }}
              disabled={isCancelling}
            >
              {t("learnerProfile.buttons.keepSession")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs sm:w-auto sm:text-sm"
              onClick={handleConfirmCancellation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{t("learnerProfile.buttons.cancelling")}</span>
                  <span className="sm:hidden">Cancelling...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{t("learnerProfile.buttons.confirmCancellation")}</span>
                  <span className="sm:hidden">Confirm</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DonationAmountDialog
        open={donationDialogOpen}
        onOpenChange={setDonationDialogOpen}
        onConfirm={handleDonationConfirm}
        isLoading={isCreatingDonation}
      />
    </div>
  )
}
