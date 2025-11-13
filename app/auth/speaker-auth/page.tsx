"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Loader2, Upload, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, setUser } from "@/lib/store/authSlice"
import { authService } from "@/lib/services/authService"
import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

const emailRegex = /^[^\s@]+@gmail\.com$/i
const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type RegisterStep = 1 | 2

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
  const [birthDate, setBirthDate] = useState("")
  const [city, setCity] = useState("")
  const [bio, setBio] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoName, setPhotoName] = useState("")
  const [registerErrors, setRegisterErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    birthDate: "",
    city: "",
    bio: "",
    photo: "",
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
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const validateStepTwo = () => {
    const errors = {
      birthDate: birthDate ? "" : t("auth.validation.birthDateRequired"),
      city: city.trim() ? "" : t("auth.validation.cityRequired"),
      bio: bio.trim() ? "" : t("auth.validation.bioRequired"),
      photo: photo ? "" : t("auth.validation.photoRequired"),
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const handleNextStep = () => {
    if (validateStepOne()) {
      setRegisterError("")
      setRegisterStep(2)
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateStepTwo()) return

    setIsSubmitting(true)
    setRegisterError("")
    try {
      const [firstName = "", ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || firstName
      const ageValue = birthDate ? Math.max(18, Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))) : undefined
      const meetingPreference = [city, bio].filter(Boolean).join(" | ") || undefined

      const response = await authService.registerSpeaker({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerPassword,
        interests: [],
        meetingPreference,
        age: ageValue,
        avatar: photo ?? undefined,
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
    setBirthDate("")
    setCity("")
    setBio("")
    setPhoto(null)
    setPhotoName("")
    setRegisterErrors({ fullName: "", email: "", password: "", birthDate: "", city: "", bio: "", photo: "" })
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
                        onChange={(event) => setRegisterPassword(event.target.value)}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.password && <p className="text-xs text-red-500">{registerErrors.password}</p>}
                    </div>

                    <Button type="submit" className="h-10 cursor-pointer w-full rounded-lg bg-[#59248F] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec]">
                      {t("auth.speaker.register.step1.submit")}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
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
                          value={city}
                          onChange={(event) => setCity(event.target.value)}
                          className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                            registerErrors.city ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                          }`}
                        />
                        {registerErrors.city && <p className="text-xs text-red-500">{registerErrors.city}</p>}
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
                        onClick={() => setRegisterStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("auth.speaker.register.step2.back")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec] disabled:opacity-60"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("auth.speaker.register.step2.submitting")}
                          </>
                        ) : (
                          t("auth.speaker.register.step2.submit")
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

