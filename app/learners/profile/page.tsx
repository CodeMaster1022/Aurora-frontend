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
} from "lucide-react"
import { learnerService, Session, Review, LearnerProfile } from "@/lib/services/learnerService"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { LearnerRatingModal } from "@/components/LearnerRatingModal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
      setError("You must be logged in to view this page.")
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
              typeof review.session === "object"
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
      setError(err instanceof Error ? err.message : "Unable to load data")
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
      setError(err instanceof Error ? err.message : "Failed to update profile")
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
      setError(err instanceof Error ? err.message : "Failed to upload avatar")
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
      setError(err instanceof Error ? err.message : "Unable to cancel session")
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

  const handleCreateDonation = async () => {
    try {
      setIsCreatingDonation(true)
      const response = await learnerService.createDonation()
      if (response.success && response.data?.url) {
        window.location.href = response.data.url
      }
    } catch (err) {
      console.error("Error creating donation session:", err)
      setError(err instanceof Error ? err.message : "Unable to start donation checkout")
    } finally {
      setIsCreatingDonation(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">Learner Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal details, review your sessions, and keep track of your learning journey.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted sm:h-24 sm:w-24">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  {isEditingProfile && (
                    <label className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                      <Camera className="mr-1 h-3.5 w-3.5" />
                      Upload
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
                <div className="space-y-2">
                  <div>
                    <h2 className="text-2xl font-semibold leading-tight">
                      {[firstname, lastname].filter(Boolean).join(" ") || user?.email || "Learner"}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs uppercase">
                    Learner
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleCancelEditProfile}
                      disabled={isSavingProfile}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="cursor-pointer"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="cursor-pointer" onClick={handleStartEditProfile}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={firstname} onChange={(event) => setFirstname(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={lastname} onChange={(event) => setLastname(event.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    rows={4}
                    placeholder="Share a little bit about your goals and interests."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">About</Label>
                  <p className="mt-2 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                    {bio || "You haven't added a bio yet. Tell speakers about yourself and your goals."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
              <p className="mt-2 text-2xl font-semibold">{totalSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="mt-2 text-2xl font-semibold">{completedSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <p className="mt-2 text-2xl font-semibold">{upcomingSessionsCount}</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p className="mt-2 text-2xl font-semibold">{completionRate}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Stay prepared for your next conversations with Aurora speakers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session._id}
                      className="rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            with {typeof session.speaker === "object"
                              ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                              : session.speaker}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(session.date)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatTime(session.time)}
                            </span>
                          </div>
                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Join meeting →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs uppercase">
                            {session.status}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleCancelSession(session)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
                  No upcoming sessions scheduled yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5" />
                Past Sessions
              </CardTitle>
              <CardDescription>Review your progress and share feedback with your speakers.</CardDescription>
            </CardHeader>
            <CardContent>
              {pastSessions.length > 0 ? (
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session._id}
                      className="rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            with {typeof session.speaker === "object"
                              ? `${(session.speaker as any).firstname} ${(session.speaker as any).lastname}`
                              : session.speaker}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(session.date)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatTime(session.time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs uppercase ${
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
                              className="cursor-pointer"
                              onClick={() => handleRateSession(session)}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Rate & Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
                  You haven&apos;t completed any sessions yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare className="h-5 w-5" />
              Reviews You&apos;ve Shared
            </CardTitle>
            <CardDescription>
              Your feedback helps our speakers grow and tailor sessions for future learners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${index < review.rating ? "fill-amber-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-foreground">{review.comment || "No comment provided."}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>
                        {typeof review.to === "object"
                          ? `${(review.to as any).firstname} ${(review.to as any).lastname}`
                          : review.to}
                      </span>
                      {review.sessionDetails && (
                        <span>
                          {" • "}
                          {review.sessionDetails.title} — {formatDate(review.sessionDetails.date)} at {formatTime(review.sessionDetails.time)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
                You haven&apos;t left any reviews yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Support the Aurora Community</h3>
              <p className="text-sm text-muted-foreground">
                Your contributions help us provide scholarships and keep conversations accessible to learners worldwide.
              </p>
            </div>
            <Button
              className="inline-flex items-center gap-2"
              onClick={handleCreateDonation}
              disabled={isCreatingDonation}
            >
              {isCreatingDonation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              {isCreatingDonation ? "Preparing checkout..." : "Donate"}
              <ArrowRight className="h-4 w-4" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cancel Session
            </DialogTitle>
            <DialogDescription>
              We&apos;ll notify your speaker and free up the slot for other learners.
            </DialogDescription>
          </DialogHeader>
          {selectedSessionForCancellation && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{selectedSessionForCancellation.title}</p>
                <p>
                  with {typeof selectedSessionForCancellation.speaker === "object"
                    ? `${(selectedSessionForCancellation.speaker as any).firstname} ${(selectedSessionForCancellation.speaker as any).lastname}`
                    : selectedSessionForCancellation.speaker}
                </p>
                <p>
                  {formatDate(selectedSessionForCancellation.date)} at {formatTime(selectedSessionForCancellation.time)}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {(() => {
                    const hoursUntil = getHoursUntilSession(selectedSessionForCancellation)
                    if (hoursUntil < 0) {
                      return "This session time has already passed."
                    }
                    return `This session starts in approximately ${Math.round(hoursUntil)} hour(s).`
                  })()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation-reason" className="text-sm font-medium">
                  Reason for cancellation (optional)
                </Label>
                <Textarea
                  id="cancellation-reason"
                  value={cancellationReason}
                  onChange={(event) => setCancellationReason(event.target.value)}
                  placeholder="Let your speaker know why you&apos;re cancelling."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setCancelModalOpen(false)
                setSelectedSessionForCancellation(null)
                setCancellationReason("")
              }}
              disabled={isCancelling}
            >
              Keep session
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancellation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
