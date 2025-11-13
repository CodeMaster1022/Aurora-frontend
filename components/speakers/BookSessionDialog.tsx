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
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>()

  useEffect(() => {
    setSpeakerDetails(speaker)
  }, [speaker])

  const speakerId = speakerDetails?._id ?? speaker?._id

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_STATE)
      setBookingError("")
      setBookingSuccess(false)
      setCurrentStep(0)
      setSelectedDate(undefined)
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

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const generateTimeSlots = (dateString: string): string[] => {
    if (!dateString || !speakerDetails?.availability) return []
    const dayName = getDayNameFromDate(dateString)
    const dayAvailability = speakerDetails.availability.find((avail) => avail.day === dayName)

    if (!dayAvailability || !dayAvailability.isAvailable || !dayAvailability.startTime || !dayAvailability.endTime) {
      return []
    }

    const [startHour, startMinute] = dayAvailability.startTime.split(":").map(Number)
    const [endHour, endMinute] = dayAvailability.endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    const slots: string[] = []
    for (let current = startMinutes; current <= endMinutes - 30; current += 30) {
      const hour = Math.floor(current / 60)
      const minute = current % 60
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
    }

    return slots
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

  const unavailableDayMatchers = useMemo<Matcher[]>(() => {
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
  }, [formData.date, speakerDetails?.availability])

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
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )
    }

    if (!speakerDetails?.availability || speakerDetails.availability.length === 0) {
      return (
        <p className="text-xs text-muted-foreground">
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
                <span>{formData.time || "—"}</span>
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


