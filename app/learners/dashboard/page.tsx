"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Calendar, 
  Clock, 
  Star, 
  Edit, 
  Save, 
  X, 
  Upload,
  Loader2,
  Camera,
  User,
  CheckCircle2,
  MessageSquare,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { learnerService, Session, Speaker, Review } from "@/lib/services/learnerService"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { LearnerRatingModal } from "@/components/LearnerRatingModal"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"

export default function LearnerDashboardPage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [bio, setBio] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Rating dialog states
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedSessionForRating, setSelectedSessionForRating] = useState<Session | null>(null)

  // Cancellation dialog states
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedSessionForCancellation, setSelectedSessionForCancellation] = useState<Session | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    console.log('=== Learner Dashboard First Render ===')
    console.log('User:', user)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('authLoading:', authLoading)
    
    // If authenticated but no user data, fetch it
    if (isAuthenticated && !user) {
      console.log('Fetching current user...')
      dispatch(getCurrentUser())
    }
  }, [isAuthenticated, user, dispatch, authLoading])

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
    } 
    // If not authenticated at all, show error
    else if (!isAuthenticated) {
      console.log('Not authenticated, showing error')
      setIsLoading(false)
      setError(t('learnerDashboard.errors.loginRequired'))
    }
    // If authenticated but no user yet, wait for getCurrentUser to complete
    else if (isAuthenticated && !user) {
      console.log('Authenticated but no user, waiting for getCurrentUser...')
      // Keep loading state - getCurrentUser will be called by the first useEffect
    }
  }, [user, isAuthenticated, authLoading])

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
      if (!hasBeenReviewed(session._id)) {
        // Found a completed session that hasn't been reviewed - open modal
        setSelectedSessionForRating(session)
        setRatingModalOpen(true)
        return // Only open for one session at a time
      }
    }
    
    // Also check upcoming sessions that have actually ended but still marked as scheduled
    const endedSessions = upcomingSessions.filter(s => hasSessionEnded(s) && !hasBeenReviewed(s._id))
    if (endedSessions.length > 0) {
      // Found an ended session that hasn't been reviewed - open modal
      setSelectedSessionForRating(endedSessions[0])
      setRatingModalOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingSessions, pastSessions, reviews, isLoading, user])

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
      const response = await learnerService.getDashboard()
      
      if (response.success && response.data) {
        const { upcomingSessions, pastSessions, reviews } = response.data
        
        // Update sessions
        setUpcomingSessions(upcomingSessions || [])
        setPastSessions(pastSessions || [])
        setReviews(reviews || [])
        
        // Initialize profile data
        setFirstname(user.firstname || "")
        setLastname(user.lastname || "")
        setBio(user.bio || "")
      }
      
      // Set avatar if user has one
      if (user?.avatar) {
        setAvatarPreview(user.avatar)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(t('learnerDashboard.errors.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true)
      await learnerService.updateProfile({ firstname, lastname, bio })
      setIsEditingProfile(false)
      // Refresh user data
      if (isAuthenticated && !user) {
        dispatch(getCurrentUser())
      }
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(t('learnerDashboard.errors.saveFailed'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        const avatarUrl = await learnerService.uploadAvatar(file)
        setAvatarPreview(avatarUrl)
        // Update user in Redux store if needed
      } catch (err) {
        console.error("Error uploading avatar:", err)
        setError(t('learnerDashboard.errors.avatarFailed'))
      } finally {
        setIsUploading(false)
      }
    }
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
      
      await learnerService.cancelSession(
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
      setError(err.message || t('learnerDashboard.errors.cancelFailed'))
    } finally {
      setIsCancelling(false)
    }
  }

  // Calculate hours until session for cancellation rules
  const getHoursUntilSession = (session: Session): number => {
    const sessionDate = new Date(session.date)
    const sessionTime = session.time.split(':')
    sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]), 0, 0)
    
    const now = new Date()
    const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntil
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  // Check if a session has been reviewed by this learner
  const hasBeenReviewed = (sessionId: string) => {
    return reviews.some(review => {
      const reviewSessionId = typeof review.session === 'string' 
        ? review.session 
        : (review.session as any)?._id || review.session
      return String(reviewSessionId) === String(sessionId)
    })
  }

  // Check if a session has ended (date + time + duration has passed)
  const hasSessionEnded = (session: Session): boolean => {
    const sessionDate = new Date(session.date)
    const sessionTime = session.time.split(':')
    sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]), 0, 0)
    
    // Add session duration (default to 30 minutes if not specified)
    const duration = session.duration || 30
    const sessionEndTime = new Date(sessionDate.getTime() + duration * 60 * 1000)
    
    const now = new Date()
    return sessionEndTime <= now
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A33] via-purple-900 to-[#1A1A33] pt-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('learnerDashboard.title')}</h1>
          <p className="text-gray-300 text-sm sm:text-base">{t('learnerDashboard.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white mb-2">Profile</CardTitle>
                    <CardDescription className="text-gray-300">Your personal information</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-white hover:bg-white/20 cursor-pointer"
                  >
                    {isEditingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="rounded-full border-4 border-purple-500"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {isEditingProfile && (
                      <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                  {!isEditingProfile && (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white">
                        {user?.firstname} {user?.lastname}
                      </h3>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                  )}
                </div>

                {/* Profile Fields */}
                {isEditingProfile ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white mb-2">First Name</Label>
                      <Input
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2">Last Name</Label>
                      <Input
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Last name"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2">Bio</Label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isUploading}
                      className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 text-center">{bio || "No bio available"}</p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{upcomingSessions.length}</div>
                        <div className="text-xs text-gray-400">Upcoming</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{pastSessions.length}</div>
                        <div className="text-xs text-gray-400">Completed</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sessions */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Upcoming Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {upcomingSessions.length} session{upcomingSessions.length !== 1 ? 's' : ''} scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session._id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                            <p className="text-sm text-gray-300 mb-2">
                              with <span className="font-medium text-purple-300">
                                {typeof session.speaker === 'object' 
                                  ? `${session.speaker.firstname} ${session.speaker.lastname}`
                                  : session.speaker}
                              </span>
                            </p>
                            {session.topics && session.topics.length > 0 && (
                              <p className="text-xs text-gray-400 mb-2">Topics: {session.topics.join(', ')}</p>
                            )}
                            {session.icebreaker && (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-2 mt-2">
                                <p className="text-xs font-semibold text-yellow-400 mb-1">💡 Icebreaker</p>
                                <p className="text-xs text-yellow-200">{session.icebreaker}</p>
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(session.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(session.time)} ({session.duration} min)
                              </div>
                            </div>
                            {session.meetingLink && (
                              <a 
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-400 hover:text-purple-300 mt-2 inline-block"
                              >
                                Join Meeting →
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {session.status}
                            </Badge>
                            <Button
                              onClick={() => handleCancelSession(session)}
                              variant="outline"
                              size="sm"
                              className="text-red-400 cursor-pointer border-red-400/50 hover:bg-red-400/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No upcoming sessions</p>
                )}
              </CardContent>
            </Card>

            {/* Past Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Past Sessions & Reviews
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {pastSessions.length} session{pastSessions.length !== 1 ? 's' : ''} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastSessions.length > 0 ? (
                  <div className="space-y-4">
                    {pastSessions.map((session) => (
                      <div
                        key={session._id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                              <p className="text-sm text-gray-300">
                                with <span className="font-medium">
                                  {typeof session.speaker === 'object' 
                                    ? `${session.speaker.firstname} ${session.speaker.lastname}`
                                    : session.speaker}
                                </span>
                              </p>
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-400 mt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(session.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatTime(session.time)}
                                </div>
                              </div>
                            </div>
                            <Badge className={`${
                              session.status === 'completed'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            } self-start`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Badge>
                          </div>
                          
                          {/* Rate Button - Only show for completed sessions */}
                          {session.status === 'completed' && (
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleRateSession(session)}
                                variant="outline"
                                size="sm"
                                className="text-purple-400 cursor-pointer border-purple-400/50 hover:bg-purple-400/10"
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Rate & Review
                              </Button>
                            </div>
                          )}
                          
                          {/* Show cancellation reason if cancelled */}
                          {session.status === 'cancelled' && (session as any).cancellationReason && (
                            <div className="mt-2 p-2 bg-gray-500/10 border border-gray-500/20 rounded text-xs text-gray-400">
                              <span className="font-medium">Cancellation reason: </span>
                              {(session as any).cancellationReason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No completed sessions yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Learner Rating Modal */}
      {selectedSessionForRating && (
        <LearnerRatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          sessionId={selectedSessionForRating._id}
          speakerName={
            typeof selectedSessionForRating.speaker === 'object'
              ? `${selectedSessionForRating.speaker.firstname} ${selectedSessionForRating.speaker.lastname}`
              : selectedSessionForRating.speaker
          }
          onSuccess={handleRatingSuccess}
        />
      )}

      {/* Cancellation Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="bg-[#1A1A33] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Cancel Session
            </DialogTitle>
          </DialogHeader>
          {selectedSessionForCancellation && (
            <div className="space-y-4">
              {/* Cancellation Rules */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Cancellation Policy
                </h4>
                <ul className="text-sm text-yellow-200 space-y-1 list-disc list-inside">
                  <li>Sessions must be cancelled at least 24 hours before the scheduled time</li>
                  {(() => {
                    const hoursUntil = getHoursUntilSession(selectedSessionForCancellation)
                    return (
                      <li>
                        This session is {hoursUntil > 0 
                          ? `${Math.round(hoursUntil)} hours away`
                          : 'less than an hour away'}
                        {hoursUntil < 24 && hoursUntil > 0 && (
                          <span className="text-red-400"> (May not be eligible for cancellation)</span>
                        )}
                      </li>
                    )
                  })()}
                  <li>The speaker will be automatically notified of the cancellation</li>
                </ul>
              </div>

              {/* Session Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Session Details</h4>
                <p className="text-gray-300 text-sm mb-1">
                  <span className="font-medium">{selectedSessionForCancellation.title}</span>
                </p>
                <p className="text-gray-400 text-xs">
                  with {typeof selectedSessionForCancellation.speaker === 'object'
                    ? `${selectedSessionForCancellation.speaker.firstname} ${selectedSessionForCancellation.speaker.lastname}`
                    : selectedSessionForCancellation.speaker}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatDate(selectedSessionForCancellation.date)} at {selectedSessionForCancellation.time}
                </p>
              </div>

              {/* Cancellation Reason */}
              <div>
                <Label htmlFor="cancellationReason" className="text-white">
                  Reason for Cancellation (Optional)
                </Label>
                <Textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please let us know why you're cancelling..."
                  className="bg-white/10 border-white/20 text-white mt-2"
                  rows={3}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded p-2">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => {
                    setCancelModalOpen(false)
                    setSelectedSessionForCancellation(null)
                    setCancellationReason("")
                    setError("")
                  }}
                  variant="outline"
                  disabled={isCancelling}
                  className="border-white/20 cursor-pointer text-white hover:bg-white/10"
                >
                  Keep Session
                </Button>
                <Button
                  onClick={handleConfirmCancellation}
                  disabled={isCancelling}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Confirm Cancellation
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

