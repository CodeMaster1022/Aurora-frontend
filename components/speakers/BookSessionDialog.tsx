"use client"

import { cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar as DateCalendar } from "@/components/ui/calendar"
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

export function BookSessionDialog({
  speaker,
  trigger,
  onBooked,
  disableAutoCloseRedirect = false,
}: BookSessionDialogProps) {
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

  useEffect(() => {
    setSpeakerDetails(speaker)
  }, [speaker])

  const speakerId = speakerDetails?._id ?? speaker?._id

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_STATE)
      setBookingError("")
      setBookingSuccess(false)
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
    if (!open || !speakerId) return

    const hasAvailability = speakerDetails?.availability && speakerDetails.availability.length > 0
    if (hasAvailability) return

    const fetchSpeakerDetails = async () => {
      try {
        setIsLoadingDetails(true)
        const response = await learnerService.getSpeakerProfile(speakerId)
        if (response.success && response.data.speaker) {
          setSpeakerDetails((prev) => ({
            ...response.data.speaker,
            // Preserve any existing data such as custom trigger names if already present
            firstname: response.data.speaker.firstname ?? prev?.firstname,
            lastname: response.data.speaker.lastname ?? prev?.lastname,
          }))
        }
      } catch (error) {
        console.error("Error loading speaker profile:", error)
        setBookingError(t("speakerProfile.bookSession.failed"))
      } finally {
        setIsLoadingDetails(false)
      }
    }

    fetchSpeakerDetails()
  }, [open, speakerId, speakerDetails?.availability, t])

  const getDayNameFromDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[date.getDay()]
  }

  const isDateAvailable = (dateString: string): boolean => {
    if (!dateString || !speakerDetails?.availability) return false
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)
    return dayAvailability?.isAvailable || false
  }

  const getTimeConstraints = (dateString: string): { min: string; max: string } => {
    if (!dateString || !speakerDetails?.availability) {
      return { min: "00:00", max: "23:59" }
    }

    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)

    if (!dayAvailability || !dayAvailability.isAvailable) {
      return { min: "00:00", max: "00:00" }
    }

    const startTime = dayAvailability.startTime || "00:00"
    const endTime = dayAvailability.endTime || "23:59"

    const [endHour, endMin] = endTime.split(":").map(Number)
    const endMinutes = endHour * 60 + endMin
    const maxMinutes = endMinutes - 30
    const maxHour = Math.floor(maxMinutes / 60)
    const maxMin = maxMinutes % 60
    const maxTime = `${String(maxHour).padStart(2, "0")}:${String(maxMin).padStart(2, "0")}`

    return { min: startTime, max: maxTime }
  }

  const validateBookingTime = (date: string, time: string): string | null => {
    if (!date || !time || !speakerDetails?.availability) return null

    const dayName = getDayNameFromDate(date)
    const dayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)

    if (!dayAvailability || !dayAvailability.isAvailable) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t("speakerProfile.bookSession.unavailableDay")} ${dayLabel}.`
    }

    const [requestedHour, requestedMinute] = time.split(":").map(Number)
    const requestedMinutes = requestedHour * 60 + requestedMinute
    const [startHour, startMinute] = (dayAvailability.startTime || "00:00").split(":").map(Number)
    const [endHour, endMinute] = (dayAvailability.endTime || "23:59").split(":").map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    const sessionEndMinutes = requestedMinutes + 30

    if (requestedMinutes < startMinutes || sessionEndMinutes > endMinutes) {
      const dayTranslation = daysOfWeek.find((d) => d.key === dayName)
      const dayLabel = dayTranslation ? t(dayTranslation.translationKey as any) : dayName.charAt(0).toUpperCase() + dayName.slice(1)
      return `${t("speakerProfile.bookSession.timeNotInRange")} ${dayAvailability.startTime} ${t(
        "dashboard.availability.to",
      )} ${dayAvailability.endTime} ${t("dashboard.availability.to")} ${dayLabel}.`
    }

    return null
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

      await learnerService.bookSession({
        speakerId,
        title: formData.title,
        date: formData.date,
        time: formData.time,
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
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      )
    }

    if (!speakerDetails?.availability || speakerDetails.availability.length === 0) {
      return (
        <p className="text-xs text-gray-400">
          {t("speakerProfile.bookSession.notAvailable")}
        </p>
      )
    }

    return daysOfWeek.map((day) => {
      const dayAvailability = speakerDetails.availability?.find((avail) => avail.day === day.key)
      const isAvailable = dayAvailability?.isAvailable || false
      return (
        <div
          key={day.key}
          className={`flex items-center justify-between text-xs p-1.5 rounded ${
            isAvailable ? "bg-green-500/10 border border-green-500/20" : "bg-gray-500/10 border border-gray-500/20 opacity-50"
          }`}
        >
          <span className={isAvailable ? "text-green-300" : "text-gray-400"}>{t(day.translationKey as any)}</span>
          {isAvailable ? (
            <span className="text-green-400 text-xs">
              {dayAvailability?.startTime} - {dayAvailability?.endTime}
            </span>
          ) : (
            <span className="text-gray-500 text-xs">{t("speakerProfile.bookSession.notAvailable")}</span>
          )}
        </div>
      )
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (!isAuthenticated || user?.role !== "learner") {
        router.push("/auth/student-auth")
        return
      }
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const dialogTrigger: ReactNode = (() => {
    const defaultTrigger = (
      <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white cursor-pointer px-6 py-2">
        <Calendar className="w-4 h-4 mr-2" />
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="bg-[#1A1A33] border-white/20 text-white max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-white text-xl">{t("speakerProfile.bookSession.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {bookingSuccess ? (
            <div className="text-center py-3">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-400 mb-2" />
              <h3 className="text-lg font-semibold text-white mb-2">{t("speakerProfile.bookSession.success.title")}</h3>
              <p className="text-gray-300 text-sm">{t("speakerProfile.bookSession.success.message")}</p>
            </div>
          ) : (
            <>
              {speakerDetails?.firstname && speakerDetails?.lastname && (
                <p className="text-sm text-gray-300">
                  {speakerDetails.firstname} {speakerDetails.lastname}
                </p>
              )}

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <Label className="text-white font-semibold mb-2 block text-sm">
                  {t("speakerProfile.bookSession.availability")}
                </Label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">{renderAvailability()}</div>
              </div>

              <div>
                <Label htmlFor="title" className="text-white">
                  {t("speakerProfile.bookSession.sessionTitle")}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder={t("speakerProfile.bookSession.sessionTitlePlaceholder")}
                  className="bg-white/10 border-white/20 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-white">
                  {t("speakerProfile.bookSession.date")}
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(event) => {
                    const selectedDate = event.target.value
                    if (selectedDate && !isDateAvailable(selectedDate)) {
                      const dayKey = getDayNameFromDate(selectedDate)
                      const dayTranslation = daysOfWeek.find((d) => d.key === dayKey)
                      const dayLabel = dayTranslation
                        ? t(dayTranslation.translationKey as any)
                        : dayKey.charAt(0).toUpperCase() + dayKey.slice(1)
                      setBookingError(`${t("speakerProfile.bookSession.unavailableDay")} ${dayLabel}.`)
                      setFormData((prev) => ({ ...prev, date: "", time: "" }))
                    } else {
                      setFormData((prev) => ({ ...prev, date: selectedDate, time: "" }))
                      setBookingError("")
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-white/10 border-white/20 text-white mt-2"
                />
                {formData.date && speakerDetails?.availability && (() => {
                  const dayName = getDayNameFromDate(formData.date)
                  const dayAvailability = speakerDetails.availability?.find((avail) => avail.day === dayName)
                  if (dayAvailability && dayAvailability.isAvailable) {
                    return (
                      <p className="text-xs text-green-400 mt-1">
                        {t("speakerProfile.bookSession.dateAvailable")} {dayAvailability.startTime} - {dayAvailability.endTime}
                      </p>
                    )
                  }
                  return (
                    <p className="text-xs text-red-400 mt-1">
                      {t("speakerProfile.bookSession.dateNotAvailable")}
                    </p>
                  )
                })()}
              </div>

              <div>
                <Label htmlFor="time" className="text-white">
                  {t("speakerProfile.bookSession.time")}
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(event) => {
                    setFormData((prev) => ({ ...prev, time: event.target.value }))
                    setBookingError("")
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
                      {t("speakerProfile.bookSession.timeHint")} {min} {t("dashboard.availability.to")} {max}{" "}
                      {t("speakerProfile.bookSession.topicsMax")}
                    </p>
                  )
                })()}
              </div>

              <div>
                <Label className="text-white mb-2 block">
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
                            ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-2 border-purple-400"
                            : "bg-white/10 border border-white/20 text-gray-300 hover:border-purple-400/50"
                        } ${!isSelected && !canSelect ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {topic}
                      </button>
                    )
                  })}
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

              {bookingError && <div className="text-red-400 text-sm">{bookingError}</div>}

              <Button
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


