"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  Edit,
  Loader2,
  Save,
  User,
  X,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Unlink,
  CheckCircle2
} from "lucide-react"
import { speakerService, SpeakerAvailability } from "@/lib/services/speakerService"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { getCurrentUser, setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

type CalendarStatus = {
  connected: boolean
  expiresAt: string | null
}

const daysOfWeek = [
  { key: "monday", translationKey: "dashboard.availability.days.monday" },
  { key: "tuesday", translationKey: "dashboard.availability.days.tuesday" },
  { key: "wednesday", translationKey: "dashboard.availability.days.wednesday" },
  { key: "thursday", translationKey: "dashboard.availability.days.thursday" },
  { key: "friday", translationKey: "dashboard.availability.days.friday" },
  { key: "saturday", translationKey: "dashboard.availability.days.saturday" },
  { key: "sunday", translationKey: "dashboard.availability.days.sunday" }
]

const getDefaultAvailability = (): SpeakerAvailability[] =>
  daysOfWeek.map((day) => ({
    day: day.key,
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: false
  }))

const normalizeAvailability = (availability: SpeakerAvailability[]): SpeakerAvailability[] => {
  const defaults = getDefaultAvailability()
  const availabilityMap = new Map<string, SpeakerAvailability>()

  availability.forEach((item) => {
    availabilityMap.set(item.day, {
      day: item.day,
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "17:00",
      isAvailable: item.isAvailable ?? false
    })
  })

  return defaults.map((day) => availabilityMap.get(day.day) || day)
}

export default function SpeakerProfilePage() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [bio, setBio] = useState("")
  const [age, setAge] = useState<string>("")
  const [cost, setCost] = useState<string>("")
  const [interests, setInterests] = useState<string[]>([])
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [availability, setAvailability] = useState<SpeakerAvailability[]>(getDefaultAvailability())

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)

  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus>({
    connected: false,
    expiresAt: null
  })
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false)

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await speakerService.getTopics()
        if (response.success && response.data.topics) {
          setAvailableTopics(response.data.topics)
        }
      } catch (err) {
        console.error("Error loading topics:", err)
      }
    }

    loadTopics()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const calendarParam = params.get("calendar")
      if (calendarParam === "connected") {
        setError("")
        refreshCalendarStatus()
        window.history.replaceState({}, "", window.location.pathname)
      } else if (calendarParam === "error") {
        setError(t("dashboard.errors.calendarConnectFailed"))
        window.history.replaceState({}, "", window.location.pathname)
      }
    }
  }, [t])

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      setError(t("dashboard.errors.loginRequired"))
      setIsLoading(false)
      return
    }

    if (!user) {
      dispatch(getCurrentUser())
      return
    }

    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, authLoading])

  const fetchProfileData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError("")

      const response = await speakerService.getDashboard()
      if (!response.success) {
        throw new Error("Failed to load profile")
      }

      const dashboardProfile = response.data?.profile

      if (dashboardProfile) {
        setBio(dashboardProfile.bio || "")
        setAge(dashboardProfile.age ? dashboardProfile.age.toString() : "")
        setCost(dashboardProfile.cost ? dashboardProfile.cost.toString() : "")
        setAvailability(normalizeAvailability(dashboardProfile.availability || []))
      } else {
        setAvailability(getDefaultAvailability())
      }

      setInterests(user.interests || [])
      setAvatarPreview(user.avatar || null)

      await refreshCalendarStatus()
    } catch (err) {
      console.error("Error fetching profile data:", err)
      setError(t("dashboard.errors.loadFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCalendarStatus = async () => {
    try {
      const response = await speakerService.getCalendarStatus()
      if (response.success) {
        setCalendarStatus({
          connected: response.data.connected,
          expiresAt: response.data.expiresAt
        })
      }
    } catch (err) {
      console.error("Error fetching calendar status:", err)
    }
  }

  const handleCalendarConnect = async () => {
    try {
      setIsConnectingCalendar(true)
      const response = await speakerService.getCalendarAuthUrl()
      if (response.success && response.data.authUrl) {
        window.location.href = response.data.authUrl
      }
    } catch (err) {
      console.error("Error connecting calendar:", err)
      setError(t("dashboard.errors.calendarConnectFailed"))
    } finally {
      setIsConnectingCalendar(false)
    }
  }

  const handleCalendarDisconnect = async () => {
    try {
      setIsConnectingCalendar(true)
      const response = await speakerService.disconnectCalendar()
      if (response.success) {
        await refreshCalendarStatus()
      }
    } catch (err) {
      console.error("Error disconnecting calendar:", err)
      setError(t("dashboard.errors.calendarDisconnectFailed"))
    } finally {
      setIsConnectingCalendar(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest)
      }

      if (prev.length >= 4) {
        return prev
      }

      return [...prev, interest]
    })
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const avatarUrl = await speakerService.uploadAvatar(file)
      setAvatarPreview(avatarUrl)

      if (user) {
        dispatch(
          setUser({
            ...user,
            avatar: avatarUrl
          })
        )
      }
    } catch (err) {
      console.error("Error uploading avatar:", err)
      setError(t("dashboard.errors.avatarFailed"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true)
      setError("")

      await speakerService.updateInterests(interests)
      await speakerService.updateProfile({
        bio,
        age: age ? Number(age) : undefined,
        cost: cost ? Number(cost) : undefined
      })

      if (user) {
        dispatch(
          setUser({
            ...user,
            bio,
            age: age ? Number(age) : undefined,
            cost: cost ? Number(cost) : undefined,
            interests
          })
        )
      }

      setIsEditingProfile(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError(t("dashboard.errors.saveFailed"))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleAvailabilityToggle = (index: number) => {
    setAvailability((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        isAvailable: !next[index].isAvailable
      }
      return next
    })
  }

  const handleTimeChange = (index: number, field: "startTime" | "endTime", value: string) => {
    setAvailability((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: value
      }
      return next
    })
  }

  const handleSaveAvailability = async () => {
    try {
      setIsSavingAvailability(true)
      setError("")
      await speakerService.updateAvailability(availability)
    } catch (err) {
      console.error("Error saving availability:", err)
      setError(t("dashboard.errors.availabilityFailed"))
    } finally {
      setIsSavingAvailability(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">{t("dashboard.profile.title")}</h1>
          <p className="text-gray-300">{t("dashboard.profile.description")}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">{t("dashboard.profile.title")}</CardTitle>
                <CardDescription className="text-gray-300">
                  {t("dashboard.profile.description")}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingProfile((prev) => !prev)}
                className="text-white hover:bg-white/20 cursor-pointer"
              >
                {isEditingProfile ? <X /> : <Edit />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white/10 backdrop-blur">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Speaker avatar"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {isEditingProfile && (
                    <label className="absolute -bottom-2 right-4 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
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
                  <h2 className="text-xl font-semibold text-white">
                    {user?.firstname} {user?.lastname}
                  </h2>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
                {!isEditingProfile && interests.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-200 border-purple-400/30"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <Label className="text-white">{t("dashboard.profile.bio")}</Label>
                  {isEditingProfile ? (
                    <Textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder={t("dashboard.profile.bioPlaceholder")}
                    />
                  ) : (
                    <p className="text-sm text-gray-300">{bio || t("dashboard.profile.noBio")}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Age</Label>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        min={18}
                        max={120}
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your age"
                      />
                    ) : (
                      <p className="text-sm text-gray-300">{age ? `${age}` : "—"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Cost per Session (USD)</Label>
                    {isEditingProfile ? (
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={cost}
                        onChange={(event) => setCost(event.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter hourly rate"
                      />
                    ) : (
                      <p className="text-sm text-gray-300">{cost ? `$${cost}` : "—"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Topics & Interests</Label>
                  {isEditingProfile ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {availableTopics.map((topic) => {
                          const isSelected = interests.includes(topic)
                          const disabled = !isSelected && interests.length >= 4
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => handleInterestToggle(topic)}
                              disabled={disabled}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white border border-purple-400/80"
                                  : "bg-white/10 border border-white/20 text-gray-300 hover:border-purple-400/50"
                              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {topic}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-gray-400">Select up to 4 interests</p>
                    </>
                  ) : interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          className="bg-purple-500/20 text-purple-200 border-purple-400/30"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No interests selected.</p>
                  )}
                </div>

                {isEditingProfile && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile || isUploading}
                      className="bg-gradient-to-r from-purple-600 to-purple-500 cursor-pointer"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("dashboard.profile.saving")}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t("dashboard.profile.save")}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-300" />
                  <CardTitle className="text-white text-base">
                    {t("dashboard.calendar.title")}
                  </CardTitle>
                </div>
                {calendarStatus.connected && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </div>
              <CardDescription className="text-gray-300">
                {t("dashboard.calendar.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {calendarStatus.connected ? (
                <>
                  <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-sm text-green-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("dashboard.calendar.connected")}
                  </div>
                  {calendarStatus.expiresAt && (
                    <p className="text-xs text-gray-400">
                      {t("dashboard.calendar.expires")}{" "}
                      {new Date(calendarStatus.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    disabled={isConnectingCalendar}
                    onClick={handleCalendarDisconnect}
                    className="w-full border-red-500/50 text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    {isConnectingCalendar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("dashboard.calendar.disconnecting")}
                      </>
                    ) : (
                      <>
                        <Unlink className="mr-2 h-4 w-4" />
                        {t("dashboard.calendar.disconnect")}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-sm text-yellow-200">
                    {t("dashboard.calendar.notConnected")}
                  </div>
                  <Button
                    disabled={isConnectingCalendar}
                    onClick={handleCalendarConnect}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 cursor-pointer"
                  >
                    {isConnectingCalendar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("dashboard.calendar.connecting")}
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {t("dashboard.calendar.connect")}
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-base">
                {t("dashboard.availability.title")}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t("dashboard.availability.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availability.map((day, index) => {
                const dayMeta = daysOfWeek.find((item) => item.key === day.day)
                const label = dayMeta ? t(dayMeta.translationKey as any) : day.day
                return (
                  <div key={day.day} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{label}</span>
                      <Switch
                        checked={day.isAvailable}
                        onCheckedChange={() => handleAvailabilityToggle(index)}
                      />
                    </div>
                    {day.isAvailable && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={day.startTime || "09:00"}
                            onChange={(event) => handleTimeChange(index, "startTime", event.target.value)}
                            className="bg-white/10 border-white/20 text-white h-9 text-sm"
                          />
                          <span className="text-gray-400 text-xs">{t("dashboard.availability.to")}</span>
                          <Input
                            type="time"
                            value={day.endTime || "17:00"}
                            onChange={(event) => handleTimeChange(index, "endTime", event.target.value)}
                            className="bg-white/10 border-white/20 text-white h-9 text-sm"
                          />
                      </div>
                    )}
                  </div>
                )
              })}
              <Button
                onClick={handleSaveAvailability}
                disabled={isSavingAvailability}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 cursor-pointer"
              >
                {isSavingAvailability ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("dashboard.availability.saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("dashboard.availability.save")}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}