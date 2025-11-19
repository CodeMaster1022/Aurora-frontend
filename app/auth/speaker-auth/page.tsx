"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Loader2, Upload, ArrowLeft, Calendar, Clock, CheckCircle2, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, setUser } from "@/lib/store/authSlice"
import { authService } from "@/lib/services/authService"
import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { SpeakerAvailability } from "@/lib/services/speakerService"

const emailRegex = /^[^\s@]+@gmail\.com$/i
const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type RegisterStep = 1 | 2 | 3

export default function SpeakerAuthPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { error: authError, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" })
  const [localError, setLocalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [registerStep, setRegisterStep] = useState<RegisterStep>(1)
  const [fullName, setFullName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoName, setPhotoName] = useState("")
  const [availability, setAvailability] = useState<SpeakerAvailability[]>(() => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return daysOfWeek.map(day => ({
      day,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false
    }))
  })
  const [registerErrors, setRegisterErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    location: "",
    bio: "",
    photo: "",
    availability: "",
  })
  const [registerError, setRegisterError] = useState("")

  const isLoading = isSubmitting || authLoading
  const displayError = activeTab === "login" ? localError || authError || "" : ""

  const validateLoginEmail = (value: string) => {
    if (!value.trim()) return t("auth.validation.emailRequired")
    if (!generalEmailRegex.test(value)) return t("auth.validation.emailInvalid")
    return ""
  }

  const validateLoginPassword = (value: string) => {
    if (!value.trim()) return t("auth.validation.passwordRequired")
    return ""
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const emailError = validateLoginEmail(loginEmail)
    const passwordError = validateLoginPassword(loginPassword)
    setLoginErrors({ email: emailError, password: passwordError })
    if (emailError || passwordError) return

    setIsSubmitting(true)
    setLocalError("")
    try {
      const result = await dispatch(loginUser({ email: loginEmail, password: loginPassword }))
      if (loginUser.fulfilled.match(result)) {
        const role = result.payload.user?.role
        if (role === "speaker") {
          router.push("/speakers/profile")
        } else if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/learners/profile")
        }
      } else if (loginUser.rejected.match(result)) {
        setLocalError((result.payload as string) || t("auth.errors.loginFailed"))
      }
    } catch (error) {
      console.error("Login error", error)
      setLocalError(t("auth.errors.loginUnknown"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStepOne = () => {
    const errors = {
      fullName: fullName.trim() ? "" : t("auth.validation.fullNameRequired"),
      email: registerEmail.trim()
        ? emailRegex.test(registerEmail)
          ? ""
          : t("auth.validation.gmailRequired")
        : t("auth.validation.emailRequired"),
      password: registerPassword.length >= 8 ? "" : t("auth.signup.validate.passwordMin"),
      confirmPassword: confirmPassword.trim()
        ? confirmPassword === registerPassword
          ? ""
          : t("auth.validation.passwordsDoNotMatch")
        : t("auth.validation.confirmPasswordRequired"),
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const validateStepTwo = () => {
    const errors = {
      birthDate: birthDate ? "" : t("auth.validation.birthDateRequired"),
      location: location.trim() ? "" : t("auth.validation.cityRequired"),
      bio: bio.trim() ? "" : t("auth.validation.bioRequired"),
      photo: photo ? "" : t("auth.validation.photoRequired"),
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const validateStepThree = () => {
    const hasAvailableDay = availability.some(day => day.isAvailable)
    const errors = {
      availability: hasAvailableDay ? "" : t("auth.speaker.register.step3.availabilityRequired"),
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const handleNextStep = () => {
    if (registerStep === 1 && validateStepOne()) {
      setRegisterError("")
      setRegisterStep(2)
    } else if (registerStep === 2 && validateStepTwo()) {
      setRegisterError("")
      setRegisterStep(3)
    }
  }

  const handleBackStep = () => {
    if (registerStep === 3) {
      setRegisterStep(2)
    } else if (registerStep === 2) {
      setRegisterStep(1)
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (registerStep === 3) {
      if (!validateStepThree()) return
    } else {
      if (!validateStepTwo()) return
    }

    setIsSubmitting(true)
    setRegisterError("")
    try {
      const [firstName = "", ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || firstName
      const ageValue = birthDate ? Math.max(18, Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))) : undefined
      const meetingPreference = bio ? bio : undefined

      const response = await authService.registerSpeaker({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: confirmPassword,
        interests: [],
        meetingPreference,
        location: location || undefined,
        age: ageValue,
        bio: bio || undefined,
        avatar: photo ?? undefined,
        availability: availability,
        termsAccepted: true,
        privacyAccepted: true,
      })

      if (response.success && response.data) {
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        router.push("/speakers/profile")
      }
    } catch (error) {
      console.error("Speaker signup error", error)
      setRegisterError(error instanceof Error ? error.message : t("auth.errors.registerFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvailabilityToggle = (index: number) => {
    const updated = [...availability]
    updated[index] = { ...updated[index], isAvailable: !updated[index].isAvailable }
    setAvailability(updated)
    setRegisterErrors((prev) => ({ ...prev, availability: "" }))
  }

  const handleTimeChange = (index: number, field: "startTime" | "endTime", value: string) => {
    const updated = [...availability]
    updated[index] = { ...updated[index], [field]: value }
    setAvailability(updated)
  }

  const daysOfWeek = [
    { key: "monday", translationKey: 'dashboard.availability.days.monday' },
    { key: "tuesday", translationKey: 'dashboard.availability.days.tuesday' },
    { key: "wednesday", translationKey: 'dashboard.availability.days.wednesday' },
    { key: "thursday", translationKey: 'dashboard.availability.days.thursday' },
    { key: "friday", translationKey: 'dashboard.availability.days.friday' },
    { key: "saturday", translationKey: 'dashboard.availability.days.saturday' },
    { key: "sunday", translationKey: 'dashboard.availability.days.sunday' }
  ]

  const availableDaysCount = availability.filter(day => day.isAvailable).length

  const handleSelectWeekdays = () => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    const updated = availability.map(day => 
      weekdays.includes(day.day) 
        ? { ...day, isAvailable: true }
        : day
    )
    setAvailability(updated)
    setRegisterErrors((prev) => ({ ...prev, availability: "" }))
  }

  const handleClearAll = () => {
    const updated = availability.map(day => ({ ...day, isAvailable: false }))
    setAvailability(updated)
    setRegisterErrors((prev) => ({ ...prev, availability: "" }))
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoName(file.name)
      setRegisterErrors((prev) => ({ ...prev, photo: "" }))
      setRegisterError("")
    }
  }

  const resetRegisterTab = () => {
    setRegisterStep(1)
    setFullName("")
    setRegisterEmail("")
    setRegisterPassword("")
    setConfirmPassword("")
    setBirthDate("")
    setLocation("")
    setBio("")
    setPhoto(null)
    setPhotoName("")
    setAvailability(() => {
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      return daysOfWeek.map(day => ({
        day,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false
      }))
    })
    setRegisterErrors({ fullName: "", email: "", password: "", confirmPassword: "", birthDate: "", location: "", bio: "", photo: "", availability: "" })
    setRegisterError("")
  }

  const changeTab = (tab: "login" | "register") => {
    setActiveTab(tab)
    setLocalError("")
    setLoginErrors({ email: "", password: "" })
    setRegisterError("")
    if (tab === "register") {
      resetRegisterTab()
    }
  }

  return (
    <div className="w-full px-4"> 
      <Header/>
      <div className="pb-24 sm:pt-10 sm:pb-10">
        <div className="flex w-full flex-col justify-center px-6 py-6 sm:px-12 lg:w-1/2 mx-auto">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">{t("auth.speaker.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("auth.speaker.subtitle")}</p>
            </div>

            <div className="mb-4 flex items-center overflow-hidden rounded-full border border-border/70 bg-muted/50 p-1 text-sm font-medium text-muted-foreground">
              <button
                type="button"
                onClick={() => changeTab("login")}
                className={`flex-1 rounded-full px-4 py-2 transition cursor-pointer ${
                  activeTab === "login" ? "bg-card text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                {t("auth.signup.login")}
              </button>
              <button
                type="button"
                onClick={() => changeTab("register")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  activeTab === "register" ? "bg-card text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                {t("auth.signup.createAccount")}
              </button>
            </div>

            {displayError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
                {displayError}
              </div>
            )}

            {activeTab === "register" && registerError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
                {registerError}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.email")}</label>
                  <Input
                    type="email"
                    placeholder={t("auth.common.emailPlaceholder")}
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    onBlur={(event) => setLoginErrors((prev) => ({ ...prev, email: validateLoginEmail(event.target.value) }))}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      loginErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {loginErrors.email && <p className="text-xs text-red-500">{loginErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.password")}</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.common.passwordPlaceholder")}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      onBlur={(event) => setLoginErrors((prev) => ({ ...prev, password: validateLoginPassword(event.target.value) }))}
                      className={`h-10 rounded-lg border border-border/70 bg-background pr-12 text-base ${
                        loginErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-xs text-red-500">{loginErrors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec] disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("auth.speaker.login.submitting")}
                    </>
                  ) : (
                    t("auth.signin.submit")
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-8">
                {registerStep === 1 ? (
                  <form onSubmit={(event) => { event.preventDefault(); handleNextStep() }} className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.common.fullName")}</label>
                      <Input
                        type="text"
                        placeholder={t("auth.common.fullNamePlaceholder")}
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.fullName ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.fullName && <p className="text-xs text-red-500">{registerErrors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.speaker.register.step1.emailLabel")}</label>
                      <Input
                        type="email"
                        placeholder={t("auth.speaker.register.step1.emailPlaceholder")}
                        value={registerEmail}
                        onChange={(event) => setRegisterEmail(event.target.value)}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">{t("auth.speaker.register.step1.emailHint")}</p>
                      {registerErrors.email && <p className="text-xs text-red-500">{registerErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.signup.password")}</label>
                      <Input
                        type="password"
                        placeholder={t("auth.common.passwordCreatePlaceholder")}
                        value={registerPassword}
                        onChange={(event) => {
                          setRegisterPassword(event.target.value)
                          // Clear confirm password error if passwords now match
                          if (confirmPassword && registerErrors.confirmPassword) {
                            setRegisterErrors((prev) => ({
                              ...prev,
                              confirmPassword: event.target.value === confirmPassword
                                ? ""
                                : t("auth.validation.passwordsDoNotMatch"),
                            }))
                          }
                        }}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.password && <p className="text-xs text-red-500">{registerErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.common.confirmPassword")}</label>
                      <Input
                        type="password"
                        placeholder={t("auth.common.confirmPasswordPlaceholder")}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value)
                          if (registerErrors.confirmPassword) {
                            setRegisterErrors((prev) => ({
                              ...prev,
                              confirmPassword: event.target.value.trim()
                                ? event.target.value === registerPassword
                                  ? ""
                                  : t("auth.validation.passwordsDoNotMatch")
                                : t("auth.validation.confirmPasswordRequired"),
                            }))
                          }
                        }}
                        onBlur={(event) => {
                          setRegisterErrors((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value.trim()
                              ? event.target.value === registerPassword
                                ? ""
                                : t("auth.validation.passwordsDoNotMatch")
                              : t("auth.validation.confirmPasswordRequired"),
                          }))
                        }}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.confirmPassword ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.confirmPassword && <p className="text-xs text-red-500">{registerErrors.confirmPassword}</p>}
                    </div>

                    <Button type="submit" className="h-10 cursor-pointer w-full rounded-lg bg-[#59248F] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec]">
                      {t("auth.speaker.register.step1.submit")}
                    </Button>
                  </form>
                ) : registerStep === 2 ? (
                  <form onSubmit={(event) => { event.preventDefault(); handleNextStep() }} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">{t("auth.speaker.register.step2.birthDateLabel")}</label>
                        <Input
                          type="date"
                          value={birthDate}
                          onChange={(event) => setBirthDate(event.target.value)}
                          className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                            registerErrors.birthDate ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                          }`}
                        />
                        {registerErrors.birthDate && <p className="text-xs text-red-500">{registerErrors.birthDate}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">{t("auth.speaker.register.step2.cityLabel")}</label>
                        <Input
                          type="text"
                          placeholder={t("auth.speaker.register.step2.cityPlaceholder")}
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                            registerErrors.location ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                          }`}
                        />
                        {registerErrors.location && <p className="text-xs text-red-500">{registerErrors.location}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.speaker.register.step2.bioLabel")}</label>
                      <Textarea
                        placeholder={t("auth.speaker.register.step2.bioPlaceholder")}
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className={`min-h-[80px] rounded-lg border border-border/70 bg-background text-foreground ${
                          registerErrors.bio ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.bio && <p className="text-xs text-red-500">{registerErrors.bio}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">{t("auth.speaker.register.step2.photoLabel")}</label>
                      <div className={`flex items-center justify-between rounded-lg border border-dashed border-border/70 bg-muted/40 px-4 py-3 ${
                        registerErrors.photo ? "border-red-500" : ""
                      }`}>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{t("auth.speaker.register.step2.photoUpload")}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("auth.speaker.register.step2.photoHint")}
                          </p>
                          {photoName && <p className="text-xs text-primary">{photoName}</p>}
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                          <Upload className="h-4 w-4" />
                          {t("auth.speaker.register.step2.photoSelect")}
                          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                      </div>
                      {registerErrors.photo && <p className="text-xs text-red-500">{registerErrors.photo}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-lg border-border/70 cursor-pointer"
                        onClick={handleBackStep}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("auth.speaker.register.step2.back")}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec]"
                      >
                        {t("auth.speaker.register.step1.submit")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Header Section */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">{t("auth.speaker.register.step3.title")}</h3>
                      </div>
                      {/* <p className="text-xs text-muted-foreground">{t("auth.speaker.register.step3.description")}</p> */}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/50">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectWeekdays}
                        className="h-7 text-xs cursor-pointer px-2"
                      >
                        {t("auth.speaker.register.step3.selectWeekdays")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="h-7 text-xs cursor-pointer px-2"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t("auth.speaker.register.step3.clearAll")}
                      </Button>
                      {availableDaysCount > 0 && (
                        <div className="ml-auto flex items-center gap-1 text-xs text-primary font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{availableDaysCount} {t("auth.speaker.register.step3.daysSelected")}</span>
                        </div>
                      )}
                    </div>

                    {/* Availability Grid */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {availability.map((day, index) => {
                        const dayData = daysOfWeek.find((d) => d.key === day.day)
                        const dayLabel = dayData ? t(dayData.translationKey as any) : day.day
                        const isWeekend = day.day === 'saturday' || day.day === 'sunday'
                        return (
                          <div
                            key={day.day}
                            className={`group relative rounded-lg border transition-all duration-200 px-2.5 py-1 ${
                              day.isAvailable
                                ? 'border-primary/50 bg-primary/5 hover:border-primary/70'
                                : 'border-border/50 bg-muted/30 hover:border-border hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={`text-xs font-medium ${
                                  day.isAvailable ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {dayLabel}
                                </span>
                                {/* {isWeekend && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                                    {t("auth.speaker.register.step3.weekend")}
                                  </span>
                                )} */}
                                {day.isAvailable && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                              </div>
                              
                              {day.isAvailable ? (
                                <div className="flex items-center gap-2 flex-1 max-w-[280px]">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  <Input
                                    type="time"
                                    value={day.startTime || "09:00"}
                                    onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                                    className="h-8 text-xs flex-1"
                                  />
                                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                    {t('dashboard.availability.to')}
                                  </span>
                                  <Input
                                    type="time"
                                    value={day.endTime || "17:00"}
                                    onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                                    className="h-8 text-xs flex-1"
                                  />
                                </div>
                              ) : (
                                <p className="text-[10px] text-muted-foreground italic flex-shrink-0">
                                  {t("auth.speaker.register.step3.notAvailable")}
                                </p>
                              )}
                              
                              <Switch
                                checked={day.isAvailable || false}
                                onCheckedChange={() => handleAvailabilityToggle(index)}
                                className="flex-shrink-0"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Error Message */}
                    {registerErrors.availability && (
                      <div className="rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 p-2 text-xs text-red-600 dark:text-red-400">
                        {registerErrors.availability}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-lg border-border/70 cursor-pointer"
                        onClick={handleBackStep}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("auth.speaker.register.step3.back")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec] disabled:opacity-60"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("auth.speaker.register.step3.submitting")}
                          </>
                        ) : (
                          t("auth.speaker.register.step3.submit")
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


