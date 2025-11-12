"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, Loader2, Filter, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { speakerService } from "@/lib/services/speakerService"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function SpeakersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [speakers, setSpeakers] = useState<any[]>([])
  const [filteredSpeakers, setFilteredSpeakers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState<any | null>(null)
  const [selectedSpeakerDetails, setSelectedSpeakerDetails] = useState<any | null>(null)
  const [isLoadingSpeakerDetails, setIsLoadingSpeakerDetails] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const getInitialFormState = () => ({
    title: "",
    date: "",
    time: "",
    topic1: "",
    topic2: ""
  })
  const [formData, setFormData] = useState(getInitialFormState)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() => new Date())

  const topics = [
    { key: "Business", translationKey: 'speakers.filter.business' },
    { key: "Technology", translationKey: 'speakers.filter.technology' },
    { key: "Health", translationKey: 'speakers.filter.health' },
    { key: "Education", translationKey: 'speakers.filter.education' },
    { key: "Arts", translationKey: 'speakers.filter.arts' },
    { key: "Sports", translationKey: 'speakers.filter.sports' },
    { key: "Travel", translationKey: 'speakers.filter.travel' },
    { key: "Food", translationKey: 'speakers.filter.food' },
    { key: "Science", translationKey: 'speakers.filter.science' },
    { key: "Entertainment", translationKey: 'speakers.filter.entertainment' }
  ]

  const daysOfWeek = [
    { key: "monday", translationKey: 'dashboard.availability.days.monday' },
    { key: "tuesday", translationKey: 'dashboard.availability.days.tuesday' },
    { key: "wednesday", translationKey: 'dashboard.availability.days.wednesday' },
    { key: "thursday", translationKey: 'dashboard.availability.days.thursday' },
    { key: "friday", translationKey: 'dashboard.availability.days.friday' },
    { key: "saturday", translationKey: 'dashboard.availability.days.saturday' },
    { key: "sunday", translationKey: 'dashboard.availability.days.sunday' }
  ]

  const activeSpeaker = useMemo(
    () => selectedSpeakerDetails ?? selectedSpeaker,
    [selectedSpeakerDetails, selectedSpeaker]
  )

  const isSpeakerCalendarConnected = (speakerData: any): boolean => {
    if (!speakerData) return true

    const calendarStatusValue =
      typeof speakerData.calendarStatus === "string"
        ? speakerData.calendarStatus.toLowerCase()
        : undefined

    if (calendarStatusValue === "connected") return true
    if (calendarStatusValue === "disconnected") return false

    const explicitFlags = [
      speakerData.calendar?.connected,
      speakerData.calendar?.isConnected,
      speakerData.calendarConnected,
      speakerData.isCalendarConnected,
      speakerData.googleCalendarConnected
    ]

    if (explicitFlags.some((flag) => flag === true)) {
      return true
    }

    if (explicitFlags.some((flag) => flag === false)) {
      return false
    }

    return true
  }

  const canBookSelectedSpeaker = useMemo(
    () => isSpeakerCalendarConnected(activeSpeaker),
    [activeSpeaker]
  )

  const formatDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseDateString = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const isSameDate = (dateA: Date, dateB: Date) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()

  const formatReadableDate = (dateString: string) => {
    if (!dateString) return ""
    const date = parseDateString(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    })
  }

  const formatTimeDisplay = (time: string) => {
    if (!time) return ""
    const [hour, minute] = time.split(":").map(Number)
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const getDayNameFromDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  const isDateAvailable = (dateString: string, speakerData: any = activeSpeaker): boolean => {
    if (!dateString || !speakerData?.availability) return false
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speakerData.availability.find((avail: any) => avail.day === dayName)
    return dayAvailability?.isAvailable || false
  }

  const validateBookingTime = (date: string, time: string): string | null => {
    if (!date || !time || !activeSpeaker?.availability) return null

    const dayName = getDayNameFromDate(date)
    const dayAvailability = activeSpeaker.availability.find((avail: any) => avail.day === dayName)

    if (!dayAvailability || !dayAvailability.isAvailable) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation
        ? t(dayTranslation.translationKey as any)
        : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t('speakerProfile.bookSession.unavailableDay')} ${dayLabel}.`
    }

    const [requestedHour, requestedMinute] = time.split(':').map(Number)
    const requestedMinutes = requestedHour * 60 + requestedMinute
    const [startHour, startMinute] = (dayAvailability.startTime || '00:00').split(':').map(Number)
    const [endHour, endMinute] = (dayAvailability.endTime || '23:59').split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    const sessionEndMinutes = requestedMinutes + 30

    if (requestedMinutes < startMinutes || sessionEndMinutes > endMinutes) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation
        ? t(dayTranslation.translationKey as any)
        : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t('speakerProfile.bookSession.timeNotInRange')} ${dayAvailability.startTime} ${t('dashboard.availability.to')} ${dayAvailability.endTime} ${t('dashboard.availability.to')} ${dayLabel}.`
    }

    return null
  }

  const isSameMonthAndYear = (dateA: Date, dateB: Date) =>
    dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth()

  const getDayAvailability = (dateString: string, speakerData: any = activeSpeaker) => {
    if (!dateString || !speakerData?.availability) return null
    const dayName = getDayNameFromDate(dateString)
    return speakerData.availability.find((avail: any) => avail.day === dayName) ?? null
  }

  const getTimeSlotsForDate = (dateString: string, speakerData: any = activeSpeaker): string[] => {
    const dayAvailability = getDayAvailability(dateString, speakerData)
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return []
    }

    const startTime = dayAvailability.startTime || "00:00"
    const endTime = dayAvailability.endTime || "23:59"
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    if (endMinutes <= startMinutes) {
      return []
    }

    const now = new Date()
    now.setSeconds(0, 0)
    const slots: string[] = []

    for (let minutes = startMinutes; minutes <= endMinutes - 30; minutes += 30) {
      const slotHour = Math.floor(minutes / 60)
      const slotMinute = minutes % 60
      const slotString = `${String(slotHour).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`
      const slotDate = new Date(`${dateString}T${slotString}`)
      if (slotDate >= now) {
        slots.push(slotString)
      }
    }

    return slots
  }

  const findNextAvailableDate = (speakerData: any) => {
    if (!speakerData) return ""
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 120; i++) {
      const candidate = new Date(today)
      candidate.setDate(today.getDate() + i)
      const candidateString = formatDateString(candidate)

      if (
        isDateAvailable(candidateString, speakerData) &&
        getTimeSlotsForDate(candidateString, speakerData).length > 0
      ) {
        return candidateString
      }
    }

    return ""
  }

  const handleDateSelection = (dateString: string, isAvailable: boolean) => {
    if (!isAvailable) return
    setFormData((prev) => {
      if (prev.date === dateString) {
        return prev
      }
      return {
        ...prev,
        date: dateString,
        time: ""
      }
    })
    setBookingError("")
  }

  const handleTimeSelection = (slot: string) => {
    setFormData((prev) => {
      if (prev.time === slot) {
        return prev
      }
      return {
        ...prev,
        time: slot
      }
    })
    setBookingError("")
  }

  const goToPreviousMonth = () => {
    setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const buildCalendarDays = (month: Date, speakerData: any = activeSpeaker) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const startDay = startOfMonth.getDay()
    const gridStart = new Date(startOfMonth)
    gridStart.setDate(startOfMonth.getDate() - startDay)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days: Array<{
      date: Date
      dateString: string
      isCurrentMonth: boolean
      isAvailable: boolean
      isPast: boolean
    }> = []

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(gridStart)
      currentDate.setDate(gridStart.getDate() + i)
      const dateString = formatDateString(currentDate)
      const isCurrentMonth = currentDate.getMonth() === month.getMonth()
      const isPast = currentDate < today
      const isAvailableDay = isDateAvailable(dateString, speakerData)

      days.push({
        date: currentDate,
        dateString,
        isCurrentMonth,
        isAvailable: !isPast && isAvailableDay,
        isPast
      })
    }

    return days
  }

  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: "short" }),
    []
  )

  const calendarDays = useMemo(
    () => buildCalendarDays(displayedMonth, activeSpeaker),
    [displayedMonth, activeSpeaker]
  )

  const timeSlots = useMemo(
    () => (formData.date ? getTimeSlotsForDate(formData.date, activeSpeaker) : []),
    [formData.date, activeSpeaker]
  )

  const selectedDayAvailability = useMemo(
    () => (formData.date ? getDayAvailability(formData.date, activeSpeaker) : null),
    [formData.date, activeSpeaker]
  )

  useEffect(() => {
    fetchSpeakers()
  }, [])

  useEffect(() => {
    filterSpeakers()
  }, [searchQuery, selectedTopic, speakers])

  useEffect(() => {
    loadTopics()
  }, [])

  useEffect(() => {
    if (!isBookingDialogOpen || !activeSpeaker) {
      return
    }

    if (!formData.date) {
      const nextAvailable = findNextAvailableDate(activeSpeaker)
      if (nextAvailable) {
        setFormData((prev) => {
          if (prev.date === nextAvailable && prev.time === "") {
            return prev
          }
          return {
            ...prev,
            date: nextAvailable,
            time: ""
          }
        })
        const nextDate = parseDateString(nextAvailable)
        setDisplayedMonth((prev) => (isSameMonthAndYear(prev, nextDate) ? prev : nextDate))
      } else {
        setFormData((prev) => {
          if (prev.date === "" && prev.time === "") {
            return prev
          }
          return {
            ...prev,
            date: "",
            time: ""
          }
        })
      }
    } else {
      const selectedDate = parseDateString(formData.date)
      setDisplayedMonth((prev) => (isSameMonthAndYear(prev, selectedDate) ? prev : selectedDate))
    }
  }, [isBookingDialogOpen, activeSpeaker, formData.date])

  useEffect(() => {
    if (!isBookingDialogOpen) {
      return
    }

    if (!formData.date) {
      if (formData.time) {
        setFormData((prev) => ({
          ...prev,
          time: ""
        }))
      }
      return
    }

    if (timeSlots.length === 0) {
      if (formData.time) {
        setFormData((prev) => ({
          ...prev,
          time: ""
        }))
      }
      return
    }

    if (!formData.time || !timeSlots.includes(formData.time)) {
      setFormData((prev) => ({
        ...prev,
        time: timeSlots[0]
      }))
    }
  }, [isBookingDialogOpen, formData.date, formData.time, timeSlots])

  const fetchSpeakers = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakers()
      if (response.success) {
        setSpeakers(response.data.speakers)
        setFilteredSpeakers(response.data.speakers)
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTopics = async () => {
    try {
      const response = await speakerService.getTopics()
      if (response.success && response.data.topics) {
        setAvailableTopics(response.data.topics)
      }
    } catch (error) {
      console.error("Error loading topics:", error)
    }
  }

  const filterSpeakers = () => {
    let filtered = speakers

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(speaker => {
        const fullName = `${speaker.firstname} ${speaker.lastname}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
      })
    }

    // Topic filter
    if (selectedTopic) {
      filtered = filtered.filter(speaker => 
        speaker.interests?.includes(selectedTopic)
      )
    }

    setFilteredSpeakers(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTopic("")
  }

  const fetchSelectedSpeakerDetails = async (speakerId: string) => {
    try {
      setIsLoadingSpeakerDetails(true)
      const response = await learnerService.getSpeakerProfile(speakerId)
      if (response.success) {
        setSelectedSpeakerDetails(response.data.speaker)
      } else {
        setSelectedSpeakerDetails(null)
      }
    } catch (error) {
      console.error("Error fetching speaker profile:", error)
      setSelectedSpeakerDetails(null)
      setBookingError(t('speakerProfile.bookSession.failed'))
    } finally {
      setIsLoadingSpeakerDetails(false)
    }
  }

  const resetBookingState = () => {
    setFormData(getInitialFormState())
    setBookingError("")
    setBookingSuccess(false)
    setIsBooking(false)
    setSelectedSpeaker(null)
    setSelectedSpeakerDetails(null)
    setIsLoadingSpeakerDetails(false)
    setDisplayedMonth(new Date())
  }

  const handleBookingDialogChange = (open: boolean) => {
    if (!open) {
      resetBookingState()
      setIsBookingDialogOpen(false)
    } else {
      setIsBookingDialogOpen(true)
    }
  }

  const handleOpenBookingModal = async (speaker: any) => {
    if (!speaker) return
    if (!isSpeakerCalendarConnected(speaker)) {
      setBookingError(t('speakerProfile.bookSession.speakerCalendarNotConnected'))
      setSelectedSpeaker(speaker)
      setSelectedSpeakerDetails(null)
      setIsBookingDialogOpen(true)
      return
    }

    setSelectedSpeaker(speaker)
    setFormData(getInitialFormState())
    setBookingError("")
    setBookingSuccess(false)
    setDisplayedMonth(new Date())
    setIsBookingDialogOpen(true)
    if (speaker._id) {
      await fetchSelectedSpeakerDetails(speaker._id)
    } else {
      setSelectedSpeakerDetails(null)
    }
  }

  const handleBooking = async () => {
    if (!activeSpeaker?._id) {
      setBookingError(t('speakerProfile.bookSession.failed'))
      return
    }

    if (!isSpeakerCalendarConnected(activeSpeaker)) {
      setBookingError(t('speakerProfile.bookSession.speakerCalendarNotConnected'))
      return
    }

    if (!formData.title || !formData.date || !formData.time) {
      setBookingError(t('speakerProfile.bookSession.allFieldsRequired'))
      return
    }

    const availabilityError = validateBookingTime(formData.date, formData.time)
    if (availabilityError) {
      setBookingError(availabilityError)
      return
    }

    const topics = [formData.topic1, formData.topic2].filter((topic) => topic.trim() !== "")

    if (topics.length > 2) {
      setBookingError(t('speakerProfile.bookSession.maxTopics'))
      return
    }

    try {
      setIsBooking(true)
      setBookingError("")

      await learnerService.bookSession({
        speakerId: activeSpeaker._id,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        topics
      })

      setBookingSuccess(true)
      setFormData(getInitialFormState())

      setTimeout(() => {
        handleBookingDialogChange(false)
        router.push("/learners/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error booking session:", error)
      setBookingError(error?.message || t('speakerProfile.bookSession.failed'))
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-[#524FD5]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 sm:pb-0 pb-0">
      <Header />
      <main className="relative py-16 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F7F2FF] via-[#EEE8FF] to-[#FBF6FF] dark:from-[#080A18] dark:via-[#161B2D] dark:to-[#3B82F6] opacity-60 dark:opacity-90 transition-colors duration-700" />
        <div className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 text-left">
          <h1 className="text-xl sm:text-xl font-bold text-foreground mb-4 transition-colors duration-300">
            {t('speakers.title')}
          </h1>
          {/* <p className="text-gray-300 text-lg">
            {t('speakers.subtitle')}
          </p> */}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 transition-colors duration-300">
          <div className="">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('speakers.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-transparent border border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7357F5]/40 focus-visible:border-[#7357F5]/50 h-10 text-sm"
                />
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-2 md:border-l md:pl-3 md:border-border/60">
                <Filter className="w-4 h-4 text-[#7357F5]" />
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {topics.slice(0, 6).map((topic) => (
                    <Button
                      key={topic.key}
                      onClick={() => setSelectedTopic(topic.key === selectedTopic ? "" : topic.key)}
                      variant={selectedTopic === topic.key ? "default" : "outline"}
                      className={`h-8 px-3 text-xs rounded-full border ${
                        selectedTopic === topic.key
                          ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border-transparent shadow-md hover:brightness-110"
                          : "bg-transparent border-border/60 text-muted-foreground hover:bg-muted/20"
                      }`}
                    >
                      {t(topic.translationKey as any)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            {/* <div className="mt-3 text-muted-foreground text-xs">
              {filteredSpeakers.length} {filteredSpeakers.length !== 1 ? t('speakers.results.countPlural') : t('speakers.results.count')}
            </div> */}
          </div>
        </div>

        {/* Speakers Grid */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpeakers.map((speaker) => {
              const canBookSpeaker = isSpeakerCalendarConnected(speaker)

              return (
                <div
                  key={speaker._id}
                  className="bg-card text-card-foreground backdrop-blur-sm border border-border/60 rounded-3xl shadow-lg p-6 flex flex-col gap-5 h-full transition-colors duration-300 hover:shadow-xl hover:border-[#7357F5]/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-full border-4 border-indigo-100 bg-gradient-to-br from-indigo-100 to-cyan-100 overflow-hidden flex items-center justify-center text-indigo-600 font-semibold text-xl">
                      {speaker.avatar ? (
                        <Image
                          src={speaker.avatar}
                          alt={`${speaker.firstname || ""} ${speaker.lastname || ""}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      ) : (
                        <span>
                          {speaker.firstname?.[0] || ""}
                          {speaker.lastname?.[0] || ""}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">
                        {speaker.firstname} {speaker.lastname}
                      </h3>
                      {(speaker.age || speaker.location) && (
                        <p className="text-sm text-muted-foreground transition-colors duration-300">
                          {[
                            speaker.age ? `${speaker.age} ${t('home.speakerCard.age')}` : null,
                            speaker.location,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      )}
                      {(() => {
                        const ratingValue =
                          typeof speaker.rating === "number"
                            ? speaker.rating
                            : typeof speaker.averageRating === "number"
                              ? speaker.averageRating
                              : undefined
                        const reviewCount =
                          speaker.reviewsCount ??
                          speaker.reviewCount ??
                          speaker.totalReviews ??
                          (Array.isArray(speaker.reviews) ? speaker.reviews.length : undefined)
                        if (!ratingValue && !reviewCount) {
                          return null
                        }
                        return (
                          <div className="mt-2 flex items-center gap-1 text-indigo-500 dark:text-indigo-300 text-sm font-medium transition-colors duration-300">
                            <Star className="w-4 h-4 fill-current stroke-0" />
                            <span>{ratingValue ? ratingValue.toFixed(1) : "New"}</span>
                            {reviewCount ? (
                              <span className="text-slate-400 dark:text-slate-500 font-normal">
                                ({reviewCount})
                              </span>
                            ) : null}
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {speaker.bio && (
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                      {speaker.bio}
                    </p>
                  )}

                  {speaker.interests && speaker.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {speaker.interests.slice(0, 4).map((interest: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-[#7357F5] text-white text-xs font-medium px-3 py-1"
                        >
                          {interest}
                        </span>
                      ))}
                      {speaker.interests.length > 4 && (
                        <span className="rounded-full border border-border/60 text-muted-foreground text-xs font-medium px-3 py-1 transition-colors duration-300">
                          +{speaker.interests.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBookingModal(speaker)}
                      disabled={!canBookSpeaker}
                      aria-disabled={!canBookSpeaker}
                      title={!canBookSpeaker ? t('speakerProfile.bookSession.speakerCalendarNotConnected') : undefined}
                      className={`w-full rounded-xl border border-border bg-transparent py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7357F5]/40 ${
                        canBookSpeaker
                          ? "text-foreground hover:bg-muted/20 cursor-pointer"
                          : "text-muted-foreground opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {t('home.speakerCard.book')}
                    </button>
                    {!canBookSpeaker && (
                      <p className="text-xs text-muted-foreground">
                        {t('speakerProfile.bookSession.speakerCalendarNotConnected')}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className="bg-card/80 dark:bg-slate-900/70 backdrop-blur-md border border-border/60 shadow-lg transition-colors duration-300">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                {t('speakers.noResults')}
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="cursor-pointer"
              >
                {t('speakers.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isBookingDialogOpen} onOpenChange={handleBookingDialogChange}>
          <DialogContent className="bg-[#1A1A33] border-white/20 text-white max-h-[95vh] overflow-y-auto">
            <DialogHeader className="pb-1">
              <DialogTitle className="text-white text-xl">
                {t('speakerProfile.bookSession.title')}
                {activeSpeaker ? ` • ${activeSpeaker.firstname ?? ""} ${activeSpeaker.lastname ?? ""}` : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {t('speakerProfile.bookSession.success.title')}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {t('speakerProfile.bookSession.success.message')}
                  </p>
                </div>
              ) : (
                <>
                  <>
                      {/* {activeSpeaker?.availability && (
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <Label className="text-white font-semibold mb-2 block text-sm">
                            {t('speakerProfile.bookSession.availability')}
                          </Label>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {daysOfWeek.map((day) => {
                              const dayAvailability = activeSpeaker.availability.find(
                                (avail: any) => avail.day === day.key
                              )
                              const isAvailable = dayAvailability?.isAvailable || false
                              return (
                                <div
                                  key={day.key}
                                  className={`flex items-center justify-between text-xs p-1.5 rounded ${
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
                                    <span className="text-gray-500 text-xs">
                                      {t('speakerProfile.bookSession.notAvailable')}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )} */}

                      <div>
                        <Label htmlFor="booking-title" className="text-white">
                          {t('speakerProfile.bookSession.sessionTitle')}
                        </Label>
                        <Input
                          id="booking-title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value
                            }))
                          }
                          placeholder={t('speakerProfile.bookSession.sessionTitlePlaceholder')}
                          className="bg-white/10 border-white/20 text-white mt-2"
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {t('speakerProfile.bookSession.date')}
                              </p>
                              <p className="text-xs text-gray-300">
                                {formData.date
                                  ? formatReadableDate(formData.date)
                                  : "Select a date to see availability"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={goToPreviousMonth}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-[#7357F5]/60 hover:text-[#B7A9FF] transition-colors"
                                aria-label="Previous month"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-semibold text-white">
                                {displayedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                              </span>
                              <button
                                type="button"
                                onClick={goToNextMonth}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-[#7357F5]/60 hover:text-[#B7A9FF] transition-colors"
                                aria-label="Next month"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-medium uppercase text-gray-400">
                            {Array.from({ length: 7 }).map((_, index) => (
                              <span key={index} className="py-1">
                                {weekdayFormatter.format(new Date(Date.UTC(2021, 7, index + 1)))}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 grid grid-cols-7 gap-1">
                            {calendarDays.map((day) => {
                              const isSelected = formData.date ? day.dateString === formData.date : false
                              const isDisabled = !day.isCurrentMonth || !day.isAvailable

                              return (
                                <button
                                  key={day.dateString}
                                  type="button"
                                  onClick={() => handleDateSelection(day.dateString, day.isAvailable)}
                                  disabled={isDisabled}
                                  className={`h-5 w-5 rounded-full text-xs font-medium transition-all ${
                                    isSelected
                                      ? "bg-gradient-to-br from-[#6E63F6] to-[#8B5CF6] text-white shadow-lg"
                                      : day.isCurrentMonth
                                        ? "text-white hover:bg-[#6E63F6]/20"
                                        : "text-gray-500/70"
                                  } ${day.isPast ? "opacity-40 cursor-not-allowed" : ""} ${
                                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                                  } flex items-center justify-center border border-transparent`}
                                >
                                  {day.date.getDate()}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur flex flex-col">
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-white">
                              {t('speakerProfile.bookSession.time')}
                            </p>
                            <p className="text-xs text-gray-300">
                              {formData.date
                                ? formatReadableDate(formData.date)
                                : "Select a date to view time slots"}
                            </p>
                          </div>
                          <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 bg-black/10 p-3">
                            {isLoadingSpeakerDetails ? (
                              <div className="flex h-32 items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-[#B7A9FF]" />
                              </div>
                            ) : !formData.date ? (
                              <div className="flex h-32 items-center justify-center px-4 text-center text-xs text-gray-400">
                                Please choose a date on the left to see available time slots.
                              </div>
                            ) : timeSlots.length > 0 ? (
                              <div className="grid grid-cols-4 gap-1">
                                {timeSlots.map((slot) => {
                                  const isSelected = formData.time === slot
                                  return (
                                    <button
                                      key={slot}
                                      type="button"
                                      onClick={() => handleTimeSelection(slot)}
                                      className={`w-full cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
                                        isSelected
                                          ? "bg-gradient-to-br from-[#6E63F6] to-[#8B5CF6] text-white border-transparent shadow-lg"
                                          : "border-white/15 text-gray-200 hover:border-[#7357F5]/60 hover:text-white"
                                      }`}
                                    >
                                      {formatTimeDisplay(slot)}
                                    </button>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="flex h-32 items-center justify-center px-4 text-center text-xs text-gray-400">
                                No available time slots for the selected date. Please choose another day.
                              </div>
                            )}
                          </div>
                          {selectedDayAvailability && (
                            <p className="mt-3 text-xs text-gray-300">
                              {t('speakerProfile.bookSession.dateAvailable')} {selectedDayAvailability.startTime} - {selectedDayAvailability.endTime}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">
                          {t('speakerProfile.bookSession.topics')}
                        </Label>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {availableTopics.length > 0 ? availableTopics.map((topic) => {
                            const isSelected = formData.topic1 === topic || formData.topic2 === topic
                            const canSelectTopic = !formData.topic1 || !formData.topic2

                            return (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    if (formData.topic1 === topic) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        topic1: ""
                                      }))
                                    } else {
                                      setFormData((prev) => ({
                                        ...prev,
                                        topic2: ""
                                      }))
                                    }
                                  } else if (canSelectTopic) {
                                    if (!formData.topic1) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        topic1: topic
                                      }))
                                    } else {
                                      setFormData((prev) => ({
                                        ...prev,
                                        topic2: topic
                                      }))
                                    }
                                  }
                                }}
                                disabled={!isSelected && !canSelectTopic}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                  isSelected
                                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-2 border-purple-400"
                                    : "bg-white/10 border border-white/20 text-gray-300 hover:border-purple-400/50"
                                } ${!isSelected && !canSelectTopic ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {topic}
                              </button>
                            )
                          }) : (
                            <span className="text-xs text-gray-400">
                              No topics available.
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          Selected: {(formData.topic1 ? 1 : 0) + (formData.topic2 ? 1 : 0)}/2
                        </p>
                        {(formData.topic1 || formData.topic2) && (
                          <div className="flex flex-wrap gap-2">
                            {formData.topic1 && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {formData.topic1}
                              </Badge>
                            )}
                            {formData.topic2 && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {formData.topic2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {bookingError && (
                        <div className="text-red-400 text-sm">{bookingError}</div>
                      )}

                      {!canBookSelectedSpeaker && (
                        <div className="text-yellow-300 text-sm">
                          {t('speakerProfile.bookSession.speakerCalendarNotConnected')}
                        </div>
                      )}

                      <Button
                        onClick={handleBooking}
                        disabled={isBooking || !canBookSelectedSpeaker}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </main>
    </div>
  )
}

