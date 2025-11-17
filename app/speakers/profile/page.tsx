"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  AlertTriangle,
  MapPin,
  ChevronDown
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
  const [unreviews, setUnReviews] = useState<ReviewWithType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [bio, setBio] = useState("")
  const [age, setAge] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [timezone, setTimezone] = useState<string>("UTC")
  const [cost, setCost] = useState<string>("")
  const [interests, setInterests] = useState<string[]>([])
  const [availability, setAvailability] = useState<SpeakerAvailability[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false) // Default closed
  const [isUpcomingSessionsOpen, setIsUpcomingSessionsOpen] = useState(false) // Default closed
  const [isPastSessionsOpen, setIsPastSessionsOpen] = useState(true) // Default open
  const [isCalendarOpen, setIsCalendarOpen] = useState(false) // Default closed
  const [isReviewsReceivedOpen, setIsReviewsReceivedOpen] = useState(false) // Default closed
  const [isReviewsGivenOpen, setIsReviewsGivenOpen] = useState(false) // Default closed
  const editProfileSnapshotRef = useRef<{
    bio: string
    age: string
    cost: string
    location: string
    timezone: string
    interests: string[]
    avatar: string | null
  } | null>(null)
  
  // Common timezones list (same as BookSessionDialog)
  const TIMEZONES = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Phoenix", label: "Arizona Time (MST)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Europe/Rome", label: "Rome (CET/CEST)" },
    { value: "Europe/Madrid", label: "Madrid (CET/CEST)" },
    { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
    { value: "Europe/Athens", label: "Athens (EET/EEST)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "Mumbai/New Delhi (IST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Seoul", label: "Seoul (KST)" },
    { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
    { value: "Australia/Melbourne", label: "Melbourne (AEDT/AEST)" },
    { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)" },
    { value: "America/Toronto", label: "Toronto (ET)" },
    { value: "America/Vancouver", label: "Vancouver (PT)" },
    { value: "America/Mexico_City", label: "Mexico City (CST)" },
    { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
    { value: "America/Buenos_Aires", label: "Buenos Aires (ART)" },
  ]
  
  // Get user's browser timezone or default to UTC
  const getUserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return "UTC"
    }
  }
  
  // Available topic options - loaded from backend
  const [availableTopics, setAvailableTopics] = useState<string[]>([])

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
    // console.log('=== Dashboard First Render ===')
    // console.log('User:', user)
    // console.log('isAuthenticated:', isAuthenticated)
    // console.log('authLoading:', authLoading)
    // console.log('Has user?', !!user)
    // console.log('==========================')
    
    // If authenticated but no user data, fetch it
    if (isAuthenticated && !user) {
      // console.log('Authenticated but no user - fetching current user...')
      dispatch(getCurrentUser())
    }

    // Check for OAuth callback params
    const params = new URLSearchParams(window.location.search)
    const calendarStatus = params.get('calendar')
    if (calendarStatus === 'connected') {
      // Calendar connected successfully
      // console.log('Calendar connected successfully')
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
      // console.error('Error checking calendar status:', error)
    }
  }

  // Load topics from backend on mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await speakerService.getTopics()
        if (response.success && response.data.topics) {
          setAvailableTopics(response.data.topics)
        }
      } catch (error) {
        // console.error('Error loading topics:', error)
        // Keep default topics if backend fails
      }
    }
    loadTopics()
  }, [])

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
    // console.log('Dashboard fetch effect - user:', !!user, 'isAuthenticated:', isAuthenticated, 'authLoading:', authLoading)
    
    // Don't do anything while auth is loading
    if (authLoading) {
      // console.log('Auth still loading, waiting...')
      return
    }
    
    // If user exists, fetch dashboard data
    if (user) {
      // console.log('User exists, fetching dashboard data...')
      fetchDashboardData()
      // Check calendar connection status
      checkCalendarStatus()
    } 
    // If not authenticated at all, show error
    else if (!isAuthenticated) {
      // console.log('Not authenticated, showing error')
      setIsLoading(false)
      setError(t('dashboard.errors.loginRequired'))
    }
    // If authenticated but no user yet, wait for getCurrentUser to complete
    else if (isAuthenticated && !user) {
      // console.log('Authenticated but no user, waiting for getCurrentUser...')
      // Keep loading state - getCurrentUser will be called by the first useEffect
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, authLoading])

  const fetchDashboardData = async () => {
    if (!user) {
      // console.log('No user available, skipping dashboard fetch')
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
        
        // Use the type field from backend (already set correctly)
        // Backend sets: type: 'received' for reviews where to: userId, type: 'given' for reviews where from: userId
        const processedReviews: ReviewWithType[] = (reviews || []).map((review: any) => {
          // Trust the backend type field, but add fallback logic if missing
          let reviewType: 'received' | 'given' = review.type;
          if (!reviewType) {
            // Fallback: determine type based on user ID comparison
            const toId = typeof review.to === 'object' ? review.to._id : review.to;
            const fromId = typeof review.from === 'object' ? review.from._id : review.from;
            reviewType = toId === user?._id ? 'received' : fromId === user?._id ? 'given' : 'received';
          }
          return {
            ...review,
            type: reviewType
          };
        })
        setReviews(processedReviews)
        
        // Update profile data
        if (profile) {
          const fallbackLocation =
            user && typeof user === "object" && "location" in user
              ? ((user as { location?: string }).location ?? "")
              : ""
          setBio(profile.bio || "")
          setAge(profile.age ? profile.age.toString() : "")
          setLocation(profile.location || fallbackLocation)
          setTimezone((user as any)?.timezone || getUserTimezone())
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
          const fallbackLocation =
            user && typeof user === "object" && "location" in user
              ? ((user as { location?: string }).location ?? "")
              : ""
          setLocation(fallbackLocation)
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
        location: location ? location.trim() : "",
        timezone: timezone || getUserTimezone(),
        availability 
      })
      await speakerService.updateAvailability(availability)
      editProfileSnapshotRef.current = null
      setIsEditingProfile(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(t('dashboard.errors.saveFailed'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleStartEditProfile = () => {
    editProfileSnapshotRef.current = {
      bio,
      age,
      cost,
      location,
      timezone,
      interests: [...interests],
      avatar: avatarPreview
    }
    setIsEditingProfile(true)
  }

  const handleCancelEditProfile = () => {
    const snapshot = editProfileSnapshotRef.current
    if (snapshot) {
      setBio(snapshot.bio)
      setAge(snapshot.age)
      setCost(snapshot.cost)
      setLocation(snapshot.location)
      setTimezone(snapshot.timezone)
      setInterests(snapshot.interests)
      setAvatarPreview(snapshot.avatar)
    }
    editProfileSnapshotRef.current = null
    setIsEditingProfile(false)
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
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    return new Date(`1970-01-01T${hours.padStart(2, "0")}:${minutes}:00`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if the speaker has given a review for this session (to a learner)
  const hasBeenReviewed = (sessionId: string) => {
    return givenReviews.some(review => {
      const reviewSessionId = typeof review.session === 'string' 
        ? review.session 
        : (review.session as any)?._id || (review.session as any)?.id
      return reviewSessionId === sessionId || reviewSessionId?.toString() === sessionId?.toString()
    })
  }

  // Check if the speaker has received a review for this session (from a learner)
  // This checks if any learner has given a review TO the speaker for this session
  const hasReceivedReviews = (sessionId: string) => {
    if (!user?._id) return false
    return receivedReviews.some(review => {
      // Check if this review is for the given session
      const reviewSessionId = typeof review.session === 'string' 
        ? review.session 
        : (review.session as any)?._id || (review.session as any)?.id
      return reviewSessionId === sessionId || reviewSessionId?.toString() === sessionId?.toString()
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

  const totalSessions = upcomingSessions.length + pastSessions.length
  const totalCompletedMinutes = pastSessions.reduce((acc, session) => {
    if (session.status !== "completed") {
      return acc
    }
    return acc + (session.duration || 0)
  }, 0)
  const hoursPracticed = totalCompletedMinutes / 60
  const formattedHoursPracticed = Number.isFinite(hoursPracticed) ? hoursPracticed.toFixed(1) : "0.0"

  const averageRating = receivedReviews.length
    ? receivedReviews.reduce((acc, review) => acc + review.rating, 0) / receivedReviews.length
    : 0
  const formattedAverageRating = Number.isFinite(averageRating) ? averageRating.toFixed(1) : "0.0"

  const profileHighlights = [
    {
      label: "Average Rating",
      value: formattedAverageRating,
      helper: `${receivedReviews.length || 0} review${receivedReviews.length === 1 ? "" : "s"}`,
      icon: Star
    },
    {
      label: "Sessions Hosted",
      value: `${totalSessions}`,
      helper: upcomingSessions.length
        ? `${upcomingSessions.length} upcoming`
        : "No upcoming sessions",
      icon: Calendar
    },
    {
      label: "Hours Facilitated",
      value: formattedHoursPracticed,
      helper: "",
      icon: Clock
    }
  ]

  const userFullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ")
  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Speaker"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 pb-8 pt-4 sm:gap-6 sm:px-4 sm:pb-12 sm:pt-6 lg:gap-8 lg:px-8 lg:pb-16 lg:pt-8">
        <header className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">Speaker Profile</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">{t('dashboard.subtitle')}</p>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden border border-border shadow-lg">
          <CardHeader className="relative space-y-3 border-b border-border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3 sm:space-y-4 sm:p-4 md:space-y-6 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                <div className="relative">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-background/80 bg-muted shadow-sm sm:h-20 sm:w-20 sm:border-4 md:h-24 md:w-24">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt={userFullName || "Avatar"}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/60">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  {isEditingProfile && (
                    <label className="absolute -bottom-2 right-0 inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <Camera className="h-3.5 w-3.5" />
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
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <CardTitle className="text-lg font-semibold sm:text-xl md:text-2xl">{userFullName || user?.email}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{user?.email}</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs">
                      {roleLabel}
                    </Badge>
                    {location && (
                      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>{location}</span>
                      </div>
                    )}
                    {age && (
                      <div className="rounded-lg border border-border bg-primary/10 p-0.5 text-center shadow-sm sm:rounded-xl sm:p-1">
                        <p className="text-foreground text-[10px] font-semibold sm:text-xs">{age} age</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleCancelEditProfile}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="cursor-pointer"
                      onClick={handleSaveProfile}
                      disabled={isUploading}
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
                  </>
                ) : (
                  <Button variant="outline" className="cursor-pointer" onClick={handleStartEditProfile}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="grid gap-2 sm:gap-3 grid-cols-3">
              {profileHighlights.map(({ label, value, helper, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-2 shadow-sm transition-all hover:border-primary/60 hover:shadow-md sm:gap-3 sm:rounded-xl sm:p-3 md:p-4"
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold sm:mt-1 sm:text-base md:text-lg">{value}</p>
                    {helper && <p className="text-[10px] text-muted-foreground sm:text-xs">{helper}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:gap-8 md:p-6">
            {isEditingProfile ? (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('dashboard.profile.bio')}
                    </Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      placeholder={t('dashboard.profile.bioPlaceholder')}
                      className="mt-3 min-h-[40px] sm:min-h-[140px] resize-none text-xs sm:text-base text-foreground"
                    />
                    {/* <p className="mt-2 text-xs text-muted-foreground">
                      Share what makes your sessions unique and the outcomes learners can expect.
                    </p> */}
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                      Topics & Interests
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                      {availableTopics.map((topic) => {
                        const selected = interests.includes(topic)
                        const disabled = !selected && interests.length >= 4
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleInterestToggle(topic)}
                            disabled={disabled}
                            className={`rounded-full border px-1 py-1 text-xs font-medium transition-colors ${
                              selected
                                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                            } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                          >
                            {topic}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Selected {interests.length}/4</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min={18}
                      max={120}
                      placeholder="Enter your age"
                      className="mt-3"
                    />
                    {/* <p className="mt-2 text-xs text-muted-foreground">
                      Optional. Helps learners understand who they will be working with.
                    </p> */}
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">Location</Label>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where are you based?"
                      className="mt-3 text-foreground"
                    />
                    {/* <p className="mt-2 text-xs text-muted-foreground">
                      Share your city to help learners understand your location.
                    </p> */}
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="mt-3">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <p className="mt-2 text-xs text-muted-foreground">
                      Your timezone is used to convert your availability times. This ensures learners see your schedule correctly.
                    </p> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3 shadow-sm sm:rounded-xl sm:p-4 md:p-5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('dashboard.profile.bio')}
                  </Label>
                  <p className="mt-3 rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                    {bio || t('dashboard.profile.noBio')}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/30 p-2 sm:p-5 shadow-sm">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Topics & Interests
                    </Label>
                    {interests.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {interests.map((interest, index) => (
                          <div
                            key={`${interest}-${index}`}
                            className="inline-flex items-center rounded-full border border-border bg-background px-1 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {interest}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">No interests added yet.</p>
                    )}
                  </div>
                </div>
                {location ? (
                    <div className="rounded-xl border border-border bg-muted/30 p-2 sm:p-5 shadow-sm">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location
                      </Label>
                      <p className="mt-3 text-sm font-medium text-foreground p-1 rounded-lg">{location}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-5 text-sm text-muted-foreground">
                      Let learners know where you’re based by adding a location to your profile.
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
          <Card className="shadow-sm">
            <Collapsible open={isCalendarOpen} onOpenChange={setIsCalendarOpen} defaultOpen={false}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      <CardTitle className="text-sm font-semibold sm:text-base md:text-lg">{t('dashboard.calendar.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">{t('dashboard.calendar.description')}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCalendarConnected && <CheckCircle2 className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />}
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <CardContent className="space-y-2 p-3 sm:space-y-3 sm:p-4 md:space-y-4 md:p-6">
                  {isCalendarConnected ? (
                    <>
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('dashboard.calendar.connected')}
                      </div>
                      {calendarExpiresAt && (
                        <p className="text-xs text-muted-foreground">
                          {t('dashboard.calendar.expires')} {new Date(calendarExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Timezone</span>
                          <span className="text-sm font-semibold text-foreground">
                            {TIMEZONES.find(tz => tz.value === timezone)?.label || timezone || 'UTC'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Sessions are scheduled in your timezone
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={handleDisconnectCalendar}
                        disabled={isConnectingCalendar}
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
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-200">
                        <p className="font-medium">{t('dashboard.calendar.notConnected')}</p>
                        <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-200/80">
                          {t('dashboard.calendar.notConnectedDesc')}
                        </p>
                      </div>
                      <Button
                        className="w-full cursor-pointer"
                        onClick={handleConnectCalendar}
                        disabled={isConnectingCalendar}
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
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="shadow-sm lg:col-span-2">
            <Collapsible open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen} defaultOpen={false}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t('dashboard.availability.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{t('dashboard.availability.description')}</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAvailabilityOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <CardContent className="space-y-2 p-3 sm:space-y-3 sm:p-4 md:p-6">
                  <div className="grid gap-2 sm:gap-3 sm:grid-cols-1">
                {availability.map((day, index) => {
                  const dayData = daysOfWeek.find((d) => d.key === day.day)
                  const dayLabel = dayData ? t(dayData.translationKey as any) : day.day
                  return (
                    <div key={day.day} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-2 sm:gap-3 sm:p-3">
                      <div className="flex items-center justify-between text-xs font-medium sm:text-sm">
                        <span>{dayLabel}</span>
                        <Switch
                          checked={day.isAvailable || false}
                          onCheckedChange={() => handleAvailabilityToggle(index)}
                        />
                      </div>
                      {day.isAvailable && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Input
                            type="time"
                            value={day.startTime || "09:00"}
                            onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                            className="h-8 text-xs sm:h-9 sm:text-sm"
                          />
                          <span className="text-[10px] text-muted-foreground sm:text-xs">{t('dashboard.availability.to')}</span>
                          <Input
                            type="time"
                            value={day.endTime || "17:00"}
                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                            className="h-8 text-xs sm:h-9 sm:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
                  </div>
                  <Button
                    className="ml-auto w-full cursor-pointer sm:w-auto"
                    onClick={handleSaveAvailability}
                    disabled={isSavingAvailability}
                  >
                    {isSavingAvailability ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('dashboard.availability.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('dashboard.availability.save')}
                      </>
                    )}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-1">
          <Card className="shadow-sm">
            <Collapsible open={isUpcomingSessionsOpen} onOpenChange={setIsUpcomingSessionsOpen} defaultOpen={true}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t('dashboard.sessions.upcoming.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {upcomingSessions.length} {t('dashboard.sessions.upcoming.count')}
                    </CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUpcomingSessionsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                  {upcomingSessions.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2 sm:space-y-3 md:hidden">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session._id}
                            className="rounded-lg border border-border bg-muted/40 p-2 transition-colors hover:bg-muted sm:p-3"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                              <div className="space-y-1.5 sm:space-y-2 w-full">
                                <div className="flex items-center justify-between w-full">
                                  <h3 className="text-sm font-semibold sm:text-base">{session.title}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs uppercase">
                                      {session.status}
                                    </Badge>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-9 w-9 cursor-pointer"
                                      onClick={() => handleCancelSession(session)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                  {t('dashboard.sessions.with')}{" "}
                                  <span className="font-medium text-foreground">
                                    {typeof session.learner === 'object'
                                      ? `${session.learner.firstname} ${session.learner.lastname}`
                                      : session.learner}
                                  </span>
                                </p>
                                {(session as any).topics?.length > 0 && (
                                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                                    {t('dashboard.sessions.topics')} {(session as any).topics.join(', ')}
                                  </p>
                                )}
                                {(session as any).icebreaker && (
                                  <div className="rounded-md border border-amber-400/40 bg-amber-400/10 p-2 text-[10px] text-amber-600 dark:text-amber-200 sm:p-3 sm:text-xs">
                                    <p className="font-semibold uppercase tracking-wide">{t('dashboard.sessions.icebreaker')}</p>
                                    <p className="mt-0.5 leading-relaxed sm:mt-1">{(session as any).icebreaker}</p>
                                  </div>
                                )}
                                {(session as any).meetingLink && (
                                  <a
                                    href={(session as any).meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-primary hover:underline"
                                  >
                                    Join Meeting →
                                  </a>
                                )}
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
                                  <span className="inline-flex items-center gap-1 sm:gap-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {formatDate(session.date)}
                                  </span>
                                  <span className="inline-flex items-center gap-1 sm:gap-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {session.time} ({session.duration} min)
                                  </span>
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
                              <TableHead className="text-xs sm:text-sm">Learner</TableHead>
                              <TableHead className="text-xs sm:text-sm">Date</TableHead>
                              <TableHead className="text-xs sm:text-sm">Time</TableHead>
                              <TableHead className="text-xs sm:text-sm">Duration</TableHead>
                              <TableHead className="text-xs sm:text-sm">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingSessions.map((session) => (
                              <TableRow key={session._id}>
                                <TableCell className="font-medium text-xs sm:text-sm">{session.title}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {typeof session.learner === 'object'
                                    ? `${session.learner.firstname} ${session.learner.lastname}`
                                    : session.learner}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatDate(session.date)}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatTime(session.time)}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{session.duration} min</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-[10px] uppercase sm:text-xs">
                                    {session.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {(session as any).meetingLink && (
                                      <a
                                        href={(session as any).meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-primary hover:underline sm:text-sm"
                                      >
                                        Join
                                      </a>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="h-7 cursor-pointer px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                                      onClick={() => handleCancelSession(session)}
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                      {t('dashboard.sessions.upcoming.none')}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="shadow-sm">
            <Collapsible open={isPastSessionsOpen} onOpenChange={setIsPastSessionsOpen} defaultOpen={true}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t('dashboard.sessions.past.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {pastSessions.length} {t('dashboard.sessions.past.count')}
                    </CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPastSessionsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                  {pastSessions.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2 sm:space-y-3 md:hidden">
                        {pastSessions.map((session) => (
                          <div
                            key={session._id}
                            className="rounded-lg border border-border bg-muted/40 p-2 transition-colors hover:bg-muted sm:p-3"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3 w-full">
                              <div className="space-y-1.5 sm:space-y-2">
                                <h3 className="text-sm font-semibold sm:text-base">{session.title}</h3>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                  {t('dashboard.sessions.with')}{" "}
                                  <span className="font-medium text-foreground">
                                    {typeof session.learner === 'object'
                                      ? `${session.learner.firstname} ${session.learner.lastname}`
                                      : session.learner}
                                  </span>
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
                                  <span className="inline-flex items-center gap-1 sm:gap-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {formatDate(session.date)}
                                  </span>
                                  <span className="inline-flex items-center gap-1 sm:gap-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {session.time}
                                  </span>
                                </div>
                                {(session as any).cancellationReason && (
                                  <p className="text-xs text-destructive">
                                    {t('dashboard.sessions.reason')} {(session as any).cancellationReason}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs uppercase ${
                                    session.status === 'cancelled'
                                      ? 'border-destructive text-destructive'
                                      : 'border-emerald-500 text-emerald-600 dark:text-emerald-300'
                                  }`}
                                >
                                  {session.status}
                                </Badge>
                                {session.status === 'completed' && !hasReceivedReviews(session._id) && (
                                  <Button size="sm" className="cursor-pointer" onClick={() => handleRateSession(session)}>
                                    <Star className="mr-2 h-4 w-4" />
                                    {t('dashboard.sessions.rate')}
                                  </Button>
                                )}
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
                              <TableHead className="text-xs sm:text-sm">Learner</TableHead>
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
                                  {typeof session.learner === 'object'
                                    ? `${session.learner.firstname} ${session.learner.lastname}`
                                    : session.learner}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatDate(session.date)}</TableCell>
                                <TableCell className="text-xs sm:text-sm">{formatTime(session.time)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] uppercase sm:text-xs ${
                                      session.status === 'cancelled'
                                        ? 'border-destructive text-destructive'
                                        : 'border-emerald-500 text-emerald-600 dark:text-emerald-300'
                                    }`}
                                  >
                                    {session.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {session.status === 'completed' && !hasReceivedReviews(session._id) ? (
                                    <Button size="sm" className="cursor-pointer" onClick={() => handleRateSession(session)}>
                                      <Star className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                      {t('dashboard.sessions.rate')}
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
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center text-sm text-muted-foreground">
                      {t('dashboard.sessions.past.none')}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-1">
          <Card className="shadow-sm">
            <Collapsible open={isReviewsReceivedOpen} onOpenChange={setIsReviewsReceivedOpen} defaultOpen={false}>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t('dashboard.reviews.received.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {receivedReviews.length} {t('dashboard.reviews.received.count')}
                    </CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isReviewsReceivedOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {receivedReviews.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2 sm:space-y-3 md:hidden">
                        {receivedReviews.map((review) => (
                          <div key={review._id} className="rounded-lg border border-border bg-muted/40 p-2 sm:p-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-foreground sm:mt-3 sm:text-sm">{review.comment}</p>
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground sm:mt-2 sm:text-xs">
                              {typeof review.from === 'object' && (review.from as any).avatar ? (
                                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-muted sm:h-6 sm:w-6">
                                  <Image
                                    src={(review.from as any).avatar}
                                    alt={`${review.from.firstname} ${review.from.lastname}`}
                                    fill
                                    className="object-cover"
                                    sizes="24px"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted sm:h-6 sm:w-6">
                                  <User className="h-3 w-3 text-muted-foreground sm:h-3.5 sm:w-3.5" />
                                </div>
                              )}
                              <span>
                                {t('dashboard.reviews.received.from')}{" "}
                                {typeof review.from === 'object'
                                  ? `${review.from.firstname} ${review.from.lastname}`
                                  : review.from} • {new Date(review.createdAt).toLocaleDateString()}
                              </span>
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
                              <TableHead className="text-xs sm:text-sm">From</TableHead>
                              <TableHead className="text-xs sm:text-sm">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {receivedReviews.map((review) => (
                              <TableRow key={review._id}>
                                <TableCell>
                                  <div className="flex items-center gap-0.5 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                                          i < review.rating ? 'fill-amber-400' : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm max-w-md">
                                  <p className="line-clamp-2">{review.comment}</p>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <div className="flex items-center gap-2">
                                    {typeof review.from === 'object' && (review.from as any).avatar ? (
                                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted sm:h-7 sm:w-7">
                                        <Image
                                          src={(review.from as any).avatar}
                                          alt={`${review.from.firstname} ${review.from.lastname}`}
                                          fill
                                          className="object-cover"
                                          sizes="28px"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted sm:h-7 sm:w-7">
                                        <User className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                                      </div>
                                    )}
                                    <span>
                                      {typeof review.from === 'object'
                                        ? `${review.from.firstname} ${review.from.lastname}`
                                        : review.from}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-8 text-center text-xs text-muted-foreground sm:py-12 sm:text-sm">
                      {t('dashboard.reviews.received.none')}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Collapsible open={isReviewsGivenOpen} onOpenChange={setIsReviewsGivenOpen} defaultOpen={false}>
            <Card className="shadow-sm">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2 sm:text-base md:text-lg">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t('dashboard.reviews.given.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {givenReviews.length} {t('dashboard.reviews.given.count')}
                    </CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isReviewsGivenOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="data-[state=closed]:hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {givenReviews.length > 0 ? (
                    <>
                      {/* Mobile/Tablet View - Cards */}
                      <div className="space-y-2 sm:space-y-3 md:hidden">
                        {givenReviews.map((review) => (
                          <div key={review._id} className="rounded-lg border border-border bg-muted/40 p-2 sm:p-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-foreground sm:mt-3 sm:text-sm">{review.comment}</p>
                            <p className="mt-1.5 text-[10px] text-muted-foreground sm:mt-2 sm:text-xs">
                              {t('dashboard.reviews.given.for')}{" "}
                              {typeof review.to === 'object'
                                ? `${review.to.firstname} ${review.to.lastname}`
                                : review.to} • {new Date(review.createdAt).toLocaleDateString()}
                            </p>
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
                              <TableHead className="text-xs sm:text-sm">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {givenReviews.map((review) => (
                              <TableRow key={review._id}>
                                <TableCell>
                                  <div className="flex items-center gap-0.5 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                                          i < review.rating ? 'fill-amber-400' : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm max-w-md">
                                  <p className="line-clamp-2">{review.comment}</p>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {typeof review.to === 'object'
                                    ? `${review.to.firstname} ${review.to.lastname}`
                                    : review.to}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 py-8 text-center text-xs text-muted-foreground sm:py-12 sm:text-sm">
                      {t('dashboard.reviews.received.none')}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
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
        <DialogContent className="bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t('dashboard.cancel.title')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedSessionForCancellation && (
                <>
                  {t('dashboard.cancel.confirm')}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                      <p className="mb-1 font-semibold">
                        {selectedSessionForCancellation.title}
                      </p>
                      <p className="mb-2 text-muted-foreground">
                        {t('dashboard.sessions.with')}{" "}
                        <span className="font-medium">
                          {typeof selectedSessionForCancellation.learner === 'object'
                            ? `${selectedSessionForCancellation.learner.firstname} ${selectedSessionForCancellation.learner.lastname}`
                            : selectedSessionForCancellation.learner}
                        </span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {formatDate(selectedSessionForCancellation.date)} at{" "}
                          {selectedSessionForCancellation.time}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <p className="mb-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                        {t('dashboard.cancel.policy')}
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-xs text-yellow-700/80 dark:text-yellow-300/80">
                        <li>{t('dashboard.cancel.policy24h')}</li>
                        <li>{t('dashboard.cancel.policyNotify')}</li>
                        <li>{t('dashboard.cancel.policyAvailable')}</li>
                        {getHoursUntilSession(selectedSessionForCancellation) < 24 && (
                          <li className="font-semibold text-destructive">
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
              <Label htmlFor="cancellation-reason" className="mb-2 block">
                {t('dashboard.cancel.reasonLabel')} <span className="text-xs text-muted-foreground">{t('dashboard.cancel.reasonOptional')}</span>
              </Label>
              <textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder={t('dashboard.cancel.reasonPlaceholder')}
                rows={4}
                className="w-full rounded-md border text-base text-foreground border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
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
              className="cursor-pointer"
            >
              {t('dashboard.cancel.keep')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancellation}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

