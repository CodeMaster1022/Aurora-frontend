"use client"

import { cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react"
import type { Matcher } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { useAppSelector } from "@/lib/hooks/redux"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { learnerService } from "@/lib/services/learnerService"
import { speakerService } from "@/lib/services/speakerService"

type SpeakerAvailability = {
  day: string
  isAvailable: boolean
  startTime?: string
  endTime?: string
}

type SpeakerDetails = {
  _id?: string
  firstname?: string
  lastname?: string
  availability?: SpeakerAvailability[]
  googleCalendar?: {
    timezone?: string
    connected?: boolean
  }
}

type BookingFormState = {
  title: string
  date: string
  time: string
  topic1: string
  topic2: string
}

export interface BookSessionDialogProps {
  speaker: SpeakerDetails
  trigger?: ReactElement<any>
  onBooked?: () => void
  disableAutoCloseRedirect?: boolean
}

const INITIAL_FORM_STATE: BookingFormState = {
  title: "",
  date: "",
  time: "",
  topic1: "",
  topic2: "",
}

const daysOfWeek = [
  { key: "monday", translationKey: "dashboard.availability.days.monday" },
  { key: "tuesday", translationKey: "dashboard.availability.days.tuesday" },
  { key: "wednesday", translationKey: "dashboard.availability.days.wednesday" },
  { key: "thursday", translationKey: "dashboard.availability.days.thursday" },
  { key: "friday", translationKey: "dashboard.availability.days.friday" },
  { key: "saturday", translationKey: "dashboard.availability.days.saturday" },
  { key: "sunday", translationKey: "dashboard.availability.days.sunday" },
]

const dayNameToIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

const steps = ["Schedule", "Details", "Review"]

// Common timezones list
// Generate timezone list dynamically using Intl API
const getAllTimezones = (): Array<{ value: string; label: string }> => {
  try {
    // Get all IANA timezones
    const timezones = Intl.supportedValuesOf('timeZone')
    
    // Format each timezone with a readable label
    return timezones.map(tz => {
      try {
        const date = new Date()
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeZoneName: 'short'
        })
        const parts = formatter.formatToParts(date)
        const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value || ''
        
        // Get city/region name from timezone (e.g., "America/New_York" -> "New York")
        const cityName = tz.split('/').pop()?.replace(/_/g, ' ') || tz
        
        // Create label: "New York (EST)" or just "New York" if no abbreviation
        const label = timeZoneName ? `${cityName} (${timeZoneName})` : cityName
        
        return { value: tz, label }
      } catch {
        // Fallback if formatting fails
        return { value: tz, label: tz }
      }
    }).sort((a, b) => {
      // Sort alphabetically by label
      return a.label.localeCompare(b.label)
    })
  } catch (error) {
    console.error('Error generating timezones:', error)
    // Fallback to a minimal list if Intl API is not supported
    return [
      { value: 'UTC', label: 'UTC (Coordinated Universal Time)' }
    ]
  }
}

// Cache the timezone list (generated once)
const TIMEZONES = getAllTimezones()

