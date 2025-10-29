"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Calendar, 
  Clock, 
  Star, 
  Edit, 
  Save, 
  X, 
  Upload, 
  MessageSquare,
  Settings,
  Loader2,
  Camera,
  User,
  Link as LinkIcon,
  Unlink,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { speakerService, Session, Review, SpeakerAvailability } from "@/lib/services/speakerService"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import { SpeakerRatingModal } from "@/components/SpeakerRatingModal"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"

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
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [bio, setBio] = useState("")
  const [age, setAge] = useState<string>("")
  const [cost, setCost] = useState<string>("")
  const [interests, setInterests] = useState<string[]>([])
  const [availability, setAvailability] = useState<SpeakerAvailability[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)
  
  // Available topic options
  const availableTopics = [
    "Technology", "Business", "Science", "Art", "Music", 
    "Sports", "Travel", "Food", "Health", "Education",
    "Fashion", "Literature", "History", "Languages", "Gaming"
  ]

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
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false)
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
    console.log('=== Dashboard First Render ===')
    console.log('User:', user)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('authLoading:', authLoading)
    console.log('Has user?', !!user)
    console.log('==========================')
    
    // If authenticated but no user data, fetch it
    if (isAuthenticated && !user) {
      console.log('Authenticated but no user - fetching current user...')
      dispatch(getCurrentUser())
    }

    // Check for OAuth callback params
    const params = new URLSearchParams(window.location.search)
    const calendarStatus = params.get('calendar')
    if (calendarStatus === 'connected') {
      // Calendar connected successfully
      console.log('Calendar connected successfully')
      setError('') // Clear any errors
      // Refresh calendar status
      checkCalendarStatus()
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (calendarStatus === 'error') {
        setError(t('dashboard.errors.calendarConnectFailed'))
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
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
        
        // Update profile data
        if (profile) {
          setBio(profile.bio || "")
          setAge(profile.age ? profile.age.toString() : "")
          setCost(profile.cost ? profile.cost.toString() : "")
          setInterests(user?.interests || [])
          // Normalize availability to ensure all 7 days are present
          const profileAvailability = profile.availability || []
          console.log('Loaded availability from backend:', profileAvailability)
          const normalizedAvailability = normalizeAvailability(profileAvailability)
          console.log('Normalized availability:', normalizedAvailability)
          setAvailability(normalizedAvailability)
        } else {
          // If no profile data, initialize with default availability
          console.log('No profile data, initializing with defaults')
          setAvailability(getDefaultAvailability())
          setInterests(user?.interests || [])
        }
      }
      // Set avatar if user has one
      if (user?.avatar) {
        setAvatarPreview(user.avatar)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(t('dashboard.errors.loadFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true)
      
      // Update user interests in backend
      await speakerService.updateInterests(interests)
      
      await speakerService.updateProfile({ 
        bio, 
        age: age ? Number(age) : undefined,
        cost: cost ? Number(cost) : undefined,
        availability 
      })
      await speakerService.updateAvailability(availability)
      setIsEditingProfile(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(t('dashboard.errors.saveFailed'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => {
      if (prev.includes(interest)) {
        // Remove interest
        return prev.filter(i => i !== interest)
      } else if (prev.length < 4) {
        // Add interest (max 4)
        return [...prev, interest]
      }
      return prev
    })
  }

  const handleSaveAvailability = async () => {
    try {
      setIsSavingAvailability(true)
      await speakerService.updateAvailability(availability)
      setError("") // Clear any errors on success
    } catch (err) {
      console.error("Error saving availability:", err)
      setError(t('dashboard.errors.availabilityFailed'))
    } finally {
      setIsSavingAvailability(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        const avatarUrl = await speakerService.uploadAvatar(file)
        setAvatarPreview(avatarUrl)
        // Update user in Redux store if needed
      } catch (err) {
        console.error("Error uploading avatar:", err)
        setError(t('dashboard.errors.avatarFailed'))
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleAvailabilityToggle = (index: number) => {
    const updated = [...availability]
    updated[index].isAvailable = !updated[index].isAvailable
    setAvailability(updated)
  }

  const handleTimeChange = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...availability]
    updated[index][field] = value
    setAvailability(updated)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Check if a session has been reviewed by this speaker
  const hasBeenReviewed = (sessionId: string) => {
    return givenReviews.some(review => review.session === sessionId)
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
    const sessionDate = new Date(session.date)
    const sessionTime = session.time.split(':')
    sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]), 0, 0)
    
    const now = new Date()
    const hoursUntil = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntil
  }

  const handleConnectCalendar = async () => {
    try {
      setIsConnectingCalendar(true)
      setError('')
      
      // Get the OAuth URL from the backend
      const response = await speakerService.getCalendarAuthUrl()
      
      if (response.success && response.data.authUrl && user?._id) {
        // Add user ID as state parameter for the callback
        const authUrl = new URL(response.data.authUrl)
        authUrl.searchParams.set('state', user._id)
        
        // Redirect to Google OAuth
        window.location.href = authUrl.toString()
      } else {
        setError(t('dashboard.errors.calendarInitFailed'))
        setIsConnectingCalendar(false)
      }
    } catch (err) {
      console.error('Error connecting calendar:', err)
      setError(t('dashboard.errors.calendarConnectFailed'))
      setIsConnectingCalendar(false)
    }
  }

  const handleDisconnectCalendar = async () => {
    try {
      setIsConnectingCalendar(true)
      setError('')
      
      await speakerService.disconnectCalendar()
      
      // Update local state
      setIsCalendarConnected(false)
      setCalendarExpiresAt(null)
    } catch (err) {
      console.error('Error disconnecting calendar:', err)
      setError(t('dashboard.errors.calendarDisconnectFailed'))
    } finally {
      setIsConnectingCalendar(false)
    }
  }

  const receivedReviews = reviews.filter(r => r.type === "received")
  const givenReviews = reviews.filter(r => r.type === "given")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-24 from-[#1A1A33] via-purple-900 to-[#1A1A33] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-300">{t('dashboard.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Availability */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white mb-2">{t('dashboard.profile.title')}</CardTitle>
                    <CardDescription className="text-gray-300">{t('dashboard.profile.description')}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-white hover:bg-white/20 cursor-pointer"
                  >
                    {isEditingProfile ? <X /> : <Edit />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-full max-w-[200px] mx-auto">
                    <div className="relative z-10 w-full aspect-square flex items-end">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover rounded-2xl drop-shadow-2xl"
                        />
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center drop-shadow-2xl">
                          <User className="w-20 h-20 text-white" />
                        </div>
                      )}
                      {isEditingProfile && (
                        <label className="absolute top-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors z-20 shadow-lg">
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

                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-cyan-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {user?.firstname} {user?.lastname}
                    </h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Interests/Topics */}
                {isEditingProfile ? (
                  <div>
                    <Label className="text-white mb-2">Topics & Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleInterestToggle(topic)}
                          disabled={!interests.includes(topic) && interests.length >= 4}
                          className={`px-3 py-1.5 rounded-full transition-all text-xs font-medium ${
                            interests.includes(topic)
                              ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-2 border-purple-400"
                              : "bg-white/10 border border-white/20 text-gray-300 hover:border-purple-400/50"
                          } ${!interests.includes(topic) && interests.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                    {interests.length > 0 && (
                      <p className="mt-2 text-xs text-gray-400">
                        Selected: {interests.length}/4
                      </p>
                    )}
                  </div>
                ) : (
                  user?.interests && user.interests.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {user.interests.map((interest, index) => (
                          <div 
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 rounded-full"
                          >
                            <span className="text-purple-200 text-xs font-medium">{interest}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Bio */}
                {isEditingProfile ? (
                  <div>
                    <Label className="text-white mb-2">{t('dashboard.profile.bio')}</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder={t('dashboard.profile.bioPlaceholder')}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-300">{bio || t('dashboard.profile.noBio')}</p>
                )}

                {/* Age and Cost */}
                {isEditingProfile ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2">Age</Label>
                      <Input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min={18}
                        max={120}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2">Cost per Session (USD)</Label>
                      <Input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        min={0}
                        step="0.01"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  </div>
                ) : (
                  (age || cost) && (
                    <div className="flex flex-wrap gap-2">
                      {age && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                          <span className="text-purple-300 text-sm font-medium">Age:</span>
                          <span className="text-white text-sm font-semibold">{age}</span>
                        </div>
                      )}
                      {cost && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                          <span className="text-cyan-300 text-sm font-medium">Cost:</span>
                          <span className="text-white text-sm font-semibold">${cost}</span>
                        </div>
                      )}
                    </div>
                  )
                )}

                {isEditingProfile && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('dashboard.profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('dashboard.profile.save')}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Google Calendar Connection Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-purple-400 w-5 h-5" />
                    <CardTitle className="text-white">{t('dashboard.calendar.title')}</CardTitle>
                  </div>
                  {isCalendarConnected && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <CardDescription className="text-gray-300">
                  {t('dashboard.calendar.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isCalendarConnected ? (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-green-300">{t('dashboard.calendar.connected')}</span>
                    </div>
                    {calendarExpiresAt && (
                      <p className="text-xs text-gray-400">
                        {t('dashboard.calendar.expires')} {new Date(calendarExpiresAt).toLocaleDateString()}
                      </p>
                    )}
                    <Button
                      onClick={handleDisconnectCalendar}
                      disabled={isConnectingCalendar}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      {isConnectingCalendar ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('dashboard.calendar.disconnecting')}
                        </>
                      ) : (
                        <>
                          <Unlink className="mr-2 h-4 w-4" />
                          {t('dashboard.calendar.disconnect')}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-300 mb-2">
                        {t('dashboard.calendar.notConnected')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t('dashboard.calendar.notConnectedDesc')}
                      </p>
                    </div>
                    <Button
                      onClick={handleConnectCalendar}
                      disabled={isConnectingCalendar}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 cursor-pointer"
                    >
                      {isConnectingCalendar ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('dashboard.calendar.connecting')}
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          {t('dashboard.calendar.connect')}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="text-[#7C3AED] w-4 h-4" />
                    <CardTitle className="text-white text-base">{t('dashboard.availability.title')}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                    {availability.filter(a => a.isAvailable).length} {t('dashboard.availability.daysActive')}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300 text-xs mt-1">{t('dashboard.availability.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-0">
                {availability.map((day, index) => {
                  const dayData = daysOfWeek.find(d => d.key === day.day)
                  const dayLabel = dayData ? t(dayData.translationKey as any) : day.day
                  return (
                    <div key={day.day} className="space-y-1.5 p-2 bg-white/5 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{dayLabel}</span>
                        <Switch
                          checked={day.isAvailable || false}
                          onCheckedChange={() => handleAvailabilityToggle(index)}
                        />
                      </div>
                      {day.isAvailable && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <Input
                            type="time"
                            value={day.startTime || "09:00"}
                            onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                            className="bg-white/10 border-white/20 text-white h-8 text-xs"
                          />
                          <span className="text-gray-400 text-xs">{t('dashboard.availability.to')}</span>
                          <Input
                            type="time"
                            value={day.endTime || "17:00"}
                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                            className="bg-white/10 border-white/20 text-white h-8 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
                <Button
                  onClick={handleSaveAvailability}
                  disabled={isSavingAvailability}
                  className="w-full bg-gradient-to-r from-purple-600 cursor-pointer to-purple-500 hover:from-purple-700 hover:to-purple-600 mt-2 h-9 text-sm"
                >
                  {isSavingAvailability ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      {t('dashboard.availability.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-3 w-3" />
                      {t('dashboard.availability.save')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sessions & Reviews */}
          <div className="lg:col-span-2 space-y-3">
            {/* Upcoming Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('dashboard.sessions.upcoming.title')}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {upcomingSessions.length} {t('dashboard.sessions.upcoming.count')}
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
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                            <p className="text-sm text-gray-300 mb-2">
                              {t('dashboard.sessions.with')} <span className="font-medium">
                                {typeof session.learner === 'object' 
                                  ? `${session.learner.firstname} ${session.learner.lastname}`
                                  : session.learner}
                              </span>
                            </p>
                            {(session as any).topics && (session as any).topics.length > 0 && (
                              <p className="text-xs text-gray-400 mb-2">{t('dashboard.sessions.topics')} {(session as any).topics.join(', ')}</p>
                            )}
                            {(session as any).icebreaker && (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-2 mt-2">
                                <p className="text-xs font-semibold text-yellow-400 mb-1">{t('dashboard.sessions.icebreaker')}</p>
                                <p className="text-xs text-yellow-200">{(session as any).icebreaker}</p>
                              </div>
                            )}
                            {(session as any).meetingLink && (
                              <a 
                                href={(session as any).meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-400 hover:text-purple-300 mb-2 inline-block"
                              >
                                Join Meeting →
                              </a>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(session.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {session.time} ({session.duration} min)
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {session.status}
                            </Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelSession(session)}
                              className="bg-red-500/20 cursor-pointer hover:bg-red-500/30 text-red-300 border-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">{t('dashboard.sessions.upcoming.none')}</p>
                )}
              </CardContent>
            </Card>

            {/* Past Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('dashboard.sessions.past.title')}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {pastSessions.length} {t('dashboard.sessions.past.count')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastSessions.length > 0 ? (
                  <div className="space-y-4">
                    {pastSessions.map((session) => (
                      <div
                        key={session._id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white mb-1">{session.title}</h4>
                            <p className="text-sm text-gray-300 mb-2">
                              with <span className="font-medium">
                                {typeof session.learner === 'object' 
                                  ? `${session.learner.firstname} ${session.learner.lastname}`
                                  : session.learner}
                              </span>
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(session.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {session.time}
                              </div>
                            </div>
                            {(session as any).cancellationReason && (
                              <p className="text-xs text-red-300 mt-1 italic">
                                {t('dashboard.sessions.reason')} {(session as any).cancellationReason}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              session.status === 'cancelled'
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-green-500/20 text-green-300 border-green-500/30"
                            }>
                              {session.status}
                            </Badge>
                            {session.status === 'completed' && !hasBeenReviewed(session._id) && (
                              <Button
                                size="sm"
                                onClick={() => handleRateSession(session)}
                                className="cursor-pointer bg-gradient-to-r  from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {t('dashboard.sessions.rate')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">{t('dashboard.sessions.past.none')}</p>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reviews Received */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {t('dashboard.reviews.received.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {receivedReviews.length} {t('dashboard.reviews.received.count')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {receivedReviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {receivedReviews.map((review) => (
                        <div key={review._id} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-white mb-1">{review.comment}</p>
                          <p className="text-xs text-gray-400">
                            {t('dashboard.reviews.received.from')} {typeof review.from === 'object' 
                              ? `${review.from.firstname} ${review.from.lastname}`
                              : review.from} • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8">{t('dashboard.reviews.received.none')}</p>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Given */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {t('dashboard.reviews.given.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {givenReviews.length} {t('dashboard.reviews.given.count')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {givenReviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {givenReviews.map((review) => (
                        <div key={review._id} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-white mb-1">{review.comment}</p>
                          <p className="text-xs text-gray-400">
                            {t('dashboard.reviews.given.for')} {typeof review.to === 'object' 
                              ? `${review.to.firstname} ${review.to.lastname}`
                              : review.to} • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8">{t('dashboard.reviews.received.none')}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
              className="bg-red-500 hover:bg-red-600 text-white"
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

