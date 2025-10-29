"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Loader2, ArrowLeft, Calendar, Users, MessageSquare, CheckCircle2 } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useAppSelector } from "@/lib/hooks/redux"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SpeakerProfilePage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const [speaker, setSpeaker] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  // Booking form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    topic1: "",
    topic2: ""
  })

  useEffect(() => {
    fetchSpeakerProfile()
  }, [params.id])

  const fetchSpeakerProfile = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakerProfile(params.id)
      if (response.success) {
        setSpeaker(response.data.speaker)
        setReviews(response.data.reviews)
      }
    } catch (error) {
      console.error("Error fetching speaker profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Days of the week for display
  const daysOfWeek = [
    { key: "monday", translationKey: 'dashboard.availability.days.monday' },
    { key: "tuesday", translationKey: 'dashboard.availability.days.tuesday' },
    { key: "wednesday", translationKey: 'dashboard.availability.days.wednesday' },
    { key: "thursday", translationKey: 'dashboard.availability.days.thursday' },
    { key: "friday", translationKey: 'dashboard.availability.days.friday' },
    { key: "saturday", translationKey: 'dashboard.availability.days.saturday' },
    { key: "sunday", translationKey: 'dashboard.availability.days.sunday' }
  ]

  // Get day name from date string
  const getDayNameFromDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  // Check if a date falls on a day when speaker is available
  const isDateAvailable = (dateString: string): boolean => {
    if (!dateString || !speaker?.availability) return false
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speaker.availability.find((avail: any) => avail.day === dayName)
    return dayAvailability?.isAvailable || false
  }

  // Get min and max time for selected date based on availability
  const getTimeConstraints = (dateString: string): { min: string; max: string } => {
    if (!dateString || !speaker?.availability) {
      return { min: '00:00', max: '23:59' }
    }
    
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speaker.availability.find((avail: any) => avail.day === dayName)
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return { min: '00:00', max: '00:00' } // Invalid range to prevent selection
    }
    
    const startTime = dayAvailability.startTime || '00:00'
    const endTime = dayAvailability.endTime || '23:59'
    
    // Calculate max time accounting for 30-minute session duration
    // If end time is 17:00, max selectable time should be 16:30 (so session ends at 17:00)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const endMinutes = endHour * 60 + endMin
    const maxMinutes = endMinutes - 30 // Subtract 30 minutes for session duration
    const maxHour = Math.floor(maxMinutes / 60)
    const maxMin = maxMinutes % 60
    const maxTime = `${String(maxHour).padStart(2, '0')}:${String(maxMin).padStart(2, '0')}`
    
    return { min: startTime, max: maxTime }
  }

  // Validate time against speaker availability (client-side hint)
  const validateBookingTime = (date: string, time: string): string | null => {
    if (!date || !time || !speaker?.availability) return null
    
    const dayName = getDayNameFromDate(date)
    const dayAvailability = speaker.availability.find((avail: any) => avail.day === dayName)
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      const dayTranslation = daysOfWeek.find(d => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t('speakerProfile.bookSession.unavailableDay')} ${dayLabel}.`
    }
    
    // Check if time is within availability window
    const [requestedHour, requestedMinute] = time.split(':').map(Number)
    const requestedMinutes = requestedHour * 60 + requestedMinute
    const [startHour, startMinute] = (dayAvailability.startTime || '00:00').split(':').map(Number)
    const [endHour, endMinute] = (dayAvailability.endTime || '23:59').split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    
    // Session is 30 minutes, so check if end time is also within availability
    const sessionEndMinutes = requestedMinutes + 30
    
    if (requestedMinutes < startMinutes || sessionEndMinutes > endMinutes) {
      const dayTranslation = daysOfWeek.find(d => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t('speakerProfile.bookSession.timeNotInRange')} ${dayAvailability.startTime} ${t('dashboard.availability.to')} ${dayAvailability.endTime} ${t('dashboard.availability.to')} ${dayLabel}.`
    }
    
    return null
  }

  const handleBooking = async () => {
    if (!formData.title || !formData.date || !formData.time) {
      setBookingError(t('speakerProfile.bookSession.allFieldsRequired'))
      return
    }

    // Client-side validation for availability
    const availabilityError = validateBookingTime(formData.date, formData.time)
    if (availabilityError) {
      setBookingError(availabilityError)
      return
    }

    const topics = [formData.topic1, formData.topic2].filter(t => t.trim() !== "")
    
    if (topics.length > 2) {
      setBookingError(t('speakerProfile.bookSession.maxTopics'))
      return
    }

    try {
      setIsBooking(true)
      setBookingError("")
      
      await learnerService.bookSession({
        speakerId: params.id,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        topics: topics
      })

      setBookingSuccess(true)
      
      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        topic1: "",
        topic2: ""
      })

      // Close dialog after 2 seconds and redirect to dashboard
      setTimeout(() => {
        setIsBookingDialogOpen(false)
        router.push("/learners/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error booking session:", error)
      setBookingError(error.message || t('speakerProfile.bookSession.failed'))
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A33]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-gray-300 text-lg mb-4">{t('speakerProfile.notFound')}</p>
              <Button onClick={() => router.push('/speakers')} variant="outline" className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('speakerProfile.backToSpeakers')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/speakers')}
          variant="outline"
          className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('speakerProfile.backToSpeakers')}
        </Button>

        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={`${speaker.firstname} ${speaker.lastname}`}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-purple-500"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {speaker.firstname?.[0]}{speaker.lastname?.[0]}
                  </span>
                </div>
              )}

              {/* Name and Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  {speaker.firstname} {speaker.lastname}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xl font-semibold">
                    {speaker.rating ? speaker.rating.toFixed(1) : t('speakerProfile.new')}
                  </span>
                  <span className="text-gray-300">
                    ({speaker.reviewsCount || 0} {speaker.reviewsCount !== 1 ? t('speakerProfile.reviews') : t('speakerProfile.review')})
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">{speaker.totalSessions || 0} {t('speakerProfile.sessions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">{speaker.completedSessions || 0} {t('speakerProfile.completed')}</span>
                  </div>
                </div>

                {/* Book Session Button */}
                {/* {isAuthenticated && user && user.role === 'learner' && ( */}
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2 text-white" />
                        Book a Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1A33] border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white text-2xl">{t('speakerProfile.bookSession.title')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {bookingSuccess ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">{t('speakerProfile.bookSession.success.title')}</h3>
                            <p className="text-gray-300">
                              {t('speakerProfile.bookSession.success.message')}
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Speaker Availability Schedule */}
                            {speaker?.availability && (
                              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <Label className="text-white font-semibold mb-3 block confirmed">{t('speakerProfile.bookSession.availability')}</Label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {daysOfWeek.map((day) => {
                                    const dayAvailability = speaker.availability.find(
                                      (avail: any) => avail.day === day.key
                                    )
                                    const isAvailable = dayAvailability?.isAvailable || false
                                    return (
                                      <div
                                        key={day.key}
                                        className={`flex items-center justify-between text-sm p-2 rounded ${
                                          isAvailable
                                            ? "bg-green-500/10 border border-green-500/20"
                                            : "bg-gray-500/10 border border-gray-500/20 opacity-50"
                                        }`}
                                      >
                                        <span className={isAvailable ? "text-green-300" : "text-gray-400"}>
                                          {t(day.translationKey as any)}
                                        </span>
                                        {isAvailable ? (
                                          <span className="text-green-400 text-xs">
                                            {dayAvailability.startTime} - {dayAvailability.endTime}
                                          </span>
                                        ) : (
                                          <span className="text-gray-500 text-xs">{t('speakerProfile.bookSession.notAvailable')}</span>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            <div>
                              <Label htmlFor="title" className="text-white">{t('speakerProfile.bookSession.sessionTitle')}</Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={t('speakerProfile.bookSession.sessionTitlePlaceholder')}
                                className="bg-white/10 border-white/20 text-white mt-2"
                              />
                            </div>

                            <div>
                              <Label htmlFor="date" className="text-white">{t('speakerProfile.bookSession.date')}</Label>
                              <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => {
                                  const selectedDate = e.target.value
                                  // Validate if selected date is available
                                  if (selectedDate && !isDateAvailable(selectedDate)) {
                                    const dayTranslation = daysOfWeek.find(d => d.key === getDayNameFromDate(selectedDate))
                                    const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : getDayNameFromDate(selectedDate).charAt(0).toUpperCase() + getDayNameFromDate(selectedDate).slice(1)
                                    setBookingError(`${t('speakerProfile.bookSession.unavailableDay')} ${dayLabel}.`)
                                    setFormData({ ...formData, date: "", time: "" }) // Clear invalid date and time
                                  } else {
                                    setFormData({ ...formData, date: selectedDate, time: "" }) // Reset time when date changes
                                    setBookingError("") // Clear error when date changes
                                  }
                                }}
                                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                className="bg-white/10 border-white/20 text-white mt-2"
                              />
                              {formData.date && speaker?.availability && (() => {
                                const dayName = getDayNameFromDate(formData.date)
                                const dayAvailability = speaker.availability.find((avail: any) => avail.day === dayName)
                                if (dayAvailability && dayAvailability.isAvailable) {
                                  return (
                                    <p className="text-xs text-green-400 mt-1">
                                      {t('speakerProfile.bookSession.dateAvailable')} {dayAvailability.startTime} - {dayAvailability.endTime}
                                    </p>
                                  )
                                } else {
                                  return (
                                    <p className="text-xs text-red-400 mt-1">
                                      {t('speakerProfile.bookSession.dateNotAvailable')}
                                    </p>
                                  )
                                }
                              })()}
                            </div>

                            <div>
                              <Label htmlFor="time" className="text-white">{t('speakerProfile.bookSession.time')}</Label>
                              <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => {
                                  setFormData({ ...formData, time: e.target.value })
                                  setBookingError("") // Clear error when time changes
                                }}
                                min={formData.date ? getTimeConstraints(formData.date).min : undefined}
                                max={formData.date ? getTimeConstraints(formData.date).max : undefined}
                                disabled={!formData.date || !isDateAvailable(formData.date)}
                                className="bg-white/10 border-white/20 text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {formData.date && isDateAvailable(formData.date) && (() => {
                                const { min, max } = getTimeConstraints(formData.date)
                                return (
                                  <p className="text-xs text-blue-400 mt-1">
                                    {t('speakerProfile.bookSession.timeHint')} {min} {t('dashboard.availability.to')} {max} {t('speakerProfile.bookSession.topicsMax')}
                                  </p>
                                )
                              })()}
                            </div>

                            <div>
                              <Label className="text-white">{t('speakerProfile.bookSession.topics')}</Label>
                              <Input
                                placeholder={t('speakerProfile.bookSession.topic1')}
                                value={formData.topic1}
                                onChange={(e) => setFormData({ ...formData, topic1: e.target.value })}
                                className="bg-white/10 border-white/20 text-white mt-2 mb-2"
                              />
                              <Input
                                placeholder={t('speakerProfile.bookSession.topic2')}
                                value={formData.topic2}
                                onChange={(e) => setFormData({ ...formData, topic2: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>

                            {bookingError && (
                              <div className="text-red-400 text-sm">{bookingError}</div>
                            )}

                            <Button
                              onClick={handleBooking}
                              disabled={isBooking}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            >
                              {isBooking ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  {t('speakerProfile.bookSession.booking')}
                                </>
                              ) : (
                                t('speakerProfile.bookSession.confirmBooking')
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                {/* )} */}
              </div>
            </div>

            {/* Bio */}
            {speaker.bio && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-3">{t('speakerProfile.about')}</h3>
                <p className="text-gray-300 leading-relaxed">{speaker.bio}</p>
              </div>
            )}

            {/* Interests */}
            {speaker.interests && speaker.interests.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-3">{t('speakerProfile.topicsInterests')}</h3>
                <div className="flex flex-wrap gap-2">
                  {speaker.interests.map((interest: string, idx: number) => (
                    <Badge
                      key={idx}
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm py-1.5 px-3"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t('speakerProfile.reviews')} ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.from && typeof review.from === 'object' && review.from.avatar ? (
                          <Image
                            src={review.from.avatar}
                            alt={review.from.firstname}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {review.from && typeof review.from === 'object' 
                                ? `${review.from.firstname?.[0] || ''}${review.from.lastname?.[0] || ''}`
                                : 'U'
                              }
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {review.from && typeof review.from === 'object'
                              ? `${review.from.firstname} ${review.from.lastname}`
                              : t('speakerProfile.bookSession.anonymous')
                            }
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-300">{t('speakerProfile.bookSession.noReviews')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