// Timezone conversion utilities
// This function converts a time from one timezone to another
const convertTimeToTimezone = (time: string, date: string, fromTimezone: string, toTimezone: string): string => {
  try {
    const [hours, minutes] = time.split(":").map(Number)
    const [year, month, day] = date.split("-").map(Number)
    
    // Create a date string for the target date
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    
    // To convert time between timezones, we need to:
    // 1. Create a Date object that represents the time in fromTimezone
    // 2. Get the UTC equivalent
    // 3. Format that UTC time in toTimezone
    
    // We'll use a helper: create a date at noon UTC on the target date
    // This gives us a reference point to calculate offsets
    const noonUTC = new Date(`${dateStr}T12:00:00Z`)
    
    // Get what time noon UTC is in fromTimezone
    const fromTZNoon = new Intl.DateTimeFormat("en-US", {
      timeZone: fromTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(noonUTC)
    
    const fromTZNoonHour = parseInt(fromTZNoon.find(p => p.type === "hour")?.value || "12")
    const fromTZNoonMin = parseInt(fromTZNoon.find(p => p.type === "minute")?.value || "0")
    
    // Calculate offset: if noon UTC = 5 PM in fromTimezone, offset is +5 hours
    const fromTZOffsetMinutes = (fromTZNoonHour * 60 + fromTZNoonMin) - (12 * 60)
    
    // Now, if we want "hours:minutes" in fromTimezone, what UTC time is that?
    // desiredTime - offset = UTC time
    const desiredTotalMinutes = hours * 60 + minutes
    const utcTotalMinutes = desiredTotalMinutes - fromTZOffsetMinutes
    
    // Normalize to 0-1439 (minutes in a day)
    let normalizedMinutes = utcTotalMinutes
    while (normalizedMinutes < 0) normalizedMinutes += 1440
    while (normalizedMinutes >= 1440) normalizedMinutes -= 1440
    
    const utcHours = Math.floor(normalizedMinutes / 60)
    const utcMins = normalizedMinutes % 60
    
    // Create UTC date
    const utcDate = new Date(`${dateStr}T${String(utcHours).padStart(2, "0")}:${String(utcMins).padStart(2, "0")}:00Z`)
    
    // Format in toTimezone
    const toParts = new Intl.DateTimeFormat("en-US", {
      timeZone: toTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(utcDate)
    
    const toHour = toParts.find(p => p.type === "hour")?.value || "00"
    const toMinute = toParts.find(p => p.type === "minute")?.value || "00"
    
    return `${toHour.padStart(2, "0")}:${toMinute.padStart(2, "0")}`
  } catch (error) {
    console.error("Error converting timezone:", error)
    return time // Return original time on error
  }
}

// Convert time from speaker's timezone to UTC for backend
const convertTimeToUTC = (time: string, date: string, timezone: string): string => {
  return convertTimeToTimezone(time, date, timezone, "UTC")
}

// Convert time from UTC to speaker's timezone for display
const convertTimeFromUTC = (time: string, date: string, timezone: string): string => {
  return convertTimeToTimezone(time, date, "UTC", timezone)
}

// Format timezone to a human-readable label
const formatTimezoneLabel = (tzValue: string): string => {
  try {
    // Try to format it using Intl
    const date = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tzValue,
      timeZoneName: "short",
    })
    const parts = formatter.formatToParts(date)
    const timeZoneName = parts.find((part) => part.type === "timeZoneName")?.value || ""
    // Get city name from timezone (e.g., "America/New_York" -> "New York")
    const cityName = tzValue.split("/").pop()?.replace(/_/g, " ") || tzValue
    return `${cityName} (${timeZoneName})`
  } catch {
    return tzValue
  }
}

export function BookSessionDialog({
  speaker,
  trigger,
  onBooked,
  disableAutoCloseRedirect = false,
}: BookSessionDialogProps) {
  // Debug: Log what props BookSessionDialog receives
  useEffect(() => {
    console.log("[BookSessionDialog] Received speaker prop:", {
      _id: speaker?._id,
      firstname: speaker?.firstname,
      lastname: speaker?.lastname,
      googleCalendar: speaker?.googleCalendar,
      googleCalendarTimezone: speaker?.googleCalendar?.timezone,
      googleCalendarConnected: speaker?.googleCalendar?.connected,
      availability: speaker?.availability,
      availabilityCount: speaker?.availability?.length,
    })
  }, [speaker])

  const router = useRouter()
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<BookingFormState>(INITIAL_FORM_STATE)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [speakerDetails, setSpeakerDetails] = useState<SpeakerDetails>(speaker)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>()
  // Get speaker's calendar timezone as default
  const getDefaultTimezone = (): string => {
    const tz = speakerDetails?.googleCalendar?.timezone || speaker?.googleCalendar?.timezone || "UTC"
    // console.log("[BookSessionDialog] Getting default timezone:", {
    //   fromSpeakerDetails: speakerDetails?.googleCalendar?.timezone,
    //   fromSpeakerProp: speaker?.googleCalendar?.timezone,
    //   final: tz,
    // })
    return tz
  }
  
  const [selectedTimezone, setSelectedTimezone] = useState<string>(getDefaultTimezone())
  const [timezoneOpen, setTimezoneOpen] = useState(false)

  // Get speaker's calendar timezone (original timezone for availability)
  const speakerTimezone = useMemo(() => {
    const tz = speakerDetails?.googleCalendar?.timezone || speaker?.googleCalendar?.timezone || "UTC"
    console.log("[BookSessionDialog] Speaker timezone calculated:", {
      fromSpeakerDetails: speakerDetails?.googleCalendar?.timezone,
      fromSpeakerProp: speaker?.googleCalendar?.timezone,
      final: tz,
    })
    return tz
  }, [speakerDetails?.googleCalendar?.timezone, speaker?.googleCalendar?.timezone])

  // Helper function to format date to string (needed before convertedAvailability)
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Convert availability times from speaker's timezone to selected timezone for display
  // Keep original availability intact (in speaker's timezone)
  const convertedAvailability = useMemo(() => {
    console.log(speakerDetails?.availability, selectedTimezone, speakerTimezone, "=========")
    if (!speakerDetails?.availability || selectedTimezone === speakerTimezone) {
      // No conversion needed if timezone matches or no availability
      return speakerDetails?.availability || []
    }

    // Convert each availability entry from speaker's timezone to selected timezone
    return speakerDetails.availability.map((avail) => {
      if (!avail.isAvailable || !avail.startTime || !avail.endTime) {
        return avail // Return as-is if not available
      }

      // Convert start and end times from speaker's timezone to selected timezone
      // We need a reference date for conversion - use a fixed date (today) for consistent conversion
      // Note: The actual date selected by user will be used when generating slots
      const referenceDate = formatDateToString(new Date())
      
      const convertedStartTime = convertTimeToTimezone(
        avail.startTime,
        referenceDate,
        speakerTimezone,
        selectedTimezone
      )
      const convertedEndTime = convertTimeToTimezone(
        avail.endTime,
        referenceDate,
        speakerTimezone,
        selectedTimezone
      )

      return {
        ...avail,
        startTime: convertedStartTime,
        endTime: convertedEndTime,
      }
    })
  }, [speakerDetails?.availability, speakerTimezone, selectedTimezone])

  // Get speaker's timezone label for display
  const speakerTimezoneLabel = useMemo(() => {
    const speakerTZ = speakerDetails?.googleCalendar?.timezone || speaker?.googleCalendar?.timezone
    if (!speakerTZ) return "UTC"
    
    // Try to find in standard list first
    const standardTZ = TIMEZONES.find((tz) => tz.value === speakerTZ)
    if (standardTZ) return standardTZ.label
    
    // Otherwise format it
    return formatTimezoneLabel(speakerTZ)
  }, [speakerDetails?.googleCalendar?.timezone, speaker?.googleCalendar?.timezone])

  // Create a list of timezones that includes speaker's calendar timezone if not already in the list
  const availableTimezones = useMemo(() => {
    const speakerTimezone = speakerDetails?.googleCalendar?.timezone || speaker?.googleCalendar?.timezone
    
    const timezonesToAdd: Array<{ value: string; label: string }> = []
    
    // Add speaker's calendar timezone if not in list
    if (speakerTimezone && !TIMEZONES.some((tz) => tz.value === speakerTimezone)) {
      timezonesToAdd.push({ value: speakerTimezone, label: formatTimezoneLabel(speakerTimezone) })
    }
    
    // If speaker has calendar timezone, prioritize it at the top
    if (speakerTimezone && TIMEZONES.some((tz) => tz.value === speakerTimezone)) {
      const speakerTZ = TIMEZONES.find((tz) => tz.value === speakerTimezone)
      const otherTZs = TIMEZONES.filter((tz) => tz.value !== speakerTimezone)
      return [
        ...timezonesToAdd,
        speakerTZ!,
        ...otherTZs,
      ]
    }
    
    return [...timezonesToAdd, ...TIMEZONES]
  }, [speakerDetails?.googleCalendar?.timezone, speaker?.googleCalendar?.timezone])

  useEffect(() => {
    // Debug: Log when speaker prop changes
    // console.log("[BookSessionDialog] Speaker prop changed, updating speakerDetails:", {
    //   _id: speaker?._id,
    //   firstname: speaker?.firstname,
    //   lastname: speaker?.lastname,
    //   googleCalendar: speaker?.googleCalendar,
    //   googleCalendarTimezone: speaker?.googleCalendar?.timezone,
    //   googleCalendarConnected: speaker?.googleCalendar?.connected,
    // })
    // Update speaker details when prop changes
    setSpeakerDetails(speaker)
    // Update timezone to speaker's calendar timezone when available
    if (speaker?.googleCalendar?.timezone) {
      // console.log("[BookSessionDialog] Setting selected timezone from speaker prop:", speaker.googleCalendar.timezone)
      setSelectedTimezone(speaker.googleCalendar.timezone)
    }
  }, [speaker])

  // Debug: Log when speakerDetails state changes
  // useEffect(() => {
  //   console.log("[BookSessionDialog] speakerDetails state updated:", {
  //     _id: speakerDetails?._id,
  //     firstname: speakerDetails?.firstname,
  //     lastname: speakerDetails?.lastname,
  //     googleCalendar: speakerDetails?.googleCalendar,
  //     googleCalendarTimezone: speakerDetails?.googleCalendar?.timezone,
  //     googleCalendarConnected: speakerDetails?.googleCalendar?.connected,
  //     availability: speakerDetails?.availability,
  //   })
  // }, [speakerDetails])

  const speakerId = speakerDetails?._id ?? speaker?._id

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_STATE)
      setBookingError("")
      setBookingSuccess(false)
      setCurrentStep(0)
      setSelectedDate(undefined)
      // Reset to speaker's calendar timezone when dialog closes
      const defaultTZ = speaker?.googleCalendar?.timezone || speakerDetails?.googleCalendar?.timezone || "UTC"
      setSelectedTimezone(defaultTZ)
      return
    }

    const fetchTopics = async () => {
      try {
        const response = await speakerService.getTopics()
        if (response.success && response.data.topics) {
          setAvailableTopics(response.data.topics)
        }
      } catch (error) {
        console.error("Error loading topics:", error)
      }
    }

    fetchTopics()
  }, [open])

  useEffect(() => {
    if (!formData.date) {
      setSelectedDate(undefined)
      return
    }
 
    const [year, month, day] = formData.date.split("-").map(Number)
    if (year && month && day) {
      setSelectedDate(new Date(year, month - 1, day))
    }
  }, [formData.date])

  useEffect(() => {
    if (!open || !speakerId) return

    // Always fetch speaker details when dialog opens to ensure we have googleCalendar data
    let isMounted = true

    const fetchSpeakerDetails = async () => {
      try {
        setIsLoadingDetails(true)
        const response = await learnerService.getSpeakerProfile(speakerId)
        if (response.success && response.data.speaker && isMounted) {
          const updatedSpeaker = {
            ...response.data.speaker,
            // Preserve any existing data such as custom trigger names if already present
            firstname: response.data.speaker.firstname ?? speaker?.firstname,
            lastname: response.data.speaker.lastname ?? speaker?.lastname,
            // Ensure googleCalendar object is preserved (including timezone)
            googleCalendar: response.data.speaker.googleCalendar || speaker?.googleCalendar,
          }
          // Debug: Log fetched speaker data
          // console.log("[BookSessionDialog] Fetched speaker data from API:", {
          //   _id: updatedSpeaker._id,
          //   firstname: updatedSpeaker.firstname,
          //   lastname: updatedSpeaker.lastname,
          //   googleCalendar: updatedSpeaker.googleCalendar,
          //   googleCalendarFromAPI: response.data.speaker.googleCalendar,
          //   googleCalendarFromProp: speaker?.googleCalendar,
          //   googleCalendarTimezone: updatedSpeaker.googleCalendar?.timezone,
          //   googleCalendarConnected: updatedSpeaker.googleCalendar?.connected,
          //   availability: updatedSpeaker.availability,
          //   availabilityCount: updatedSpeaker.availability?.length,
          // })
          // console.log("[BookSessionDialog] Speaker calendar timezone:", updatedSpeaker.googleCalendar?.timezone)
          // console.log("[BookSessionDialog] Speaker availability (raw from backend):", updatedSpeaker.availability)
          
          setSpeakerDetails(updatedSpeaker)
          
          // Update timezone to speaker's calendar timezone when fetched
          if (updatedSpeaker.googleCalendar?.timezone) {
            setSelectedTimezone(updatedSpeaker.googleCalendar.timezone)
          }
          
          // Log availability times to verify they're in UTC
          if (updatedSpeaker.availability && updatedSpeaker.availability.length > 0) {
            updatedSpeaker.availability.forEach((avail: SpeakerAvailability) => {
              if (avail.isAvailable) {
                // console.log(`Availability ${avail.day}: ${avail.startTime} - ${avail.endTime} (should be UTC)`)
              }
            })
          }
        }
      } catch (error) {
        console.error("Error loading speaker profile:", error)
        if (isMounted) {
        setBookingError(t("speakerProfile.bookSession.failed"))
        }
      } finally {
        if (isMounted) {
        setIsLoadingDetails(false)
        }
      }
    }

    fetchSpeakerDetails()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, speakerId])

  // Get day name from date string - use UTC to avoid timezone issues
  const getDayNameFromDate = (dateString: string): string => {
    if (!dateString) return ""
    // Parse date string as UTC to avoid local timezone issues
    // dateString is in format YYYY-MM-DD
    const [year, month, day] = dateString.split("-").map(Number)
    // Create date in UTC (month is 0-indexed in Date constructor)
    const date = new Date(Date.UTC(year, month - 1, day))
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[date.getUTCDay()]
  }

  const isDateAvailable = (dateString: string): boolean => {
    if (!dateString || !convertedAvailability || convertedAvailability.length === 0) return false
    // Use UTC-based day calculation for consistency
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = convertedAvailability.find((avail) => avail.day === dayName)
    return dayAvailability?.isAvailable || false
  }

  const generateTimeSlots = (dateString: string): string[] => {
    if (!dateString || !speakerDetails?.availability || speakerDetails.availability.length === 0) return []
    
    // Get day name based on UTC date (consistent day calculation)
    const dayName = getDayNameFromDate(dateString)
    const originalDayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)

    if (!originalDayAvailability || !originalDayAvailability.isAvailable || !originalDayAvailability.startTime || !originalDayAvailability.endTime) {
      return []
    }

    // Convert availability times from speaker's timezone to selected timezone
    // Use the specific date for accurate DST conversion
    let startTime: string
    let endTime: string
    
    // console.log(selectedTimezone, speakerTimezone, "=========")
    if (selectedTimezone === speakerTimezone) {
      // No conversion needed
      startTime = originalDayAvailability.startTime
      endTime = originalDayAvailability.endTime
    } else {
      // Convert using the specific date for accurate timezone conversion
      startTime = convertTimeToTimezone(
        originalDayAvailability.startTime,
        dateString,
        speakerTimezone,
        selectedTimezone
      )
      endTime = convertTimeToTimezone(
        originalDayAvailability.endTime,
        dateString,
        speakerTimezone,
        selectedTimezone
      )
    }

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    // Handle cases where end time is before start time (crosses midnight)
    let adjustedEndMinutes = endMinutes
    if (endMinutes < startMinutes) {
      adjustedEndMinutes = endMinutes + 1440 // Add 24 hours
    }

    const slots: string[] = []
    for (let current = startMinutes; current <= adjustedEndMinutes - 30; current += 30) {
      const hour = Math.floor(current / 60) % 24 // Handle overflow
      const minute = current % 60
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
    }

    return slots
  }

  const validateBookingTime = (date: string, time: string): string | null => {
    if (!date || !time || !speakerDetails?.availability || speakerDetails.availability.length === 0) return null

    const dayName = getDayNameFromDate(date)
    const originalDayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)

    if (!originalDayAvailability || !originalDayAvailability.isAvailable) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t("speakerProfile.bookSession.unavailableDay")} ${dayLabel}.`
    }

    // Convert availability times from speaker's timezone to selected timezone
    // Use the specific date for accurate DST conversion
    let startTime: string
    let endTime: string
    
    if (selectedTimezone === speakerTimezone) {
      // console.log(originalDayAvailability.startTime, originalDayAvailability.endTime, "=========")
      // No conversion needed
      startTime = originalDayAvailability.startTime || "00:00"
      endTime = originalDayAvailability.endTime || "23:59"
    } else {
      // Convert using the specific date for accurate timezone conversion
      startTime = convertTimeToTimezone(
        originalDayAvailability.startTime || "00:00",
        date,
        speakerTimezone,
        selectedTimezone
      )
      endTime = convertTimeToTimezone(
        originalDayAvailability.endTime || "23:59",
        date,
        speakerTimezone,
        selectedTimezone
      )
    }

    const [requestedHour, requestedMinute] = time.split(":").map(Number)
    const requestedMinutes = requestedHour * 60 + requestedMinute
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    const sessionEndMinutes = requestedMinutes + 30

    if (requestedMinutes < startMinutes || sessionEndMinutes > endMinutes) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t("speakerProfile.bookSession.timeNotInRange")} ${startTime} ${t(
        "dashboard.availability.to",
      )} ${endTime} ${t("dashboard.availability.to")} ${dayLabel}.`
    }

    return null
  }

  const unavailableDayMatchers = useMemo<Matcher[]>(() => {
    // Use original availability for day availability check (days don't change with timezone)
    if (!speakerDetails?.availability) return []
    const unavailableDays = speakerDetails.availability
      .filter((avail) => !avail.isAvailable)
      .map((avail) => dayNameToIndex[avail.day])
      .filter((value) => typeof value === "number")

    if (unavailableDays.length === 0) return []
    return [{ dayOfWeek: unavailableDays }]
  }, [speakerDetails?.availability])

  const timeSlots = useMemo(() => {
    if (!formData.date) return []
    return generateTimeSlots(formData.date)
  }, [formData.date, speakerDetails?.availability, selectedTimezone, speakerTimezone])

  const scheduleReady = Boolean(formData.date && formData.time)
  const detailsReady = Boolean(formData.title?.trim())

  const handleNextStep = () => {
    if (currentStep === 0) {
      const availabilityError = validateBookingTime(formData.date, formData.time)
      if (availabilityError) {
        setBookingError(availabilityError)
        return
      }
    }

    if (currentStep === 1 && !detailsReady) {
      setBookingError(t("speakerProfile.bookSession.allFieldsRequired"))
      return
    }

    setBookingError("")
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevStep = () => {
    setBookingError("")
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleBooking = async () => {
    if (!speakerId) {
      setBookingError(t("speakerProfile.bookSession.failed"))
      return
    }

    if (!formData.title || !formData.date || !formData.time) {
      setBookingError(t("speakerProfile.bookSession.allFieldsRequired"))
      return
    }

    const availabilityError = validateBookingTime(formData.date, formData.time)
    if (availabilityError) {
      setBookingError(availabilityError)
      return
    }

    const topics = [formData.topic1, formData.topic2].filter((topic) => topic.trim() !== "")
    if (topics.length > 2) {
      setBookingError(t("speakerProfile.bookSession.maxTopics"))
      return
    }

    try {
      setIsBooking(true)
      setBookingError("")

      // Convert the selected time from selected timezone back to speaker's timezone
      // The selected time is in the selected timezone, but backend expects it in speaker's timezone
      const timeInSpeakerTimezone = convertTimeToTimezone(
        formData.time,
        formData.date,
        selectedTimezone,
        speakerTimezone
      )

      await learnerService.bookSession({
        speakerId,
        title: formData.title,
        date: formData.date,
        time: timeInSpeakerTimezone,
        topics,
      })

      setBookingSuccess(true)
      if (onBooked) {
        onBooked()
      }

      if (!disableAutoCloseRedirect) {
        setTimeout(() => {
          setOpen(false)
          router.push("/learners/profile")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error booking session:", error)
      setBookingError(error?.message || t("speakerProfile.bookSession.failed"))
    } finally {
      setIsBooking(false)
    }
  }

  const renderAvailability = () => {
    if (isLoadingDetails) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )
    }

    // Use converted availability for display (shows times in selected timezone)
    if (!convertedAvailability || convertedAvailability.length === 0) {
      return (
        <p className="text-xs text-muted-foreground">
          {t("speakerProfile.bookSession.notAvailable")}
        </p>
      )
    }

    return daysOfWeek.map((day) => {
      const dayAvailability = convertedAvailability.find((avail) => avail.day === day.key)
      const isAvailable = dayAvailability?.isAvailable || false
      return (
        <div
          key={day.key}
          className={`flex items-center justify-between text-xs p-1.5 rounded border ${
            isAvailable ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted border-border opacity-70"
          }`}
        >
          <span className={isAvailable ? "text-emerald-500" : "text-muted-foreground"}>{t(day.translationKey as any)}</span>
          {isAvailable ? (
            <span className="text-emerald-400 text-xs">
              {dayAvailability?.startTime} - {dayAvailability?.endTime}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">{t("speakerProfile.bookSession.notAvailable")}</span>
          )}
        </div>
      )
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (!isAuthenticated) {
        router.push("/auth")
        return
      }
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const dialogTrigger: ReactNode = (() => {
    const defaultTrigger = (
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer px-6 py-2">
        <CalendarIcon className="w-4 h-4 mr-2" />
        {t("speakerProfile.bookSession")}
      </Button>
    )

    if (!speakerId) {
      if (trigger && isValidElement(trigger)) {
        return cloneElement(trigger, { disabled: true } as any)
      }
      return cloneElement(defaultTrigger, { disabled: true } as any)
    }

    if (trigger && isValidElement(trigger)) {
      return trigger
    }

    return defaultTrigger
  })()

  const renderStepContent = () => {
    if (bookingSuccess) {
      return (
        <div className="text-center py-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{t("speakerProfile.bookSession.success.title")}</h3>
          <p className="text-muted-foreground text-sm">{t("speakerProfile.bookSession.success.message")}</p>
        </div>
      )
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-lg px-4 py-3 border border-border">
              <Label className="text-foreground font-semibold block text-sm mb-2">
                Timezone
              </Label>
              <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={timezoneOpen}
                    className="w-full justify-between"
                  >
                    {selectedTimezone
                      ? availableTimezones.find((tz) => tz.value === selectedTimezone)?.label || formatTimezoneLabel(selectedTimezone)
                      : "Select timezone..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandList>
                      <CommandEmpty>No timezone found.</CommandEmpty>
                      <CommandGroup>
                        {availableTimezones.map((tz) => (
                          <CommandItem
                            key={tz.value}
                            value={tz.value}
                            onSelect={() => {
                              setSelectedTimezone(tz.value === selectedTimezone ? selectedTimezone : tz.value)
                setFormData((prev) => ({ ...prev, time: "" })) // Reset time when timezone changes
                setBookingError("")
                              setTimezoneOpen(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedTimezone === tz.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                      {tz.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-2">
                {speakerDetails?.googleCalendar?.timezone && selectedTimezone === speakerDetails.googleCalendar.timezone
                  ? `Using speaker's timezone: ${speakerTimezoneLabel}`
                  : `Times are displayed in ${availableTimezones.find(tz => tz.value === selectedTimezone)?.label || formatTimezoneLabel(selectedTimezone)}`}
              </p>
            </div>
            <div className="grid gap-1 lg:grid-cols-[6fr_4fr]">
              <div className="bg-card rounded-lg border border-border mx-auto">
                {/* <Label className="text-white font-semibold mb-3 block text-sm">
                  {t("speakerProfile.bookSession.date")}
                </Label> */}
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date) return
                    const formatted = formatDateToString(date)
                    if (!isDateAvailable(formatted)) {
                      const dayKey = getDayNameFromDate(formatted)
                      const dayTranslation = daysOfWeek.find((d) => d.key === dayKey)
                      const dayLabel = dayTranslation
                        ? t(dayTranslation.translationKey as any)
                        : dayKey.charAt(0).toUpperCase() + dayKey.slice(1)
                      setBookingError(`${t("speakerProfile.bookSession.unavailableDay")} ${dayLabel}.`)
                      setFormData((prev) => ({ ...prev, date: "", time: "" }))
                      setSelectedDate(undefined)
                      return
                    }
                    setSelectedDate(date)
                    setFormData((prev) => ({ ...prev, date: formatted, time: "" }))
                    setBookingError("")
                  }}
                  fromDate={new Date()}
                  disabled={unavailableDayMatchers}
                  className="rounded-lg bg-transparent text-foreground"
                />
              </div>

              <div className="space-y-4">
                <div className="bg-card rounded-lg px-4 py-2 border border-border h-full">
                  <Label className="text-foreground font-semibold block text-sm mb-3">
                    {t("speakerProfile.bookSession.time")}
                  </Label>
                  {formData.date ? (
                    timeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                        {timeSlots.map((slot) => {
                          const isSelected = formData.time === slot
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, time: slot }))
                                setBookingError("")
                              }}
                              className={`rounded-md cursor-pointer border px-1 py-1 text-sm transition-all ${
                                isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-muted border-border text-foreground hover:border-primary/60"
                              }`}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-destructive">{t("speakerProfile.bookSession.dateNotAvailable")}</p>
                    )
                  ) : (
                    <p className="text-xs text-muted-foreground">Select a date to view available times.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground">
                {t("speakerProfile.bookSession.sessionTitle")}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(event) => {
                  setFormData((prev) => ({ ...prev, title: event.target.value }))
                  setBookingError("")
                }}
                placeholder={t("speakerProfile.bookSession.sessionTitlePlaceholder")}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 block">
                {t("speakerProfile.bookSession.topics")}
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableTopics.map((topic) => {
                  const isSelected = formData.topic1 === topic || formData.topic2 === topic
                  const canSelect = !formData.topic1 || !formData.topic2
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (formData.topic1 === topic) {
                            setFormData((prev) => ({ ...prev, topic1: "" }))
                          } else {
                            setFormData((prev) => ({ ...prev, topic2: "" }))
                          }
                        } else if (canSelect) {
                          if (!formData.topic1) {
                            setFormData((prev) => ({ ...prev, topic1: topic }))
                          } else {
                            setFormData((prev) => ({ ...prev, topic2: topic }))
                          }
                        }
                      }}
                      disabled={!isSelected && !canSelect}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#7732A1] text-primary-foreground"
                          : "bg-muted border border-border text-muted-foreground hover:border-primary/50"
                      } ${!isSelected && !canSelect ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {topic}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Selected: {(formData.topic1 ? 1 : 0) + (formData.topic2 ? 1 : 0)}/2
              </p>
              {(formData.topic1 || formData.topic2) && (
                <div className="flex flex-wrap gap-2">
                  {formData.topic1 && (
                    <Badge className="bg-primary/15 text-primary border border-primary/30">{formData.topic1}</Badge>
                  )}
                  {formData.topic2 && (
                    <Badge className="bg-primary/15 text-primary border border-primary/30">{formData.topic2}</Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 border border-border text-sm text-foreground space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("speakerProfile.bookSession.date")}</span>
                <span>{formData.date || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("speakerProfile.bookSession.time")}</span>
                <span>{formData.time || "—"} {speakerDetails?.googleCalendar?.timezone && `(${speakerTimezoneLabel})`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("speakerProfile.bookSession.sessionTitle")}</span>
                <span>{formData.title || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("speakerProfile.bookSession.topics")}:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[formData.topic1, formData.topic2].filter(Boolean).length > 0 ? (
                    [formData.topic1, formData.topic2]
                      .filter(Boolean)
                      .map((topic) => (
                        <Badge key={topic as string} className="bg-primary/15 text-primary border border-primary/30">
                          {topic}
                        </Badge>
                      ))
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handlePrevStep}
                disabled={isBooking}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleBooking}
                disabled={isBooking}
                className="bg-[#7732A1] hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("speakerProfile.bookSession.booking")}
                  </>
                ) : (
                  t("speakerProfile.bookSession.confirmBooking")
                )}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="bg-background border-border text-foreground max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-foreground text-xl">{t("speakerProfile.bookSession.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {!bookingSuccess && (
            <div className="flex items-center justify-between gap-4">
              {steps.map((label, index) => {
                const isActive = currentStep === index
                const isCompleted = currentStep > index
                return (
                  <div key={label} className="flex-1 flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        isActive
                          ? "border-primary bg-primary/20 text-primary"
                          : isCompleted
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-600"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                )
              })}
            </div>
          )}

          {renderStepContent()}

          {!bookingSuccess && (
            <>
              {bookingError && <div className="text-destructive text-sm">{bookingError}</div>}
              {currentStep < steps.length - 1 && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="flex-1 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={currentStep === 0 ? !scheduleReady : currentStep === 1 ? !detailsReady : false}
                    className="flex-1 cursor-pointer bg-[#7732A1] hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


