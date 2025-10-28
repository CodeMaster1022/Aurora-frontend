"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  User
} from "lucide-react"
import { speakerService, Session, Review, SpeakerAvailability } from "@/lib/services/speakerService"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { getCurrentUser } from "@/lib/store/authSlice"
import Image from "next/image"

interface ReviewWithType extends Review {
  type: 'received' | 'given'
}

export default function SpeakerDashboardPage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<ReviewWithType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [bio, setBio] = useState("")
  const [availability, setAvailability] = useState<SpeakerAvailability[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Days of the week
  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ]

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
      setError("Please log in to access your dashboard")
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
        const { upcomingSessions, reviews, profile } = response.data
        
        // Update sessions
        setUpcomingSessions(upcomingSessions || [])
        
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
          setAvailability(profile.availability || [])
        }
      }
      // Set avatar if user has one
      if (user?.avatar) {
        setAvatarPreview(user.avatar)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true)
      await speakerService.updateProfile({ bio, availability })
      await speakerService.updateAvailability(availability)
      setIsEditingProfile(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError("Failed to save profile")
    } finally {
      setIsUploading(false)
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
        setError("Failed to upload avatar")
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
          <h1 className="text-4xl font-bold text-white mb-2">Speaker Dashboard</h1>
          <p className="text-gray-300">Manage your sessions, reviews, and profile</p>
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
                    <CardTitle className="text-white mb-2">Profile</CardTitle>
                    <CardDescription className="text-gray-300">Manage your profile information</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-white hover:bg-white/20"
                  >
                    {isEditingProfile ? <X /> : <Edit />}
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
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                      {user?.firstname} {user?.lastname}
                    </h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Bio */}
                {isEditingProfile ? (
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
                ) : (
                  <p className="text-sm text-gray-300">{bio || "No bio available"}</p>
                )}

                {isEditingProfile && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500"
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
                )}
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg Orabolo-card-border rounded-lg p-4 border-2 border-[#A5B4FC]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="text-[#7C3AED] w-5 h-5" />
                    <CardTitle className="text-white">Availability</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {availability.filter(a => a.isAvailable).length} days active
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">Set your available days and hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availability.map((day, index) => {
                  const dayLabel = daysOfWeek.find(d => d.key === day.day)?.label
                  return (
                    <div key={day.day} className="space-y-2 p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{dayLabel}</span>
                        <Switch
                          checked={day.isAvailable}
                          onCheckedChange={() => handleAvailabilityToggle(index)}
                        />
                      </div>
                      {day.isAvailable && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                          <span className="text-gray-400">to</span>
                          <Input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sessions & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {upcomingSessions.length} sessions scheduled
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
                              with <span className="font-medium">
                                {typeof session.learner === 'object' 
                                  ? `${session.learner.firstname} ${session.learner.lastname}`
                                  : session.learner}
                              </span>
                            </p>
                            {(session as any).topics && (session as any).topics.length > 0 && (
                              <p className="text-xs text-gray-400 mb-2">Topics: {(session as any).topics.join(', ')}</p>
                            )}
                            {(session as any).icebreaker && (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-2 mt-2">
                                <p className="text-xs font-semibold text-yellow-400 mb-1">💡 Icebreaker</p>
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
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No upcoming sessions</p>
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
                    Reviews Received
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {receivedReviews.length} reviews
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
                            from {typeof review.from === 'object' 
                              ? `${review.from.firstname} ${review.from.lastname}`
                              : review.from} • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8">No reviews yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Given */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Reviews Given
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {givenReviews.length} reviews
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
                            for {typeof review.to === 'object' 
                              ? `${review.to.firstname} ${review.to.lastname}`
                              : review.to} • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8">No reviews yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

